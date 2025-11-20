# --- 1. Estágio de Build (Builder) ---
FROM node:20-bullseye-slim AS builder

# Instala OpenSSL e ca-certificates
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências originais
RUN npm install

# --- FIX FINAL: FORÇAR VERSÃO PARA 6.0.0 ---
# O hash do commit 2ba551f (Prisma 5.10.0) está inativo na CDN.
# Forçamos a instalação da versão 6.0.0 para garantir que um novo hash de commit seja usado,
# que buscará binários ativos na CDN.
RUN npm install prisma@6.0.0 @prisma/client@6.0.0 --save-exact

# Copia o schema do Prisma
COPY prisma ./prisma/

# Copia o restante do código-fonte
COPY . .

# Variável de segurança
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Gera o Prisma Client com a versão nova
RUN npx prisma generate

# Roda o build de produção do Next.js
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
FROM node:20-bullseye-slim AS runner

# Instala OpenSSL na produção
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia os arquivos de dependência ATUALIZADOS pelo builder
COPY --from=builder /app/package*.json ./

# Instala dependências de produção (o Prisma Client será copiado abaixo)
RUN npm install --omit=dev

# === MUDANÇA PRINCIPAL AQUI ===

# Copia a pasta COMPLETA do Prisma Client (inclui os arquivos JS/TS e engines)
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copia o schema do Prisma
COPY --from=builder /app/prisma ./prisma/

# Copia os artefatos de build do Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copia o arquivo de configuração
COPY --from=builder /app/next.config.ts ./

# Expõe a porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
# --- 1. Estágio de Build (Builder) ---
FROM node:20-bullseye-slim AS builder

# Instala OpenSSL e ca-certificates
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências originais
RUN npm install

# --- FIX FINAL: ATUALIZAR PARA LATEST ---
# Versões antigas (5.9, 5.10) estão retornando erro 500 na CDN.
# Forçamos a atualização para a versão MAIS RECENTE disponível para garantir binários ativos.
RUN npm install prisma@latest @prisma/client@latest

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
# (Isso garante que a produção use a mesma versão 'latest' instalada acima)
COPY --from=builder /app/package*.json ./

# Instala dependências de produção
RUN npm install --omit=dev

# Copia o CLIENTE PRISMA GERADO do builder
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
# --- 1. Estágio de Build (Builder) ---
# Mantemos o bullseye-slim pois é mais compatível, mas o problema real era a versão do Prisma
FROM node:20-bullseye-slim AS builder

# Instala OpenSSL e ca-certificates
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências originais do projeto
RUN npm install

# --- FIX CRÍTICO: FORÇAR VERSÃO DO PRISMA ---
# A versão 5.10.0 (commit 2ba551f...) está com erro 500 na CDN da Prisma.
# Forçamos a instalação da versão 5.9.0 para usar um hash de commit diferente e baixar binários funcionais.
RUN npm install prisma@5.9.0 @prisma/client@5.9.0 --save-exact

# Copia o schema do Prisma
COPY prisma ./prisma/

# Copia o restante do código-fonte
COPY . .

# Variável de segurança (pode ser mantida)
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Gera o Prisma Client
# Agora usará os binários da versão 5.9.0
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

# Copia apenas os package*.json do builder
COPY --from=builder /app/package*.json ./

# Instala SOMENTE as dependências de produção
# Nota: Como mudamos a versão no builder, precisamos garantir consistência aqui ou confiar no package-lock gerado lá.
# Para garantir, repetimos o fix ou usamos o package.json modificado do builder.
# O comando abaixo usará o package.json que foi alterado no passo anterior dentro do container builder.
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
# --- 1. Estágio de Build (Builder) ---
# MUDANÇA CRÍTICA: Usamos 'bullseye-slim' em vez de 'slim'.
# O 'slim' padrão usa Debian Bookworm (OpenSSL 3.0), que está com os arquivos corrompidos na CDN do Prisma.
# O 'bullseye' usa OpenSSL 1.1, que forçará o Prisma a baixar um binário diferente (funcional).
FROM node:20-bullseye-slim AS builder

# Instala OpenSSL (necessário) e ca-certificates
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala TODAS as dependências
RUN npm install

# Copia o schema do Prisma
COPY prisma ./prisma/

# Copia o restante do código-fonte
COPY . .

# --- FIX: IGNORAR CHECKSUM ---
# Mantemos isso por segurança, caso o erro de checksum persista no binário do OpenSSL 1.1
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Gera o Prisma Client
# Agora ele deve buscar o engine 'debian-openssl-1.1.x' em vez do 3.0.x
RUN npx prisma generate

# Roda o build de produção do Next.js
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
# MUDANÇA CRÍTICA: Devemos usar a mesma base 'bullseye-slim' na produção
FROM node:20-bullseye-slim AS runner

# Instala OpenSSL na produção também
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Define o ambiente para produção
ENV NODE_ENV=production

# Copia apenas os package*.json do builder
COPY --from=builder /app/package*.json ./

# Instala SOMENTE as dependências de produção
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
# --- 1. Estágio de Build (Builder) ---
# Trocamos alpine por slim para evitar o erro de download do binário musl
FROM node:20-slim AS builder

# Instala OpenSSL (Obrigatório para o Prisma em imagens Debian/Slim)
# Adicionado ca-certificates para garantir conexões SSL seguras
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
# Como estamos no Debian (Slim), o binário existe, mas o checksum está falhando (erro 500).
# Essa variável força o Prisma a pular a validação e usar o arquivo baixado.
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Gera o Prisma Client 
RUN npx prisma generate

# Roda o build de produção do Next.js
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
# Também usamos slim aqui para manter compatibilidade
FROM node:20-slim AS runner

# Instala OpenSSL na produção também (necessário para o Prisma rodar)
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
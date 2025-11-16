# --- 1. Estágio de Build (Builder) ---
# Usa node:20-alpine como base, que é leve
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência e instala
# Isso aproveita o cache do Docker, só reinstala se package*.json mudar
COPY package*.json ./
RUN npm install

# Copia o schema do Prisma
COPY prisma ./prisma/

# Copia o restante do código-fonte
# (O .dockerignore deve ser usado para pular node_modules, .env, .git, etc.)
COPY . .

# Gera o Prisma Client (necessário para o build do Next.js)
RUN npx prisma generate

# Roda o build de produção do Next.js
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
# Inicia de uma nova imagem base limpa
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente para produção (essencial para o Next.js)
ENV NODE_ENV=production

# Copia apenas os package*.json do builder
COPY --from=builder /app/package*.json ./

# Instala SOMENTE as dependências de produção
# Isso cria uma imagem final muito menor
RUN npm install --omit=dev

# Copia o schema do Prisma (MUITO IMPORTANTE)
# Isso é necessário para o seu 'release_command = "npx prisma migrate deploy"' no fly.toml
COPY --from=builder /app/prisma ./prisma/

# Copia os artefatos de build do Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copia o arquivo de configuração do Next.js (se existir)
# Use 'COPY --from=builder /app/next.config.mjs ./' se você usar a versão .mjs
COPY --from=builder /app/next.config.js ./

# Expõe a porta que o Next.js roda (e que o fly.toml espera)
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
# (Isso assume que seu package.json tem "start": "next start")
CMD ["npm", "start"]
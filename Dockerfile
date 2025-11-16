# --- 1. Estágio de Build (Builder) ---
# Usa node:20-alpine como base, que é leve
FROM node:20-alpine AS builder
WORKDIR /app

# (REMOVEMOS O "ENV NODE_ENV=production" DAQUI PARA CORRIGIR O BUILD)

# Copia os arquivos de dependência e instala TODAS as dependências (dev + prod)
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
# (Seu next.config.ts irá ignorar os erros de tipo)
RUN npm run build

# --- 2. Estágio de Produção (Runner) ---
# Inicia de uma nova imagem base limpa (CORREÇÃO DO ERRO "builder:latest")
FROM node:20-alpine AS runner
WORKDIR /app

# Define o ambiente para produção (essencial para o Next.js)
ENV NODE_ENV=production

# Copia apenas os package*.json do builder
COPY --from=builder /app/package*.json ./

# Instala SOMENTE as dependências de produção
# Isso cria uma imagem final muito menor
RUN npm install --omit=dev

# Copia o CLIENTE PRISMA GERADO do builder (CORREÇÃO DO ERRO "prisma generate")
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copia o schema do Prisma
COPY --from=builder /app/prisma ./prisma/

# Copia os artefatos de build do Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copia o arquivo de configuração do Next.js (CORREÇÃO DO NOME DO ARQUIVO)
COPY --from=builder /app/next.config.ts ./

# Expõe a porta que o Next.js roda
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
CMD ["npm", "start"]
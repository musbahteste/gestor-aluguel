# Dockerfile para Next.js + Prisma + PostgreSQL
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production

# Prisma: gere o client no build e prepare para produção
RUN npx prisma generate

# Exponha a porta padrão do Next.js
EXPOSE 3000

CMD ["npm", "start"]

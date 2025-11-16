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

# Copia o CLIENTE GERADO do builder para o node_modules do runner
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copia o schema do Prisma (MUITO IMPORTANTE)
# Isso é necessário para o seu 'release_command = "npx prisma migrate deploy"' no fly.toml
COPY --from=builder /app/prisma ./prisma/

# Copia os artefatos de build do Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copia o arquivo de configuração do Next.js (se existir)
COPY --from=builder /app/next.config.ts ./

# Expõe a porta que o Next.js roda (e que o fly.toml espera)
EXPOSE 3000

# Comando para iniciar o servidor Next.js em produção
# (Isso assume que seu package.json tem "start": "next start")
CMD ["npm", "start"]
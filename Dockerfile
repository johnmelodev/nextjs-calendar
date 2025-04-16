FROM node:18-slim

WORKDIR /app

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y openssl procps

# Copiar apenas os arquivos necessários para instalação de dependências
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar o restante do código fonte
COPY backend/src ./src/
COPY backend/tsconfig.json ./
COPY backend/.env ./

# Gerar os artefatos do Prisma para uso do cliente
RUN npx prisma generate

# Compilar o código TypeScript
RUN npm run build

# Expor a porta da aplicação
EXPOSE 3333

# Copiar e preparar o script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Definir o ponto de entrada e comando padrão
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "start"] 
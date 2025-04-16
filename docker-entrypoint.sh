#!/bin/bash
set -e

echo "===> Iniciando aplicação backend..."

# Verificar variáveis de ambiente
if [ -z "$DATABASE_URL" ]; then
  echo "AVISO: DATABASE_URL não está definida! Usando variável do arquivo .env"
  # Continuar mesmo assim, pois o arquivo .env pode conter a variável
fi

# Esperar pelo banco de dados (útil se estiver usando docker-compose)
echo "===> Verificando conexão com o banco de dados..."
MAX_RETRIES=30
RETRY_COUNT=0

while ! npx prisma db execute --stdin >/dev/null 2>&1 <<EOF
SELECT 1;
EOF
do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "ERRO: Não foi possível conectar ao banco de dados após $MAX_RETRIES tentativas."
    exit 1
  fi
  
  echo "Aguardando o banco de dados ficar disponível... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 2
done

echo "===> Banco de dados conectado com sucesso!"

# Executar migrações do Prisma
echo "===> Executando migrações do Prisma..."
npx prisma migrate deploy

# Verificar se a migração foi bem-sucedida
if [ $? -ne 0 ]; then
  echo "ERRO: Falha ao executar as migrações do Prisma"
  exit 1
fi

echo "===> Migrações aplicadas com sucesso!"

# Verificar se é necessário executar o seed
if [ "$RUN_SEED" = "true" ]; then
  echo "===> Executando seed do banco de dados..."
  npx prisma db seed
else
  echo "===> Pulando seed do banco de dados (defina RUN_SEED=true para executar)"
fi

# Iniciar o aplicativo
echo "===> Iniciando a aplicação..."
exec "$@" 
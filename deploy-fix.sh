#!/bin/bash
set -e

echo "🚀 DEPLOY RÁPIDO - CORREÇÃO COMPLETA"
echo "===================================="

cd ~/event-website-allurecompany

echo ""
echo "📥 1. Atualizando código..."
git pull

echo ""
echo "🛑 2. Parando tudo..."
docker stack rm allure
sleep 15

echo ""
echo "🗑️  3. Limpando volumes..."
docker volume rm allure_postgres_data 2>/dev/null || true
docker volume create allure_postgres_data

echo ""
echo "🔨 4. Limpando imagens antigas..."
docker system prune -af --volumes

echo ""
echo "🏗️  5. Recriando imagens..."
docker-compose build --no-cache

echo ""
echo "🚀 6. Fazendo deploy..."
docker stack deploy -c docker-compose.yml allure

echo ""
echo "⏳ 7. Aguardando serviços subirem (60 segundos)..."
sleep 60

echo ""
echo "✅ 8. Verificando status..."
docker service ls | grep allure

echo ""
echo "🎉 DEPLOY COMPLETO!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Aguarde todos os serviços ficarem 1/1"
echo "   2. Acesse: https://allure.mangoia.com.br"
echo "   3. Teste criar um evento SEM usar IA"
echo ""
echo "📊 Ver logs:"
echo "   docker service logs allure_backend --tail 20"
echo "   docker service logs allure_frontend --tail 20"

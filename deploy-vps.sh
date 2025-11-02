#!/bin/bash
set -e

# ==================================================
# DEPLOY PARA VPS COM TRAEFIK
# ==================================================

echo "🚀 DEPLOY COMPLETO PARA VPS"
echo "=========================="
echo ""
echo "Este script deve ser executado na VPS!"
echo ""

# Verificar se está no diretório correto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto"
    exit 1
fi

echo "📥 1. Atualizando código..."
git pull

echo ""
echo "🔧 2. Verificando .env..."
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cat > .env << 'ENV'
# PostgreSQL
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=allure123456
POSTGRES_DB=allure_events

# API
VITE_API_URL=https://allure.mangoia.com.br/api

# OpenAI (substitua pela sua chave real)
OPENAI_API_KEY=sk-proj-SUA_CHAVE_AQUI
ENV
    echo "⚠️  IMPORTANTE: Edite o .env e adicione sua chave da OpenAI!"
fi

echo ""
echo "🛑 3. Parando serviços antigos..."
docker stack rm allure 2>/dev/null || true
sleep 15

echo ""
echo "🗑️  4. Limpando volumes antigos..."
docker volume rm allure_postgres_data 2>/dev/null || true

echo ""
echo "🏗️  5. Construindo imagens..."
echo "   - Backend..."
docker build -t allure-events-backend:latest ./server
echo "   - Frontend..."
docker build --build-arg VITE_API_URL=https://allure.mangoia.com.br/api -t allure-events-frontend:latest .

echo ""
echo "💾 6. Criando volumes..."
docker volume create allure_postgres_data

echo ""
echo "🚀 7. Deploy com Docker Stack..."
docker stack deploy -c docker-compose.yml allure

echo ""
echo "⏳ 8. Aguardando serviços iniciarem..."
sleep 30

echo ""
echo "📊 9. Verificando status..."
docker service ls | grep allure
echo ""
docker stack ps allure --no-trunc | head -10

echo ""
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "📌 Próximos passos:"
echo "   1. Aguarde todos os serviços ficarem 1/1"
echo "   2. Acesse: https://allure.mangoia.com.br"
echo "   3. Se necessário, crie a tabela manualmente:"
echo "      docker exec -it \$(docker ps -q -f name=allure_postgres) psql -U allure_user -d allure_events"
echo ""
echo "📝 Comandos úteis:"
echo "   - Ver logs do backend: docker service logs allure_backend -f"
echo "   - Ver logs do frontend: docker service logs allure_frontend -f"
echo "   - Ver logs do postgres: docker service logs allure_postgres -f"
echo "   - Escalar serviços: docker service scale allure_backend=2"
echo ""

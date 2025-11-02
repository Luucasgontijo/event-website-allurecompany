#!/bin/bash

# Script de teste da API

API_URL="http://localhost:3001/api"

echo "🧪 Testando API Allure Events"
echo "=============================="
echo ""

# 1. Buscar todos os eventos
echo "📋 1. GET /api/events - Buscar todos os eventos"
echo "-----------------------------------------------"
curl -s $API_URL/events | jq '.' || curl -s $API_URL/events
echo ""
echo ""

# 2. Buscar evento por ID
echo "🔍 2. GET /api/events/1 - Buscar evento específico"
echo "---------------------------------------------------"
curl -s $API_URL/events/1 | jq '.' || curl -s $API_URL/events/1
echo ""
echo ""

# 3. Buscar por status
echo "📊 3. GET /api/events/status/ativo - Buscar por status"
echo "-------------------------------------------------------"
curl -s $API_URL/events/status/ativo | jq '.' || curl -s $API_URL/events/status/ativo
echo ""
echo ""

echo "✅ Testes concluídos!"
echo ""
echo "💡 Para criar um evento:"
echo "   curl -X POST $API_URL/events -H 'Content-Type: application/json' -d '{...}'"


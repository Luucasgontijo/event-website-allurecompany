#!/bin/bash

# Script para verificar se há informações sensíveis antes de commitar

echo "🔍 Verificando segurança antes do commit..."
echo "=========================================="

ERRORS=0

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Verificar se .env está no .gitignore
echo -e "\n${YELLOW}1. Verificando .gitignore...${NC}"
if grep -q "^\.env$" .gitignore; then
    echo -e "${GREEN}✓ .env está no .gitignore${NC}"
else
    echo -e "${RED}✗ ERRO: .env não está no .gitignore!${NC}"
    ERRORS=$((ERRORS+1))
fi

# 2. Verificar se há arquivos .env sendo trackeados
echo -e "\n${YELLOW}2. Verificando arquivos .env trackeados...${NC}"
ENV_FILES=$(git ls-files | grep -E "\.env$|\.env\.local$" | grep -v "\.env\.example$")
if [ -z "$ENV_FILES" ]; then
    echo -e "${GREEN}✓ Nenhum arquivo .env trackeado${NC}"
else
    echo -e "${RED}✗ ERRO: Arquivos .env encontrados no git:${NC}"
    echo "$ENV_FILES"
    ERRORS=$((ERRORS+1))
fi

# 3. Buscar possíveis chaves API hardcoded
echo -e "\n${YELLOW}3. Buscando chaves API hardcoded...${NC}"
API_KEYS=$(git diff --cached | grep -i "sk-proj-\|AKIA\|AIza" | grep -v "example\|your-key\|sua-chave")
if [ -z "$API_KEYS" ]; then
    echo -e "${GREEN}✓ Nenhuma chave API encontrada${NC}"
else
    echo -e "${RED}✗ AVISO: Possíveis chaves API encontradas:${NC}"
    echo "$API_KEYS"
    ERRORS=$((ERRORS+1))
fi

# 4. Buscar senhas hardcoded
echo -e "\n${YELLOW}4. Buscando senhas hardcoded...${NC}"
PASSWORDS=$(git diff --cached | grep -iE "password.*=.*['\"].*['\"]" | grep -v "example\|change_this\|your-password")
if [ -z "$PASSWORDS" ]; then
    echo -e "${GREEN}✓ Nenhuma senha hardcoded encontrada${NC}"
else
    echo -e "${RED}✗ AVISO: Possíveis senhas encontradas:${NC}"
    echo "$PASSWORDS"
    ERRORS=$((ERRORS+1))
fi

# 5. Verificar arquivos grandes (backups de banco)
echo -e "\n${YELLOW}5. Verificando arquivos grandes...${NC}"
LARGE_FILES=$(git diff --cached --name-only | xargs -I {} du -h {} 2>/dev/null | awk '$1 ~ /M|G/ {print $2}')
if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✓ Nenhum arquivo grande encontrado${NC}"
else
    echo -e "${YELLOW}⚠ AVISO: Arquivos grandes encontrados:${NC}"
    echo "$LARGE_FILES"
    echo -e "${YELLOW}   Verifique se não são backups de banco!${NC}"
fi

# 6. Verificar se arquivos .example existem
echo -e "\n${YELLOW}6. Verificando arquivos .example...${NC}"
if [ -f ".env.example" ] && [ -f "server/.env.example" ]; then
    echo -e "${GREEN}✓ Arquivos .example encontrados${NC}"
else
    echo -e "${YELLOW}⚠ AVISO: Alguns arquivos .example não encontrados${NC}"
fi

# 7. Verificar se README tem aviso de segurança
echo -e "\n${YELLOW}7. Verificando README...${NC}"
if grep -q "SEGURANCA.md" README.md; then
    echo -e "${GREEN}✓ README tem referência para SEGURANCA.md${NC}"
else
    echo -e "${YELLOW}⚠ AVISO: README deveria mencionar SEGURANCA.md${NC}"
fi

# Resumo
echo -e "\n=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ SEGURANÇA OK! Pode commitar.${NC}"
    exit 0
else
    echo -e "${RED}✗ ERROS ENCONTRADOS: $ERRORS${NC}"
    echo -e "${RED}NÃO COMMITE ATÉ RESOLVER!${NC}"
    exit 1
fi


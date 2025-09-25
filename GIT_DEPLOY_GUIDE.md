# 🚀 Guia de Configuração Git e Deploy

## 📋 Pré-requisitos Concluídos ✅

- ✅ Repositório Git inicializado
- ✅ Primeiro commit realizado
- ✅ Arquivos sensíveis protegidos (.gitignore)
- ✅ Variáveis de ambiente configuradas
- ✅ Scripts de deploy criados
- ✅ Documentação completa

## 🐙 Próximos Passos: GitHub

### 1. Criar Repositório no GitHub
1. **Acesse**: https://github.com
2. **Clique**: "New repository"
3. **Nome**: `allure-events-react`
4. **Descrição**: "Sistema de administração de eventos - Allure Music Hall"
5. **Visibilidade**: Private (recomendado) ou Public
6. **NÃO marque**: "Add a README file" (já temos)
7. **Clique**: "Create repository"

### 2. Conectar Repositório Local ao GitHub
```bash
# Adicionar remote origin
git remote add origin https://github.com/SEU_USUARIO/allure-events-react.git

# Fazer push inicial
git branch -M main
git push -u origin main
```

### 3. Configurar Deploy no Servidor

#### Opção A: Deploy Automático (Recomendado)
```bash
# No servidor (SSH: root@31.97.40.181)
cd /root
wget https://raw.githubusercontent.com/SEU_USUARIO/allure-events-react/main/deploy-git.sh
chmod +x deploy-git.sh

# Editar o script com suas informações
nano deploy-git.sh
# Alterar: GIT_REPO="https://github.com/SEU_USUARIO/allure-events-react.git"

# Executar deploy
./deploy-git.sh
```

#### Opção B: Deploy Manual Rápido
```bash
# Na sua máquina local
npm run build
scp -r dist/* root@31.97.40.181:/var/www/allure-events/

# No servidor
ssh root@31.97.40.181
cd /var/www/allure-events
sudo chown -R www-data:www-data .
sudo systemctl reload nginx
```

## 🔧 Configuração de Ambiente no Servidor

### 1. Criar .env.production no Servidor
```bash
# SSH no servidor
ssh root@31.97.40.181

# Criar arquivo de ambiente
cat > /var/www/allure-events/.env.production << EOF
# Configurações de Produção
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec
VITE_APP_TITLE=Allure Events Admin
VITE_APP_VERSION=1.0.0
VITE_PRODUCTION_URL=https://31.97.40.181
VITE_API_BASE_URL=https://script.google.com/macros/s
EOF
```

### 2. Rebuild com Variáveis de Produção
```bash
# No servidor, se usar deploy automático
cd /var/www/allure-events
npm run build
mv dist/* .
rmdir dist
sudo systemctl reload nginx
```

## 📊 Configurar Google Apps Script

### 1. Acessar Google Apps Script
- **URL**: https://script.google.com/
- **Login**: Com sua conta Google

### 2. Criar Novo Projeto
1. **Clique**: "Novo projeto"
2. **Nome**: "Allure Events Backend"
3. **Cole** o código do arquivo `google-apps-script.js`
4. **Salve**: Ctrl+S

### 3. Configurar Variáveis
```javascript
// No início do script Apps Script
const SHEET_ID = 'SEU_ID_DA_PLANILHA_AQUI'; // Pegar da URL do Google Sheets
const SHEET_NAME = 'Planilha1'; // Nome da aba da planilha
```

### 4. Fazer Deploy
1. **Clique**: "Implantar" → "Nova implantação"
2. **Tipo**: "Aplicativo da web"
3. **Executar como**: "Eu"
4. **Acesso**: "Qualquer pessoa"
5. **Clique**: "Implantar"
6. **Copie** a URL gerada

### 5. Atualizar URL no Projeto
```bash
# No servidor
nano /var/www/allure-events/.env.production
# Alterar: VITE_GOOGLE_SCRIPT_URL=SUA_URL_AQUI

# Rebuild
cd /var/www/allure-events
npm run build
mv dist/* .
sudo systemctl reload nginx
```

## 🔄 Fluxo de Atualizações

### Desenvolvimento → Produção
```bash
# 1. Desenvolver localmente
npm run dev

# 2. Testar mudanças
npm run build
npm run preview

# 3. Commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# 4. Deploy no servidor
ssh root@31.97.40.181
cd /var/www/allure-events
git pull origin main
npm run build
mv dist/* .
sudo systemctl reload nginx
```

### Deploy Automatizado (Futuro)
```bash
# Criar webhook GitHub → Servidor
# Script executado automaticamente a cada push
```

## 📱 URLs de Acesso

### Desenvolvimento
- **Local**: http://localhost:5173
- **Preview**: http://localhost:4173

### Produção  
- **HTTP**: http://31.97.40.181
- **HTTPS**: https://31.97.40.181 (se SSL configurado)
- **Domínio**: https://seu-dominio.com (quando configurar)

## 🔍 Verificações Pós-Deploy

### 1. Teste Básico
- ✅ Site carrega corretamente
- ✅ Login funciona
- ✅ Formulário aparece
- ✅ CSS está aplicado

### 2. Teste Funcional
- ✅ Preenchimento do formulário
- ✅ Prévia dos dados
- ✅ Envio para Google Sheets
- ✅ Dados aparecem na planilha

### 3. Teste Técnico
```bash
# Verificar logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Status serviços
sudo systemctl status nginx

# Teste conectividade
curl -I http://31.97.40.181
```

## 🆘 Resolução de Problemas

### Site não carrega
```bash
# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx

# Verificar permissões
sudo chown -R www-data:www-data /var/www/allure-events
sudo chmod -R 755 /var/www/allure-events
```

### Formulário não envia
1. **Verificar** URL do Apps Script
2. **Testar** função `testScript()` no Apps Script
3. **Verificar** permissões da planilha
4. **Checkar** logs do navegador (F12)

### Erro de CORS
1. **Verificar** função `doOptions()` no Apps Script
2. **Confirmar** que o script está deployado
3. **Testar** URL do script diretamente

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub
- [ ] Deploy realizado no servidor
- [ ] Google Apps Script configurado
- [ ] Planilha Google Sheets criada
- [ ] Variáveis de ambiente configuradas
- [ ] SSL configurado (opcional)
- [ ] Domínio apontando para servidor (opcional)
- [ ] Testes funcionais realizados
- [ ] Documentação atualizada

## 🎯 Comandos de Referência Rápida

```bash
# Deploy completo
ssh root@31.97.40.181 './deploy-git.sh'

# Atualização rápida
ssh root@31.97.40.181 'cd /var/www/allure-events && git pull && npm run build && mv dist/* . && sudo systemctl reload nginx'

# Verificar logs
ssh root@31.97.40.181 'tail -f /var/log/nginx/access.log'

# Status geral
ssh root@31.97.40.181 'systemctl status nginx && ls -la /var/www/allure-events'
```

---

🚀 **Seu projeto está pronto para o mundo!**
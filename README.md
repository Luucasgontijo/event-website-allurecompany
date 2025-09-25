# 🎵 Allure Events - Sistema de Administração

Sistema de administração web para gerenciamento de eventos do Allure Music Hall, com nova estrutura JSON de ingressos organizados por categoria e integração completa com Google Sheets.

## ✨ Funcionalidades Principais

- **📝 Formulário Inteligente**: Interface moderna para cadastro de eventos
- **🎫 Sistema de Ingressos JSON**: Estrutura organizada por categorias (setores, camarotes, personalizados)  
- **📊 Integração Google Sheets**: Armazenamento automático com JSON + texto legível
- **👁️ Prévia Avançada**: Visualização completa antes do envio
- **📱 Interface Responsiva**: Adaptada para desktop e mobile
- **🔐 Autenticação Segura**: Sistema de login protegido
- **🌐 Deploy Automatizado**: Scripts para produção via Git

## 🏗️ Arquitetura Técnica

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS com tema personalizado Allure
- **Forms**: React Hook Form com validação avançada
- **Icons**: Lucide React
- **Backend**: Google Apps Script otimizado
- **Database**: Google Sheets com estrutura JSON

## 🚀 Início Rápido

### 1. Clone e Configure
```bash
git clone https://github.com/seu-usuario/allure-events-react.git
cd allure-events-react
npm install
```

### 2. Configurar Ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
# Google Apps Script
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec

# Configurações
VITE_APP_TITLE=Allure Events Admin
VITE_APP_VERSION=1.0.0
```

### 3. Executar Desenvolvimento
```bash
npm run dev
```

## 📊 Nova Estrutura de Ingressos

### Formato JSON Organizado
```json
{
  "setores_mesa": [
    {
      "id": "1",
      "nome": "Mesa VIP",
      "preco": 150.00,
      "descricao": "Mesa para 4 pessoas"
    }
  ],
  "camarotes_premium": [...],
  "camarotes_empresariais": [...],
  "categoria_personalizada": [...]
}
```

### Benefícios
- ✅ **Organização por categoria**
- ✅ **Estrutura escalável** 
- ✅ **Fácil processamento**
- ✅ **Formato dd-mm-aaaa**
- ✅ **Horário 24h padrão**

## 🌐 Deploy em Produção

### Opção 1: Deploy Automático via Git
```bash
# No servidor
wget https://raw.githubusercontent.com/SEU_USUARIO/allure-events-react/main/deploy-git.sh
chmod +x deploy-git.sh
./deploy-git.sh
```

### Opção 2: Setup Manual Completo
```bash
# No servidor
wget https://raw.githubusercontent.com/SEU_USUARIO/allure-events-react/main/setup-vps.sh
chmod +x setup-vps.sh
# Editar variáveis no script
./setup-vps.sh
```

### Opção 3: Deploy Manual
```bash
npm run build
scp -r dist/* root@31.97.40.181:/var/www/allure-events/
```

## ⚙️ Configuração Google Sheets

### 1. Planilha (Cabeçalhos A1:J1)
```
ID do Evento | Nome do Evento | Artista/Organizador | Data e Horário | Status | Endereço | Descrição | INGRESSOS (JSON) | DATA DE CADASTRO | USUÁRIO
```

### 2. Google Apps Script
1. **Copie** o código de `google-apps-script.js`
2. **Configure**:
   ```javascript
   const SHEET_ID = 'SEU_ID_DA_PLANILHA';
   const SHEET_NAME = 'Planilha1';
   ```
3. **Deploy** como aplicativo web
4. **Copie** a URL gerada

📖 **Documentação detalhada**: `GOOGLE_APPS_SCRIPT_SETUP.md`

## 🔑 Credenciais de Acesso

### Administrador Principal
- **E-mail**: `Allure@mangoia.com.br`
- **Senha**: `AllureMusic2025!`

### Gerente
- **E-mail**: `gerente@allure.com.br`
- **Senha**: `AllureGerente2025!`

## 📁 Estrutura do Projeto

```
allure-events-react/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 🎯 EventForm.tsx          # Formulário principal (NOVO)
│   │   ├── 👁️ PreviewModal.tsx        # Modal prévia (ATUALIZADO)
│   │   ├── 🏠 Dashboard.tsx          # Painel principal
│   │   └── 🎉 SuccessModal.tsx       # Modal sucesso
│   ├── 📂 contexts/
│   │   └── 🔐 AuthContext.tsx        # Autenticação
│   ├── 📂 types/
│   │   └── 📝 index.ts               # Tipos TypeScript (NOVO)
│   ├── 📂 utils/
│   │   └── 📊 googleSheets.ts        # Integração API (ATUALIZADO)
│   └── 📂 assets/                    # Imagens e arquivos
├── 📋 .env.example                   # Exemplo variáveis
├── 🚀 deploy-git.sh                  # Deploy automatizado (NOVO)
├── ⚙️ setup-vps.sh                   # Setup servidor (NOVO)
├── 📖 DEPLOY_GUIDE.md               # Guia deploy completo
└── 📋 GOOGLE_APPS_SCRIPT_SETUP.md   # Guia Google Sheets
```

## 🔧 Scripts e Comandos

### Desenvolvimento
```bash
npm run dev          # Servidor desenvolvimento
npm run build        # Build produção
npm run preview      # Preview build local
npm run lint         # Verificar código
```

### Produção
```bash
./deploy-git.sh      # Deploy automático via Git
./setup-vps.sh       # Configurar servidor inicial
```

## 🔒 Segurança e Ambiente

### Variáveis Protegidas
- ✅ `.env*` no `.gitignore`
- ✅ Configurações sensíveis via ENV
- ✅ Scripts de deploy seguros
- ✅ Exemplo de configuração limpo

### Arquivos Protegidos
```bash
.env.local          # Desenvolvimento
.env.production     # Produção  
*.tar.gz           # Arquivos deploy
*.key              # Certificados SSL
```

## 📊 Monitoramento e Logs

### Logs do Sistema
```bash
# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Status serviços
sudo systemctl status nginx
```

### Debug Aplicação
```bash
# Console navegador (F12)
# Logs Google Apps Script
# Verificar network requests
```

## 🆘 Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| 🚫 CORS Error | Verificar `doOptions()` no Apps Script |
| 📊 Dados não salvam | Verificar SHEET_ID e permissões |
| 🌐 Site não carrega | Verificar Nginx e permissões |
| 🔒 SSL Error | Executar `sudo certbot renew` |
| 📱 Layout quebrado | Verificar build e assets |

### Comandos de Diagnóstico
```bash
# Verificar configuração
sudo nginx -t
systemctl status nginx

# Testar conectividade  
curl -I https://seu-site.com
ping seu-site.com

# Verificar logs
journalctl -u nginx
```

## 🤝 Contribuindo

### Fluxo de Desenvolvimento
1. **Fork** o repositório
2. **Clone** localmente
3. **Crie branch**: `git checkout -b feature/nova-funcionalidade`
4. **Desenvolva** e teste
5. **Commit**: `git commit -m "feat: nova funcionalidade"`
6. **Push**: `git push origin feature/nova-funcionalidade`  
7. **PR** no GitHub

### Padrões do Código
- ✅ **TypeScript** obrigatório
- ✅ **ESLint** configurado
- ✅ **Componentes funcionais**
- ✅ **Hooks personalizados**
- ✅ **Documentação inline**

## 📞 Suporte Técnico

### Canais de Ajuda
- 📖 **Documentação**: Arquivos `/docs` 
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussões**: GitHub Discussions
- 📧 **Email**: admin@allure-events.com

### Informações do Servidor
- 🌐 **IP**: 31.97.40.181
- 🔧 **Acesso SSH**: `ssh root@31.97.40.181`
- 📂 **Pasta Web**: `/var/www/allure-events`

---

## 📄 Licença e Propriedade

**© 2025 Allure Music Hall**  
Sistema proprietário de administração de eventos.

**Versão**: 2.0.0 | **Última atualização**: 25/09/2025

---

🎵 **Desenvolvido com ❤️ para o Allure Music Hall**
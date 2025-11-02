# 🎵 Allure Events - Sistema de Gerenciamento de Eventos

Sistema completo de gerenciamento de eventos com PostgreSQL, Docker e IA integrada (GPT-4o).

## 🚀 Início Rápido

### Com Docker (Recomendado)

```bash
# 1. Clonar e configurar
git clone <seu-repo>
cd allure-events-react
cp .env.docker.example .env

# 2. Adicionar sua chave OpenAI no .env
nano .env

# 3. Iniciar
docker-compose up -d

# 4. Acessar http://localhost
```

### Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install
cd server && npm install && cd ..

# 2. Configurar ambiente
cp .env.example .env
cp server/.env.example server/.env
nano server/.env  # Configurar credenciais

# 3. Iniciar PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# 4. Iniciar sistema
npm run dev  # Frontend em http://localhost:5173
cd server && npm run dev  # Backend em http://localhost:3001
```

## ⚠️ Configuração de Segurança

**IMPORTANTE:** Antes de usar em produção:

1. ✅ Copie `.env.example` para `.env` e preencha com suas credenciais
2. ✅ Copie `server/.env.example` para `server/.env`
3. ✅ Troque **todas** as senhas padrão
4. ✅ Configure sua `OPENAI_API_KEY` (obtenha em: https://platform.openai.com/api-keys)
5. ✅ Rode `./check-security.sh` antes de commitar para Git público

### Login Padrão
- **Email**: `admin@allure.com`
- **Senha**: `admin123`

⚠️ **Troque em produção!**

## ✨ Funcionalidades

- ✅ CRUD completo de eventos
- 📋 Sistema de ingressos com categorias personalizáveis
- 📁 Sidebar com lista de eventos em tempo real
- ✏️ Edição de eventos
- 🗑️ Exclusão com soft delete
- 🔍 Busca e filtro
- 🤖 **IA integrada** para preenchimento automático (GPT-4o)
  - 📷 Envie foto de flyer/convite
  - 📝 Cole texto do evento
  - ✨ IA preenche os campos automaticamente
- 🐳 Docker pronto para produção
- 🔒 Autenticação básica

## 🏗️ Arquitetura

```
Frontend (React + Vite)  →  Backend (Node.js + Express)  →  PostgreSQL
         :80                        :3001                      :5432
```

## 📡 API Endpoints

### Eventos
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar todos
- `GET /api/events/:id` - Buscar por ID
- `PUT /api/events/:id` - Atualizar
- `DELETE /api/events/:id` - Deletar

### IA (Requer OpenAI API Key)
- `POST /api/ai/extract-from-image` - Extrair de imagem (multipart/form-data)
- `POST /api/ai/extract-from-text` - Extrair de texto

## 🛠️ Tecnologias

**Frontend:** React 19, TypeScript, TailwindCSS, Vite  
**Backend:** Node.js 20, Express, TypeScript  
**Banco:** PostgreSQL 15  
**IA:** OpenAI GPT-4o  
**DevOps:** Docker, Nginx

## 🐳 Comandos Docker

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 Desenvolvimento

```bash
# Frontend
npm run dev          # Dev server
npm run build        # Build produção

# Backend
cd server
npm run dev          # Dev com hot reload
npm run build        # Build TypeScript
```

## 🔒 Segurança para Git Público

Antes de fazer push para repositório público:

```bash
# Verificar segurança
./check-security.sh

# Se tudo OK:
git add .
git commit -m "sua mensagem"
git push
```

**Arquivos protegidos pelo `.gitignore`:**
- `.env`, `server/.env`
- `*.key`, `*.pem`
- `*.sql`, `*.dump`
- `postgres_data/`

## 📝 Variáveis de Ambiente

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

### Backend (`server/.env`)
```env
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=SUA_SENHA_FORTE
POSTGRES_DB=allure_events
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=SUA_CHAVE_SECRETA_LONGA
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

### Docker (`.env` na raiz)
```env
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=SUA_SENHA_FORTE
POSTGRES_DB=allure_events
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Código aberto. Use livremente, mas não nos responsabilizamos por custos da OpenAI API ou perda de dados.

---

**Desenvolvido com ❤️ usando React, Node.js, PostgreSQL e OpenAI GPT-4**

# Allure Events API

Backend API para gerenciamento de eventos do Allure Music Hall.

## Tecnologias

- Node.js + TypeScript
- Express.js
- PostgreSQL
- Docker

## Estrutura

```
server/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── db/              # Conexão e migrations
│   ├── types/           # Tipos TypeScript
│   └── server.ts        # Arquivo principal
├── package.json
├── tsconfig.json
└── .env
```

## Instalação

```bash
npm install
```

## Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```env
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=allure_password_2024
POSTGRES_DB=allure_events
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Scripts

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build
npm run build

# Produção
npm run start

# Migrations
npm run migrate
```

## API Endpoints

### Health
- `GET /health` - Status da API

### Events
- `POST /api/events` - Criar evento
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Buscar evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento
- `GET /api/events/date/:date` - Eventos por data
- `GET /api/events/status/:status` - Eventos por status

## Desenvolvimento

O servidor roda por padrão na porta 3001.

```bash
npm run dev
```

## Produção

```bash
npm run build
npm start
```


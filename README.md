# 🎵 Allure Events - Event Management System

Complete event management system with PostgreSQL, Docker, and integrated AI (GPT-4o).

## 🚀 Quick Start

### With Docker (Recommended)

```bash
# 1. Clone and configure
git clone <your-repo>
cd allure-events-react
cp .env.docker.example .env

# 2. Add your OpenAI key to .env
nano .env

# 3. Start
docker-compose up -d

# 4. Access http://localhost
```

### Local Development

```bash
# 1. Install dependencies
npm install
cd server && npm install && cd ..

# 2. Configure environment
cp .env.example .env
cp server/.env.example server/.env
nano server/.env  # Configure credentials

# 3. Start PostgreSQL
docker-compose -f docker-compose.dev.yml up -d

# 4. Start system
npm run dev   # Frontend at http://localhost:5173
cd server && npm run dev   # Backend at http://localhost:3001
```

## ⚠️ Security Configuration

**IMPORTANT:** Before using in production:

1.  ✅ Copy `.env.example` to `.env` and fill in your credentials
2.  ✅ Copy `server/.env.example` to `server/.env`
3.  ✅ Change **all** default passwords
4.  ✅ Set up your `OPENAI_API_KEY` (get it at: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys))
5.  ✅ Run `./check-security.sh` before committing to a public Git

### Default Login

  - **Email**: `admin@allure.com`
  - **Password**: `admin123`

⚠️ **Change in production\!**

## ✨ Features

  - ✅ Full CRUD for events
  - 📋 Ticket system with customizable categories
  - 📁 Sidebar with real-time event list
  - ✏️ Event editing
  - 🗑️ Deletion with soft delete
  - 🔍 Search and filter
  - 🤖 **Integrated AI** for auto-fill (GPT-4o)
      - 📷 Upload flyer/invitation photo
      - 📝 Paste event text
      - ✨ AI fills in the fields automatically
  - 🐳 Production-ready Docker
  - 🔒 Basic authentication

## 🏗️ Architecture

```
Frontend (React + Vite)   →   Backend (Node.js + Express)   →   PostgreSQL
       :80                                :3001                       :5432
```

## 📡 API Endpoints

### Events

  - `POST /api/events` - Create event
  - `GET /api/events` - List all
  - `GET /api/events/:id` - Get by ID
  - `PUT /api/events/:id` - Update
  - `DELETE /api/events/:id` - Delete

### AI (Requires OpenAI API Key)

  - `POST /api/ai/extract-from-image` - Extract from image (multipart/form-data)
  - `POST /api/ai/extract-from-text` - Extract from text

## 🛠️ Technologies

**Frontend:** React 19, TypeScript, TailwindCSS, Vite
**Backend:** Node.js 20, Express, TypeScript
**Database:** PostgreSQL 15
**AI:** OpenAI GPT-4o
**DevOps:** Docker, Nginx

## 🐳 Docker Commands

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 🔧 Development

```bash
# Frontend
npm run dev         # Dev server
npm run build       # Production build

# Backend
cd server
npm run dev         # Dev with hot reload
npm run build       # Build TypeScript
```

## 🔒 Security for Public Git

Before pushing to a public repository:

```bash
# Check security
./check-security.sh

# If everything is OK:
git add .
git commit -m "your message"
git push
```

**Files protected by `.gitignore`:**

  - `.env`, `server/.env`
  - `*.key`, `*.pem`
  - `*.sql`, `*.dump`
  - `postgres_data/`

## 📝 Environment Variables

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

### Backend (`server/.env`)

```env
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
POSTGRES_DB=allure_events
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=YOUR_LONG_SECRET_KEY
OPENAI_API_KEY=sk-proj-your-key-here
```

### Docker (`.env` in root)

```env
POSTGRES_USER=allure_user
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD
POSTGRES_DB=allure_events
OPENAI_API_KEY=sk-proj-your-key-here
```

## 🤝 Contributing

1.  Fork the project
2.  Create a branch (`git checkout -b feature/new-feature`)
3.  Commit your changes (`git commit -m 'Add: new feature'`)
4.  Push (`git push origin feature/new-feature`)
5.  Open a Pull Request

## 📄 License

Open-source.

-----

**Developed with ❤️ using React, Node.js, PostgreSQL and OpenAI GPT-4**

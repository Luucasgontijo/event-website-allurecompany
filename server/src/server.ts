import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import pool from './db/connection.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: true, // Permite qualquer origem
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (sempre ativo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Rotas
app.use('/api', eventRoutes);
app.use('/api', aiRoutes);

// Rota de health check
app.get('/health', async (req, res) => {
  console.log('[HEALTH] Health check iniciado');
  const startTime = Date.now();
  try {
    console.log('[HEALTH] Testando conexão com PostgreSQL...');
    await pool.query('SELECT 1');
    const duration = Date.now() - startTime;
    console.log(`[HEALTH] ✅ Sucesso - PostgreSQL conectado (${duration}ms)`);
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      responseTime: `${duration}ms`
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[HEALTH] ❌ Erro - Falha ao conectar PostgreSQL (${duration}ms):`, error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      responseTime: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API Allure Events - Backend funcionando',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      createEvent: 'POST /api/events',
      getEvent: 'GET /api/events/:id',
      updateEvent: 'PUT /api/events/:id',
      deleteEvent: 'DELETE /api/events/:id'
    }
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Tratamento de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🎵 Allure Events API                 ║
║   📡 Servidor rodando na porta ${PORT}    ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
╚════════════════════════════════════════╝
  `);
  console.log(`[SERVER] Servidor Express iniciado com sucesso na porta ${PORT}`);
  console.log(`[SERVER] POSTGRES_HOST: ${process.env.POSTGRES_HOST || 'localhost'}`);
  console.log(`[SERVER] POSTGRES_PORT: ${process.env.POSTGRES_PORT || '5432'}`);
  console.log(`[SERVER] POSTGRES_DB: ${process.env.POSTGRES_DB || 'allure_events'}`);
  console.log(`[SERVER] POSTGRES_USER: ${process.env.POSTGRES_USER || 'allure_user'}`);
  console.log(`[SERVER] Health check disponível em: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido. Fechando servidor gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT recebido. Fechando servidor gracefully...');
  await pool.end();
  process.exit(0);
});

export default app;


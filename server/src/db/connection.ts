import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração do pool de conexões
export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'allure_events',
  user: process.env.POSTGRES_USER || 'allure_user',
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Teste de conexão
pool.on('connect', (client) => {
  console.log(`[POSTGRES] ✅ Nova conexão estabelecida com PostgreSQL`);
  console.log(`[POSTGRES] Conexão ID: ${client.processID}`);
});

pool.on('error', (err) => {
  console.error(`[POSTGRES] ❌ Erro inesperado no PostgreSQL:`, err);
  console.error(`[POSTGRES] Detalhes:`, {
    code: err.code,
    message: err.message,
    stack: err.stack
  });
  process.exit(-1);
});

// Log de configuração ao inicializar
console.log(`[POSTGRES] Configurando pool de conexões:`);
console.log(`[POSTGRES] Host: ${process.env.POSTGRES_HOST || 'localhost'}`);
console.log(`[POSTGRES] Port: ${process.env.POSTGRES_PORT || '5432'}`);
console.log(`[POSTGRES] Database: ${process.env.POSTGRES_DB || 'allure_events'}`);
console.log(`[POSTGRES] User: ${process.env.POSTGRES_USER || 'allure_user'}`);

export default pool;


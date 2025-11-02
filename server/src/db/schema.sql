-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  data VARCHAR(20),
  hora_inicio VARCHAR(10),
  hora_fim VARCHAR(10),
  local VARCHAR(255),
  endereco TEXT,
  descricao TEXT,
  imagem_url TEXT,
  ingressos JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'disponivel',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_events_data ON events(data);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


import pool from '../db/connection.js';
import type { Event, CreateEventDTO, UpdateEventDTO } from '../types/index.js';

export class EventService {
  // Criar novo evento
  async createEvent(eventData: CreateEventDTO): Promise<Event> {
    const {
      nome,
      data,
      horaInicio,
      horaFim,
      local,
      endereco,
      descricao,
      imagemUrl,
      ingressos,
      status
    } = eventData;

    const query = `
      INSERT INTO events (
        nome, data, hora_inicio, hora_fim, local,
        endereco, descricao, imagem_url, ingressos, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      nome,
      data || null,
      horaInicio || null,
      horaFim || null,
      local || null,
      endereco || null,
      descricao || null,
      imagemUrl || null,
      JSON.stringify(ingressos || []),
      status || 'disponivel'
    ];

    const result = await pool.query(query, values);
    return this.mapRowToEvent(result.rows[0]);
  }

  // Listar todos os eventos
  async getAllEvents(): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Buscar evento por ID
  async getEventById(id: number): Promise<Event | null> {
    const query = `
      SELECT * FROM events
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToEvent(result.rows[0]);
  }

  // Atualizar evento
  async updateEvent(id: number, eventData: Partial<CreateEventDTO>): Promise<Event | null> {
    // Primeiro verificar se o evento existe
    const existingEvent = await this.getEventById(id);
    if (!existingEvent) {
      return null;
    }

    // Construir query dinâmica baseada nos campos fornecidos
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (eventData.nome !== undefined) {
      updates.push(`nome = $${paramIndex++}`);
      values.push(eventData.nome);
    }
    if (eventData.data !== undefined) {
      updates.push(`data = $${paramIndex++}`);
      values.push(eventData.data);
    }
    if (eventData.horaInicio !== undefined) {
      updates.push(`hora_inicio = $${paramIndex++}`);
      values.push(eventData.horaInicio);
    }
    if (eventData.horaFim !== undefined) {
      updates.push(`hora_fim = $${paramIndex++}`);
      values.push(eventData.horaFim);
    }
    if (eventData.local !== undefined) {
      updates.push(`local = $${paramIndex++}`);
      values.push(eventData.local);
    }
    if (eventData.endereco !== undefined) {
      updates.push(`endereco = $${paramIndex++}`);
      values.push(eventData.endereco);
    }
    if (eventData.descricao !== undefined) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(eventData.descricao);
    }
    if (eventData.imagemUrl !== undefined) {
      updates.push(`imagem_url = $${paramIndex++}`);
      values.push(eventData.imagemUrl);
    }
    if (eventData.ingressos !== undefined) {
      updates.push(`ingressos = $${paramIndex++}`);
      values.push(JSON.stringify(eventData.ingressos));
    }
    if (eventData.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(eventData.status);
    }

    if (updates.length === 0) {
      return existingEvent; // Nada para atualizar
    }

    // Adicionar ID como último parâmetro
    values.push(id);

    const query = `
      UPDATE events
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.mapRowToEvent(result.rows[0]);
  }

  // Deletar evento (hard delete)
  async deleteEvent(id: number): Promise<boolean> {
    const query = `
      DELETE FROM events
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  // Buscar eventos por data
  async getEventsByDate(date: string): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      WHERE data = $1
      ORDER BY hora_inicio ASC
    `;

    const result = await pool.query(query, [date]);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Buscar eventos por status
  async getEventsByStatus(status: string): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      WHERE status = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [status]);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Mapear linha do banco para objeto Event
  private mapRowToEvent(row: any): Event {
    return {
      id: row.id,
      nome: row.nome,
      data: row.data,
      horaInicio: row.hora_inicio,
      horaFim: row.hora_fim,
      local: row.local,
      endereco: row.endereco,
      descricao: row.descricao,
      imagemUrl: row.imagem_url,
      ingressos: typeof row.ingressos === 'string' 
        ? JSON.parse(row.ingressos) 
        : row.ingressos,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export default new EventService();

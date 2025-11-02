import pool from '../db/connection.js';
import type { Event, CreateEventDTO, UpdateEventDTO } from '../types/index.js';

export class EventService {
  // Criar novo evento
  async createEvent(eventData: CreateEventDTO): Promise<Event> {
    const {
      nome,
      artista,
      data,
      horaInicio,
      horaTermino,
      fusoHorario,
      status,
      statusPersonalizado,
      endereco,
      descricao,
      ingressos,
      usuario
    } = eventData;

    const query = `
      INSERT INTO events (
        nome, artista, data, hora_inicio, hora_termino, fuso_horario,
        status, status_personalizado, endereco, descricao, ingressos, usuario
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      nome,
      artista,
      data,
      horaInicio,
      horaTermino || '',
      fusoHorario,
      status,
      statusPersonalizado || null,
      endereco || '',
      descricao || '',
      JSON.stringify(ingressos),
      usuario || 'Sistema'
    ];

    const result = await pool.query(query, values);
    return this.mapRowToEvent(result.rows[0]);
  }

  // Listar todos os eventos ativos
  async getAllEvents(): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      WHERE ativo = true
      ORDER BY data_cadastro DESC
    `;

    const result = await pool.query(query);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Buscar evento por ID
  async getEventById(id: number): Promise<Event | null> {
    const query = `
      SELECT * FROM events
      WHERE id = $1 AND ativo = true
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
    if (eventData.artista !== undefined) {
      updates.push(`artista = $${paramIndex++}`);
      values.push(eventData.artista);
    }
    if (eventData.data !== undefined) {
      updates.push(`data = $${paramIndex++}`);
      values.push(eventData.data);
    }
    if (eventData.horaInicio !== undefined) {
      updates.push(`hora_inicio = $${paramIndex++}`);
      values.push(eventData.horaInicio);
    }
    if (eventData.horaTermino !== undefined) {
      updates.push(`hora_termino = $${paramIndex++}`);
      values.push(eventData.horaTermino);
    }
    if (eventData.fusoHorario !== undefined) {
      updates.push(`fuso_horario = $${paramIndex++}`);
      values.push(eventData.fusoHorario);
    }
    if (eventData.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(eventData.status);
    }
    if (eventData.statusPersonalizado !== undefined) {
      updates.push(`status_personalizado = $${paramIndex++}`);
      values.push(eventData.statusPersonalizado);
    }
    if (eventData.endereco !== undefined) {
      updates.push(`endereco = $${paramIndex++}`);
      values.push(eventData.endereco);
    }
    if (eventData.descricao !== undefined) {
      updates.push(`descricao = $${paramIndex++}`);
      values.push(eventData.descricao);
    }
    if (eventData.ingressos !== undefined) {
      updates.push(`ingressos = $${paramIndex++}`);
      values.push(JSON.stringify(eventData.ingressos));
    }

    if (updates.length === 0) {
      return existingEvent; // Nada para atualizar
    }

    // Adicionar ID como último parâmetro
    values.push(id);

    const query = `
      UPDATE events
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex} AND ativo = true
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.mapRowToEvent(result.rows[0]);
  }

  // Deletar evento (soft delete)
  async deleteEvent(id: number): Promise<boolean> {
    const query = `
      UPDATE events
      SET ativo = false
      WHERE id = $1 AND ativo = true
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  // Buscar eventos por data
  async getEventsByDate(date: string): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      WHERE data = $1 AND ativo = true
      ORDER BY hora_inicio ASC
    `;

    const result = await pool.query(query, [date]);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Buscar eventos por status
  async getEventsByStatus(status: string): Promise<Event[]> {
    const query = `
      SELECT * FROM events
      WHERE status = $1 AND ativo = true
      ORDER BY data_cadastro DESC
    `;

    const result = await pool.query(query, [status]);
    return result.rows.map(row => this.mapRowToEvent(row));
  }

  // Mapear linha do banco para objeto Event
  private mapRowToEvent(row: any): Event {
    return {
      id: row.id,
      nome: row.nome,
      artista: row.artista,
      data: row.data,
      horaInicio: row.hora_inicio,
      horaTermino: row.hora_termino,
      fusoHorario: row.fuso_horario,
      status: row.status,
      statusPersonalizado: row.status_personalizado,
      endereco: row.endereco,
      descricao: row.descricao,
      ingressos: typeof row.ingressos === 'string' 
        ? JSON.parse(row.ingressos) 
        : row.ingressos,
      dataCadastro: row.data_cadastro,
      dataAtualizacao: row.data_atualizacao,
      usuario: row.usuario,
      ativo: row.ativo
    };
  }
}

export default new EventService();


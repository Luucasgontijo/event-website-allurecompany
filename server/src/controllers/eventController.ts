import { Request, Response } from 'express';
import eventService from '../services/eventService.js';
import type { CreateEventDTO, ApiResponse } from '../types/index.js';

export class EventController {
  // POST /api/events - Criar novo evento
  async createEvent(req: Request, res: Response) {
    try {
      const eventData: CreateEventDTO = req.body;

      // Validação básica
      if (!eventData.nome || !eventData.artista || !eventData.data || !eventData.horaInicio) {
        return res.status(400).json({
          success: false,
          error: 'Campos obrigatórios faltando: nome, artista, data, horaInicio'
        } as ApiResponse);
      }

      const newEvent = await eventService.createEvent(eventData);

      res.status(201).json({
        success: true,
        message: 'Evento criado com sucesso',
        data: newEvent
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao criar evento'
      } as ApiResponse);
    }
  }

  // GET /api/events - Listar todos os eventos
  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();

      res.json({
        success: true,
        data: events
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar eventos'
      } as ApiResponse);
    }
  }

  // GET /api/events/:id - Buscar evento por ID
  async getEventById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido'
        } as ApiResponse);
      }

      const event = await eventService.getEventById(id);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        } as ApiResponse);
      }

      res.json({
        success: true,
        data: event
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar evento'
      } as ApiResponse);
    }
  }

  // PUT /api/events/:id - Atualizar evento
  async updateEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido'
        } as ApiResponse);
      }

      const eventData: Partial<CreateEventDTO> = req.body;

      const updatedEvent = await eventService.updateEvent(id, eventData);

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        } as ApiResponse);
      }

      res.json({
        success: true,
        message: 'Evento atualizado com sucesso',
        data: updatedEvent
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao atualizar evento'
      } as ApiResponse);
    }
  }

  // DELETE /api/events/:id - Deletar evento
  async deleteEvent(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido'
        } as ApiResponse);
      }

      const deleted = await eventService.deleteEvent(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Evento não encontrado'
        } as ApiResponse);
      }

      res.json({
        success: true,
        message: 'Evento deletado com sucesso'
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao deletar evento'
      } as ApiResponse);
    }
  }

  // GET /api/events/date/:date - Buscar eventos por data
  async getEventsByDate(req: Request, res: Response) {
    try {
      const date = req.params.date;
      const events = await eventService.getEventsByDate(date);

      res.json({
        success: true,
        data: events
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar eventos por data:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar eventos'
      } as ApiResponse);
    }
  }

  // GET /api/events/status/:status - Buscar eventos por status
  async getEventsByStatus(req: Request, res: Response) {
    try {
      const status = req.params.status;
      const events = await eventService.getEventsByStatus(status);

      res.json({
        success: true,
        data: events
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao buscar eventos por status:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno ao buscar eventos'
      } as ApiResponse);
    }
  }
}

export default new EventController();


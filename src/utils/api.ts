import type { Event, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Função auxiliar para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro na requisição');
    }

    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// API de Eventos
export const eventsApi = {
  // Criar novo evento
  async create(eventData: Omit<Event, 'id'>): Promise<ApiResponse<Event>> {
    return apiRequest<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Listar todos os eventos
  async getAll(): Promise<ApiResponse<Event[]>> {
    return apiRequest<Event[]>('/events');
  },

  // Buscar evento por ID
  async getById(id: number): Promise<ApiResponse<Event>> {
    return apiRequest<Event>(`/events/${id}`);
  },

  // Atualizar evento
  async update(id: number, eventData: Partial<Event>): Promise<ApiResponse<Event>> {
    return apiRequest<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Deletar evento
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Buscar eventos por data
  async getByDate(date: string): Promise<ApiResponse<Event[]>> {
    return apiRequest<Event[]>(`/events/date/${date}`);
  },

  // Buscar eventos por status
  async getByStatus(status: string): Promise<ApiResponse<Event[]>> {
    return apiRequest<Event[]>(`/events/status/${status}`);
  },
};

// Função para testar conexão com a API
export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
}


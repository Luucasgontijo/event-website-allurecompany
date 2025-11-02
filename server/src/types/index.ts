export interface Ticket {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
}

export interface Event {
  id?: number;
  nome: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  local?: string;
  endereco?: string;
  descricao?: string;
  imagemUrl?: string;
  ingressos?: Ticket[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEventDTO {
  nome: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  local?: string;
  endereco?: string;
  descricao?: string;
  imagemUrl?: string;
  ingressos?: Ticket[];
  status?: string;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

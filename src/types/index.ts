export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Ticket {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
}

export interface IngressosStructure {
  'setores_mesa'?: Ticket[];
  'camarotes_premium'?: Ticket[];
  'camarotes_empresariais'?: Ticket[];
  [key: string]: Ticket[] | undefined; // Para categorias personalizadas
}

export interface Event {
  id?: string;
  nome: string;
  artista: string;
  data: string;
  horaInicio: string;
  horaTermino: string;
  fusoHorario: string;
  status: string;
  statusPersonalizado?: string;
  endereco: string;
  descricao?: string;
  ingressos: IngressosStructure;
  dataCadastro?: string;
  usuario?: string;
}

export interface EventFormData {
  nome: string;
  artista: string;
  data: string;
  horaInicio: string;
  horaTermino: string;
  fusoHorario: string;
  status: string;
  statusPersonalizado?: string;
  endereco: string;
  descricao?: string;
  ingressos: IngressosStructure;
}

export type EventStatus = 'disponivel' | 'esgotado' | 'cancelado' | 'personalizado';

export interface GoogleSheetsResponse {
  success: boolean;
  message?: string;
  data?: any;
}
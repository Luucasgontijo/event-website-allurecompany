export interface Ticket {
  id: string;
  nome: string;
  preco: number;
  descricao?: string;
}

export interface IngressosStructure {
  setores_mesa?: Ticket[];
  camarotes_premium?: Ticket[];
  camarotes_empresariais?: Ticket[];
  [key: string]: Ticket[] | undefined;
}

export interface Event {
  id?: number;
  nome: string;
  artista: string;
  data: string;
  horaInicio: string;
  horaTermino?: string;
  fusoHorario: string;
  status: string;
  statusPersonalizado?: string;
  endereco?: string;
  descricao?: string;
  ingressos: IngressosStructure;
  dataCadastro?: string;
  dataAtualizacao?: string;
  usuario?: string;
  ativo?: boolean;
}

export interface CreateEventDTO {
  nome: string;
  artista: string;
  data: string;
  horaInicio: string;
  horaTermino?: string;
  fusoHorario: string;
  status: string;
  statusPersonalizado?: string;
  endereco?: string;
  descricao?: string;
  ingressos: IngressosStructure;
  usuario?: string;
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


import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Eye, Save, MapPin, Calendar, FileText } from 'lucide-react';
import AIExtractor from './AIExtractor';
import type { EventFormData, Ticket, IngressosStructure, Event } from '../types';

interface EventFormProps {
  onPreview: (data: EventFormData) => void;
  onSubmit: (data: EventFormData) => void;
  isSubmitting?: boolean;
  initialData?: Event | null;
  isEditing?: boolean;
}

const DEFAULT_ADDRESS = 'Rodovia Arquiteto Helder Cândia, nº 2044 - Ribeirão do Lipa - Cuiabá- MT / Buffet Leila Malouf LTDA';

const DEFAULT_TICKET_CATEGORY_KEYS = ['setores_mesa', 'camarotes_premium', 'camarotes_empresariais'] as const;

const isDefaultCategoryKey = (
  value: string
): value is (typeof DEFAULT_TICKET_CATEGORY_KEYS)[number] =>
  DEFAULT_TICKET_CATEGORY_KEYS.includes(value as (typeof DEFAULT_TICKET_CATEGORY_KEYS)[number]);

const TICKET_CATEGORIES = [
  { key: DEFAULT_TICKET_CATEGORY_KEYS[0], label: 'Setores de Mesa' },
  { key: DEFAULT_TICKET_CATEGORY_KEYS[1], label: 'Camarotes Premium' },
  { key: DEFAULT_TICKET_CATEGORY_KEYS[2], label: 'Camarotes Empresariais' },
];

const EVENT_STATUSES = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'esgotado', label: 'Esgotado' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'personalizado', label: 'Status Personalizado' },
];

export default function EventForm({ 
  onPreview, 
  onSubmit, 
  isSubmitting = false,
  initialData = null,
  isEditing = false
}: EventFormProps) {
  const [showCustomStatus, setShowCustomStatus] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [ingressos, setIngressos] = useState<IngressosStructure>({
    setores_mesa: [],
    camarotes_premium: [],
    camarotes_empresariais: [],
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<EventFormData>({
    defaultValues: {
      nome: '',
      artista: '',
      data: '',
      horaInicio: '',
      horaTermino: '',
      fusoHorario: 'GMT-4',
      status: '',
      statusPersonalizado: '',
      endereco: DEFAULT_ADDRESS,
      descricao: '',
      ingressos: {
        setores_mesa: [],
        camarotes_premium: [],
        camarotes_empresariais: [],
      }
    }
  });

  // Carregar dados iniciais quando em modo de edição
  useEffect(() => {
    if (initialData && isEditing) {
      // Converter data de dd-mm-yyyy para yyyy-mm-dd (formato do input date)
      const convertDateToInput = (dateStr: string): string => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month}-${day}`;
        }
        return dateStr;
      };

      reset({
        nome: initialData.nome || '',
        artista: initialData.artista || '',
        data: convertDateToInput(initialData.data),
        horaInicio: initialData.horaInicio || '',
        horaTermino: initialData.horaTermino || '',
        fusoHorario: initialData.fusoHorario || 'GMT-4',
        status: initialData.status || '',
        statusPersonalizado: initialData.statusPersonalizado || '',
        endereco: initialData.endereco || DEFAULT_ADDRESS,
        descricao: initialData.descricao || '',
        ingressos: initialData.ingressos || {}
      });

      setIngressos(initialData.ingressos || {
        setores_mesa: [],
        camarotes_premium: [],
        camarotes_empresariais: [],
      });

      setShowCustomStatus(initialData.status === 'personalizado');

      // Identificar categorias personalizadas
      const customKeys = Object.keys(initialData.ingressos || {}).filter(
        key => !isDefaultCategoryKey(key)
      );
      setCustomCategories(customKeys);
    } else if (!isEditing) {
      // Reset para valores padrão quando não estiver editando
      reset({
        nome: '',
        artista: '',
        data: '',
        horaInicio: '',
        horaTermino: '',
        fusoHorario: 'GMT-4',
        status: '',
        statusPersonalizado: '',
        endereco: DEFAULT_ADDRESS,
        descricao: '',
        ingressos: {
          setores_mesa: [],
          camarotes_premium: [],
          camarotes_empresariais: [],
        }
      });
      setIngressos({
        setores_mesa: [],
        camarotes_premium: [],
        camarotes_empresariais: [],
      });
      setShowCustomStatus(false);
      setCustomCategories([]);
    }
  }, [initialData, isEditing, reset]);



  const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addTicketToCategory = (categoryKey: string) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      nome: '',
      preco: 0,
      descricao: ''
    };

    setIngressos(prev => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), newTicket]
    }));
  };

  const removeTicketFromCategory = (categoryKey: string, ticketIndex: number) => {
    setIngressos(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter((_, index) => index !== ticketIndex)
    }));
  };

  const updateTicket = (categoryKey: string, ticketIndex: number, field: keyof Ticket, value: any) => {
    setIngressos(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).map((ticket, index) => 
        index === ticketIndex ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addCustomCategory = () => {
    const categoryName = prompt('Nome da categoria personalizada:');
    if (categoryName && !customCategories.includes(categoryName)) {
      const categoryKey = categoryName.toLowerCase().replace(/\s+/g, '_');
      setCustomCategories(prev => [...prev, categoryKey]);
      setIngressos(prev => ({ ...prev, [categoryKey]: [] }));
    }
  };

  const removeCustomCategory = (categoryKey: string) => {
    setCustomCategories(prev => prev.filter(cat => cat !== categoryKey));
    setIngressos(prev => {
      const newIngressos = { ...prev };
      delete newIngressos[categoryKey];
      return newIngressos;
    });
  };

  const handlePreview = (data: EventFormData) => {
    const formattedData = {
      ...data,
      data: formatDateToDDMMYYYY(data.data),
      ingressos
    };
    onPreview(formattedData);
  };

  const handleFormSubmit = (data: EventFormData) => {
    const formattedData = {
      ...data,
      data: formatDateToDDMMYYYY(data.data),
      ingressos
    };
    onSubmit(formattedData);
  };

  const setDefaultAddress = () => {
    setValue('endereco', DEFAULT_ADDRESS);
  };

  const getAllCategories = () => {
    const defaultCategories = TICKET_CATEGORIES.map(cat => ({ key: cat.key, label: cat.label, isCustom: false }));
    const customCategoriesFormatted = customCategories.map(cat => ({
      key: cat,
      label: cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      isCustom: true
    }));
    return [...defaultCategories, ...customCategoriesFormatted];
  };

  // Função para preencher formulário com dados da IA
  const normalizeCategoryKey = (value: string) => {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const mapCategoryKey = (raw: string | undefined | null) => {
    if (!raw) return DEFAULT_TICKET_CATEGORY_KEYS[0];

    const normalized = normalizeCategoryKey(raw);
    if (!normalized) return DEFAULT_TICKET_CATEGORY_KEYS[0];

    if (normalized.includes('empres')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[2];
    }
    if (normalized.includes('premium') || normalized.includes('vip') || normalized.includes('camarote')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[1];
    }
    if (normalized.includes('mesa') || normalized.includes('table')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[0];
    }

    return normalized;
  };

  const detectCategoryFromTicket = (ticket: any): string => {
    const explicitCategory = ticket?.categoria || ticket?.categoriaIngressos || ticket?.category;
    if (explicitCategory) {
      return mapCategoryKey(String(explicitCategory));
    }

    const referenceText = `${ticket?.nome || ''} ${ticket?.descricao || ''}`.toLowerCase();

    if (referenceText.includes('empres')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[2];
    }
    if (referenceText.includes('premium') || referenceText.includes('vip') || referenceText.includes('camarote')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[1];
    }
    if (referenceText.includes('mesa') || referenceText.includes('table')) {
      return DEFAULT_TICKET_CATEGORY_KEYS[0];
    }

    return DEFAULT_TICKET_CATEGORY_KEYS[0];
  };

  const parsePrice = (value: any): number => {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const sanitized = value
        .replace(/[^0-9,.-]/g, '')
        .replace(/,(?=\d{3}(?:\D|$))/g, '')
        .replace(',', '.');
      const parsed = parseFloat(sanitized);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  };

  const handleAIExtract = (aiData: any) => {
    console.log('Dados extraídos pela IA:', aiData);

    // Converter data se necessário (dd-mm-yyyy para yyyy-mm-dd)
    const convertDate = (dateStr: string): string => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    };

    // Preencher campos do formulário
    if (aiData.nome) setValue('nome', aiData.nome);
    if (aiData.artista) setValue('artista', aiData.artista);
    if (aiData.data) setValue('data', convertDate(aiData.data));
    if (aiData.horaInicio) setValue('horaInicio', aiData.horaInicio);
    if (aiData.horaTermino) setValue('horaTermino', aiData.horaTermino);
    if (aiData.status) {
      setValue('status', aiData.status);
      setShowCustomStatus(aiData.status === 'personalizado');
    }
    if (aiData.endereco) setValue('endereco', aiData.endereco);
    if (aiData.descricao) setValue('descricao', aiData.descricao);

    // Preencher ingressos se houver
    if (aiData.ingressos) {
      const normalizedIngressos: IngressosStructure = {
        setores_mesa: [],
        camarotes_premium: [],
        camarotes_empresariais: [],
      };

      const detectedCustomCategories = new Set<string>();

      const pushTicketToCategory = (categoryKey: string, ticketData: any, index: number) => {
        if (!normalizedIngressos[categoryKey]) {
          normalizedIngressos[categoryKey] = [];
        }

        const ticket: Ticket = {
          id: ticketData.id ? String(ticketData.id) : `ai-${Date.now()}-${categoryKey}-${index}`,
          nome: ticketData.nome || ticketData.nomeIngresso || '',
          preco: parsePrice(ticketData.preco),
          descricao: ticketData.descricao || ticketData.detalhes || '',
        };

        normalizedIngressos[categoryKey] = [
          ...(normalizedIngressos[categoryKey] || []),
          ticket,
        ];
      };

      const handleTicketList = (tickets: any[], defaultCategory?: string) => {
        tickets.forEach((ticketData, index) => {
          const detectedCategory = detectCategoryFromTicket(ticketData);
          const categoryKey = defaultCategory ? mapCategoryKey(defaultCategory) : detectedCategory;
          if (!isDefaultCategoryKey(categoryKey)) {
            detectedCustomCategories.add(categoryKey);
          }
          pushTicketToCategory(categoryKey, ticketData, index);
        });
      };

      if (Array.isArray(aiData.ingressos)) {
        handleTicketList(aiData.ingressos);
      } else if (typeof aiData.ingressos === 'object') {
        Object.entries(aiData.ingressos).forEach(([categoriaBruta, tickets]) => {
          const targetCategory = mapCategoryKey(categoriaBruta);

          if (Array.isArray(tickets)) {
            handleTicketList(tickets, targetCategory);
          } else if (tickets && typeof tickets === 'object') {
            handleTicketList([tickets], targetCategory);
          }

          if (!isDefaultCategoryKey(targetCategory)) {
            detectedCustomCategories.add(targetCategory);
          }
        });
      }

      setIngressos(normalizedIngressos);
      setCustomCategories(Array.from(detectedCustomCategories));
    }

    // Mostrar notificação de sucesso
    alert('✨ Formulário preenchido automaticamente pela IA! Revise os dados antes de salvar.');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Botão IA - apenas para novos eventos */}
      {!isEditing && (
        <div className="flex justify-center pb-6 border-b border-stone-200">
          <AIExtractor onExtract={handleAIExtract} />
        </div>
      )}

      {/* Informações do Evento */}
      <section>
        <h2 className="text-xl font-semibold text-allure-brown mb-6 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Informações do Evento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome do Evento */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Nome do Evento *
            </label>
            <input
              {...register('nome', { required: 'Nome do evento é obrigatório' })}
              type="text"
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
              placeholder="Ex: Show de Jazz - Noite Especial"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          {/* Nome do Artista/Organizador */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Nome do Artista/Organizador *
            </label>
            <input
              {...register('artista', { required: 'Nome do artista/organizador é obrigatório' })}
              type="text"
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
              placeholder="Ex: João Silva & Banda, Empresa XYZ, Festival de Música"
            />
            {errors.artista && (
              <p className="mt-1 text-sm text-red-600">{errors.artista.message}</p>
            )}
          </div>

          {/* Data do Evento */}
          <div>
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Data do Evento * (formato: dd-mm-aaaa)
            </label>
            <input
              {...register('data', { required: 'Data do evento é obrigatória' })}
              type="date"
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
            />
            {errors.data && (
              <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
            )}
          </div>

          {/* Horário de Início */}
          <div>
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Horário de Início * (formato 24h)
            </label>
            <input
              {...register('horaInicio', { required: 'Horário de início é obrigatório' })}
              type="time"
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
            />
            {errors.horaInicio && (
              <p className="mt-1 text-sm text-red-600">{errors.horaInicio.message}</p>
            )}
          </div>

          {/* Fuso Horário */}
          <div>
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Fuso Horário *
            </label>
            <select
              {...register('fusoHorario', { required: 'Fuso horário é obrigatório' })}
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
            >
              <option value="GMT-4">GMT-4 (Horário Padrão de Cuiabá)</option>
              <option value="GMT-3">GMT-3 (Horário de Brasília)</option>
            </select>
            {errors.fusoHorario && (
              <p className="mt-1 text-sm text-red-600">{errors.fusoHorario.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Status *
            </label>
            <select
              {...register('status', { required: 'Status é obrigatório' })}
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
              onChange={(e) => {
                setShowCustomStatus(e.target.value === 'personalizado');
              }}
            >
              <option value="">Selecione o status</option>
              {EVENT_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          {/* Status Personalizado */}
          {showCustomStatus && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-allure-brown mb-2">
                Status Personalizado *
              </label>
              <input
                {...register('statusPersonalizado', { 
                  required: showCustomStatus ? 'Status personalizado é obrigatório' : false 
                })}
                type="text"
                className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
                placeholder="Digite o status personalizado"
              />
              {errors.statusPersonalizado && (
                <p className="mt-1 text-sm text-red-600">{errors.statusPersonalizado.message}</p>
              )}
            </div>
          )}

          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Endereço
            </label>
            <div className="flex gap-2">
              <input
                {...register('endereco')}
                type="text"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200"
                placeholder="Endereço do evento"
              />
              <button
                type="button"
                onClick={setDefaultAddress}
                className="px-4 py-3 bg-allure-brown text-white rounded-lg hover:bg-allure-secondary transition-colors duration-200 flex items-center"
                title="Usar endereço padrão"
              >
                <MapPin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-allure-brown mb-2">
              Descrição do Evento
            </label>
            <textarea
              {...register('descricao')}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-stone-300 bg-stone-50 text-allure-brown placeholder-stone-400 focus:bg-white focus:border-allure-brown focus:ring-4 focus:ring-allure-brown/10 focus:outline-none transition-all duration-200 resize-vertical"
              placeholder="Descrição detalhada do evento, artistas, horários, etc."
            />
          </div>
        </div>
      </section>

      {/* Sistema de Ingressos */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-allure-brown flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Tipos de Ingressos
          </h2>
          <button
            type="button"
            onClick={addCustomCategory}
            className="flex items-center space-x-2 bg-allure-secondary text-white px-4 py-2 rounded-lg hover:bg-allure-accent transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Categoria Personalizada</span>
          </button>
        </div>

        <div className="space-y-8">
          {getAllCategories().map(category => (
            <div key={category.key} className="bg-allure-light rounded-xl p-6 border-2 border-stone-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-allure-brown flex items-center">
                  {category.label}
                  {category.isCustom && (
                    <button
                      type="button"
                      onClick={() => removeCustomCategory(category.key)}
                      className="ml-2 text-red-600 hover:text-red-700"
                      title="Remover categoria"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => addTicketToCategory(category.key)}
                  className="flex items-center space-x-2 bg-allure-brown text-white px-3 py-1 rounded-lg hover:bg-allure-secondary transition-colors duration-200"
                >
                  <Plus className="h-3 w-3" />
                  <span>Adicionar Ingresso</span>
                </button>
              </div>

              <div className="space-y-4">
                {(ingressos[category.key] || []).map((ticket, index) => (
                  <div key={ticket.id} className="bg-white rounded-lg p-4 border border-stone-200">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-allure-brown">Ingresso {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeTicketFromCategory(category.key, index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nome do Ingresso */}
                      <div>
                        <label className="block text-sm font-medium text-allure-brown mb-1">
                          Nome do Ingresso *
                        </label>
                        <input
                          type="text"
                          value={ticket.nome}
                          onChange={(e) => updateTicket(category.key, index, 'nome', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-allure-brown placeholder-stone-400 focus:border-allure-brown focus:ring-2 focus:ring-allure-brown/20 focus:outline-none transition-all duration-200"
                          placeholder="Ex: Setor A, Mesa VIP"
                        />
                      </div>

                      {/* Preço */}
                      <div>
                        <label className="block text-sm font-medium text-allure-brown mb-1">
                          Preço (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={ticket.preco || ''}
                          onChange={(e) => updateTicket(category.key, index, 'preco', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-allure-brown placeholder-stone-400 focus:border-allure-brown focus:ring-2 focus:ring-allure-brown/20 focus:outline-none transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>

                      {/* Descrição do Ingresso */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-allure-brown mb-1">
                          Descrição
                        </label>
                        <input
                          type="text"
                          value={ticket.descricao || ''}
                          onChange={(e) => updateTicket(category.key, index, 'descricao', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-allure-brown placeholder-stone-400 focus:border-allure-brown focus:ring-2 focus:ring-allure-brown/20 focus:outline-none transition-all duration-200"
                          placeholder="Descrição adicional do ingresso"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!ingressos[category.key] || ingressos[category.key]!.length === 0) && (
                  <p className="text-stone-500 text-center py-4">
                    Nenhum ingresso adicionado nesta categoria
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ações do Formulário */}
      <div className="flex justify-center space-x-4 pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={handleSubmit(handlePreview)}
          className="flex items-center space-x-2 bg-allure-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-allure-accent transition-colors duration-200"
        >
          <Eye className="h-4 w-4" />
          <span>Visualizar Dados</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>{isEditing ? 'Salvando...' : 'Cadastrando...'}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Evento'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
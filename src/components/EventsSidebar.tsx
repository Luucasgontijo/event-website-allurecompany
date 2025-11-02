import { useState, useEffect } from 'react';
import { Calendar, Search, Edit2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { eventsApi } from '../utils/api';
import type { Event } from '../types';

interface EventsSidebarProps {
  onSelectEvent: (event: Event) => void;
  onDeleteEvent: (id: number) => void;
  selectedEventId?: number;
  refreshTrigger?: number;
}

export default function EventsSidebar({ 
  onSelectEvent, 
  onDeleteEvent,
  selectedEventId,
  refreshTrigger 
}: EventsSidebarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await eventsApi.getAll();
      
      if (response.success && response.data) {
        setEvents(response.data);
      } else {
        setError(response.error || 'Erro ao carregar eventos');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshTrigger]);

  const filteredEvents = events.filter(event => 
    event.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.artista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, eventName: string) => {
    if (!confirm(`Tem certeza que deseja deletar o evento "${eventName}"?`)) {
      return;
    }

    try {
      const response = await eventsApi.delete(id);
      if (response.success) {
        setEvents(events.filter(e => e.id !== id));
        onDeleteEvent(id);
      } else {
        alert(response.error || 'Erro ao deletar evento');
      }
    } catch (error) {
      alert('Erro ao deletar evento');
      console.error('Erro ao deletar:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'disponivel': 'bg-green-100 text-green-800',
      'esgotado': 'bg-red-100 text-red-800',
      'cancelado': 'bg-gray-100 text-gray-800',
    };
    return statusMap[status] || 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-stone-200">
      {/* Header */}
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-allure-brown flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Eventos Cadastrados
          </h2>
          <button
            onClick={loadEvents}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            title="Atualizar lista"
          >
            <RefreshCw className={`h-4 w-4 text-allure-brown ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar eventos..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 bg-stone-50 text-sm focus:bg-white focus:border-allure-brown focus:ring-2 focus:ring-allure-brown/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-allure-brown border-t-transparent mx-auto mb-2"></div>
              <p className="text-sm text-stone-600">Carregando...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center p-8">
            <Calendar className="h-12 w-12 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-600">
              {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento cadastrado'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                  selectedEventId === event.id
                    ? 'border-allure-brown bg-allure-light'
                    : 'border-stone-200 bg-white hover:border-allure-brown/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-allure-brown text-sm truncate">
                      {event.nome}
                    </h3>
                    <p className="text-xs text-stone-600 truncate">
                      {event.artista}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {event.data}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {event.statusPersonalizado || event.status}
                  </span>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => onSelectEvent(event)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-allure-brown text-white px-2 py-1.5 rounded text-xs hover:bg-allure-secondary transition-colors"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={() => event.id && handleDelete(event.id, event.nome)}
                    className="flex items-center justify-center bg-red-100 text-red-700 px-2 py-1.5 rounded hover:bg-red-200 transition-colors"
                    title="Deletar evento"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-200 bg-stone-50">
        <p className="text-xs text-stone-600 text-center">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'}
          {searchTerm && ' encontrado(s)'}
        </p>
      </div>
    </div>
  );
}


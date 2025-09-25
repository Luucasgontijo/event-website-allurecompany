import { X } from 'lucide-react';
import type { Event } from '../types';

interface PreviewModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ event, isOpen, onClose }: PreviewModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-200 bg-stone-50 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-allure-brown">
            Prévia do Evento
          </h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Informações do Evento */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-allure-brown mb-4">
              Informações do Evento
            </h3>
            <div className="bg-stone-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="font-medium text-allure-brown">Nome:</span>
                <span className="ml-2 text-stone-700">{event.nome}</span>
              </div>
              <div>
                <span className="font-medium text-allure-brown">Artista/Organizador:</span>
                <span className="ml-2 text-stone-700">{event.artista}</span>
              </div>
              <div>
                <span className="font-medium text-allure-brown">Data:</span>
                <span className="ml-2 text-stone-700">{event.data}</span>
              </div>
              <div>
                <span className="font-medium text-allure-brown">Horário:</span>
                <span className="ml-2 text-stone-700">{event.horaInicio} às {event.horaTermino} ({event.fusoHorario})</span>
              </div>
              <div>
                <span className="font-medium text-allure-brown">Status:</span>
                <span className="ml-2 text-stone-700">
                  {event.status === 'personalizado' ? event.statusPersonalizado : event.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-allure-brown">Endereço:</span>
                <span className="ml-2 text-stone-700">{event.endereco}</span>
              </div>
              {event.descricao && (
                <div>
                  <span className="font-medium text-allure-brown">Descrição:</span>
                  <p className="ml-2 text-stone-700 mt-1">{event.descricao}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ingressos */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-allure-brown mb-4">
              Ingressos por Categoria
            </h3>
            <div className="space-y-6">
              {Object.entries(event.ingressos).map(([categoryKey, tickets]) => {
                if (!tickets || tickets.length === 0) return null;
                
                const categoryLabel = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                return (
                  <div key={categoryKey} className="border border-stone-300 rounded-lg overflow-hidden">
                    <div className="bg-allure-brown text-white px-4 py-2">
                      <h4 className="font-semibold">{categoryLabel} ({tickets.length} tipo{tickets.length > 1 ? 's' : ''})</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {tickets.map((ingresso) => (
                        <div key={ingresso.id} className="bg-stone-50 rounded-lg p-3 border border-stone-200">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-allure-brown">
                              {ingresso.nome}
                            </h5>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(ingresso.preco)}
                            </span>
                          </div>
                          {ingresso.descricao && (
                            <div className="mt-2">
                              <span className="font-medium text-stone-600">Descrição:</span>
                              <span className="ml-1 text-stone-700">{ingresso.descricao}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {Object.values(event.ingressos).every(tickets => !tickets || tickets.length === 0) && (
                <p className="text-stone-500 text-center py-8">Nenhum ingresso cadastrado</p>
              )}
            </div>
          </div>

          {/* JSON Preview */}
          <div>
            <h3 className="text-lg font-semibold text-allure-brown mb-4">
              Dados JSON (Google Sheets)
            </h3>
            <pre className="bg-stone-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-stone-200 bg-stone-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="bg-allure-brown text-white px-6 py-2 rounded-lg hover:bg-allure-secondary transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
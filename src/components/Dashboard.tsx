import { useState } from 'react';
import { LogOut, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EventForm from './EventForm';
import EventsSidebar from './EventsSidebar';
import PreviewModal from './PreviewModal';
import SuccessModal from './SuccessModal';
import { eventsApi } from '../utils/api';
import type { Event } from '../types';
import allureLogo from '../assets/ALLURE---MARCA-BRANCA---SEM-FUNDO.png';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handlePreview = (eventData: Event) => {
    setPreviewData(eventData);
    setShowPreview(true);
  };

  const handleEventSubmit = async (eventData: Event) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let response;
      
      if (isEditing && selectedEvent?.id) {
        // Atualizar evento existente
        response = await eventsApi.update(selectedEvent.id, eventData);
      } else {
        // Criar novo evento
        response = await eventsApi.create(eventData);
      }
      
      if (response.success) {
        setShowSuccess(true);
        setRefreshTrigger(prev => prev + 1);
        setSelectedEvent(null);
        setIsEditing(false);
        setShowForm(false);
      } else {
        setSubmitError(response.error || 'Erro ao salvar evento');
      }
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
      setSubmitError('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setShowForm(true);
    setSubmitError(null);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setShowForm(true);
    setSubmitError(null);
  };

  const handleDeleteEvent = (id: number) => {
    if (selectedEvent?.id === id) {
      setSelectedEvent(null);
      setIsEditing(false);
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedEvent(null);
    setIsEditing(false);
    setShowForm(false);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-allure-light via-white to-allure-light font-spartan flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="bg-allure-brown rounded-xl p-3">
                <img 
                  src={allureLogo} 
                  alt="Allure Music Hall" 
                  className="h-8 w-auto filter brightness-0 invert"
                />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-allure-brown">
                  Gerenciamento de Eventos
                </h1>
                <p className="text-sm text-stone-600">
                  Bem-vindo, {user?.name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleNewEvent}
                className="flex items-center space-x-2 bg-allure-brown hover:bg-allure-secondary text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span className="font-medium">Novo Evento</span>
              </button>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0 overflow-hidden">
          <EventsSidebar
            onSelectEvent={handleSelectEvent}
            onDeleteEvent={handleDeleteEvent}
            selectedEventId={selectedEvent?.id}
            refreshTrigger={refreshTrigger}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {showForm ? (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
                {/* Header do Formulário */}
                <div className="px-8 py-6 bg-gradient-to-r from-allure-brown to-allure-secondary border-b border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {isEditing ? 'Editar Evento' : 'Novo Evento'}
                      </h2>
                      {isEditing && selectedEvent && (
                        <p className="text-allure-light mt-1">
                          {selectedEvent.nome}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleCancelEdit}
                      className="text-white hover:text-allure-light transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="p-6 bg-red-50 border-b border-red-200">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-red-800 font-medium">{submitError}</p>
                      <button
                        onClick={() => setSubmitError(null)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <EventForm 
                    onPreview={handlePreview}
                    onSubmit={handleEventSubmit}
                    isSubmitting={isSubmitting}
                    initialData={isEditing ? selectedEvent : undefined}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Plus className="h-16 w-16 text-stone-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-stone-700 mb-2">
                  Nenhum formulário aberto
                </h3>
                <p className="text-stone-600 mb-6">
                  Selecione um evento na sidebar para editar ou crie um novo evento
                </p>
                <button
                  onClick={handleNewEvent}
                  className="inline-flex items-center space-x-2 bg-allure-brown hover:bg-allure-secondary text-white px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Criar Novo Evento</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showPreview && previewData && (
        <PreviewModal
          event={previewData}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false);
            setRefreshTrigger(prev => prev + 1);
          }}
          onNewEvent={() => {
            setShowSuccess(false);
            handleNewEvent();
          }}
        />
      )}
    </div>
  );
}
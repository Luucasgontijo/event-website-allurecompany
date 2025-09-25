import { useState } from 'react';
import { LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import EventForm from './EventForm';
import PreviewModal from './PreviewModal';
import SuccessModal from './SuccessModal';
import { sendToGoogleSheets } from '../utils/googleSheets';
import type { Event } from '../types';
import allureLogo from '../assets/ALLURE---MARCA-BRANCA---SEM-FUNDO.png';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePreview = (eventData: Event) => {
    setPreviewData(eventData);
    setShowPreview(true);
  };

  const handleEventSubmit = async (eventData: Event) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await sendToGoogleSheets(eventData);
      
      if (response.success) {
        setShowSuccess(true);
      } else {
        setSubmitError(response.message || 'Erro ao cadastrar evento');
      }
    } catch (error) {
      console.error('Erro ao enviar evento:', error);
      setSubmitError('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-allure-light via-white to-allure-light font-spartan">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
                  Cadastro de Eventos
                </h1>
                <p className="text-sm text-stone-600">
                  Bem-vindo, {user?.name}
                </p>
              </div>
            </div>

            {/* User Actions */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
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
            />
          </div>
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
          onClose={() => setShowSuccess(false)}
          onNewEvent={() => {
            setShowSuccess(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
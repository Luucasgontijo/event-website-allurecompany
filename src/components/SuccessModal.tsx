import { CheckCircle, X, RotateCcw } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewEvent: () => void;
}

export default function SuccessModal({ isOpen, onClose, onNewEvent }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-allure-brown">
              Sucesso!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-700 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-allure-brown mb-2">
              Evento Cadastrado com Sucesso!
            </h3>
            <p className="text-stone-600 mb-6">
              Os dados do evento foram enviados para a planilha do Google Sheets e estão prontos para processamento pelo agente de IA.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onNewEvent}
                className="flex-1 flex items-center justify-center space-x-2 bg-allure-brown text-white px-4 py-2 rounded-lg hover:bg-allure-secondary transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Cadastrar Novo Evento</span>
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 bg-stone-200 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-300 transition-colors duration-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
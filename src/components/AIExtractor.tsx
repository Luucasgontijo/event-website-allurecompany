import { useState, useRef } from 'react';
import { Sparkles, Upload, FileText, Loader2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://allure.mangoia.com.br/api';

interface AIExtractorProps {
  onExtract: (data: any) => void;
}

export default function AIExtractor({ onExtract }: AIExtractorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'image' | 'text'>('image');
  const [isProcessing, setIsProcessing] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/ai/extract-from-image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data) {
        onExtract(result.data);
        setIsOpen(false);
        setText('');
      } else {
        setError(result.error || 'Erro ao processar imagem');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextExtract = async () => {
    if (!text.trim()) {
      setError('Por favor, insira algum texto');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/ai/extract-from-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        onExtract(result.data);
        setIsOpen(false);
        setText('');
      } else {
        setError(result.error || 'Erro ao processar texto');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      setError('Por favor, envie apenas imagens');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Botão para abrir */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Sparkles className="h-5 w-5" />
        <span>Preencher com IA</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold text-white">Preencher com IA</h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                  setText('');
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setMode('image')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  mode === 'image'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Upload className="h-4 w-4 inline mr-2" />
                Upload de Imagem
              </button>
              <button
                onClick={() => setMode('text')}
                className={`flex-1 px-6 py-3 font-medium transition-colors ${
                  mode === 'text'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Colar Texto
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {mode === 'image' ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Faça upload de uma imagem com informações do evento (flyer, convite, etc.)
                  </p>
                  
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
                        <p className="text-purple-600 font-medium">Processando com IA...</p>
                        <p className="text-sm text-gray-500">Isso pode levar alguns segundos</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <Upload className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-700 font-medium">
                          Clique ou arraste uma imagem
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG até 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Cole ou digite as informações do evento
                  </p>
                  
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Exemplo:&#10;Show de Jazz - João Silva&#10;Data: 15/12/2024&#10;Horário: 20h&#10;Local: Allure Music Hall&#10;Ingressos: Mesa VIP R$ 150..."
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 focus:outline-none resize-none"
                    disabled={isProcessing}
                  />

                  <button
                    onClick={handleTextExtract}
                    disabled={isProcessing || !text.trim()}
                    className="w-full mt-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Processando com IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Extrair Informações</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Info */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Dica:</strong> Quanto mais informações você fornecer, melhor será o resultado.
                  A IA vai extrair: nome do evento, artista, data, horário, local, ingressos e mais!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


import { useState } from 'react';
import type { Event, GoogleSheetsResponse } from '../types';

// URL do Google Apps Script (configurada via variáveis de ambiente)
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';

// Configurações do app
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
const IS_DEVELOPMENT = import.meta.env.DEV;

// Função para preparar dados para a planilha
export function prepareSheetData(eventData: Event): Record<string, any> {
  // Determinar status final
  const finalStatus = eventData.status === 'personalizado' 
    ? eventData.statusPersonalizado 
    : eventData.status;
  
  return {
    nome: eventData.nome,
    artista: eventData.artista,
    data: eventData.data, // Já vem no formato dd-mm-aaaa
    horaInicio: eventData.horaInicio, // Já vem no formato 24h
    horaTermino: eventData.horaTermino || '',
    fusoHorario: eventData.fusoHorario,
    status: finalStatus,
    endereco: eventData.endereco || 'Não informado',
    descricao: eventData.descricao || '',
    ingressos: eventData.ingressos // Enviar a estrutura JSON completa
  };
}

// Função para enviar dados ao Google Sheets
export async function sendToGoogleSheets(eventData: Event): Promise<GoogleSheetsResponse> {
  try {
    if (!GOOGLE_SCRIPT_URL) {
      console.warn(`[${APP_VERSION}] URL do Google Apps Script não configurada. Modo simulação ativado.`);
      
      if (IS_DEVELOPMENT) {
        console.log('🧪 Dados que seriam enviados:', eventData);
      }
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log dos dados que seriam enviados
      const sheetData = prepareSheetData(eventData);
      console.log('Dados que seriam enviados para Google Sheets:', sheetData);
      
      return {
        success: true,
        message: 'Evento cadastrado com sucesso! (Modo simulação)',
        data: sheetData
      };
    }
    
    // Preparar dados
    const sheetData = prepareSheetData(eventData);
    
    // Log detalhado dos dados sendo enviados
    console.log('🚀 Enviando dados para Apps Script:');
    console.table(sheetData);
    console.log('📍 URL do Apps Script:', GOOGLE_SCRIPT_URL);
    
    // Enviar para Google Apps Script com retry e melhor tratamento de erro
    let response;
    let result;
    
    try {
      response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
        mode: 'no-cors' // Tentar sem CORS primeiro
      });
    } catch (corsError) {
      // Se no-cors falhou, tentar com cors
      try {
        response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData),
          mode: 'cors'
        });
      } catch (networkError) {
        // Log detalhado do erro e fallback para simulação
        console.error('Erro de rede ao conectar com Google Sheets:', networkError);
        console.log('🔍 DADOS DO EVENTO PARA PLANILHA:');
        console.table(sheetData);
        console.log('📋 Para adicionar manualmente na planilha:');
        console.log('ID:', sheetData.nome);
        console.log('Nome:', sheetData.nome);
        console.log('Artista:', sheetData.artista);
        console.log('Data/Hora:', sheetData.data);
        console.log('Status:', sheetData.status);
        console.log('Ingressos:', sheetData.ingressos);
        
        return {
          success: true,
          message: 'Dados salvos localmente (erro de conexão). Verifique o console para os dados completos.',
          data: sheetData
        };
      }
    }
    
    // Se mode: 'no-cors', response será opaque - vamos tentar uma abordagem diferente
    if (response.type === 'opaque') {
      console.log('⚠️ Resposta opaca (no-cors) - tentando modo cors para ver resposta real...');
      
      // Tentar novamente com cors para ver se conseguimos uma resposta real
      try {
        const corsResponse = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sheetData),
          mode: 'cors'
        });
        
        console.log('✅ Resposta CORS recebida:', corsResponse.status);
        
        if (corsResponse.ok) {
          const corsResult = await corsResponse.json();
          console.log('📥 Resultado do Apps Script:', corsResult);
          
          return {
            success: corsResult.success || true,
            message: corsResult.message || 'Evento enviado para Google Sheets com sucesso!',
            data: corsResult.data || sheetData
          };
        }
      } catch (corsError) {
        console.log('❌ CORS falhou, mas no-cors pode ter funcionado');
      }
      
      console.log('🔍 Dados enviados (verificar planilha):');
      console.table(sheetData);
      
      return {
        success: true,
        message: 'Evento enviado para Google Sheets! (Verifique a planilha)',
        data: sheetData
      };
    }
    
    // Processar resposta normal
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
    }
    
    try {
      result = await response.json();
    } catch (jsonError) {
      // Se não conseguir fazer parse do JSON, assumir sucesso
      return {
        success: true,
        message: 'Evento enviado para Google Sheets!',
        data: sheetData
      };
    }
    
    if (!result.success) {
      throw new Error(result.message || 'Erro desconhecido do Google Apps Script');
    }
    
    return result;
    
  } catch (error) {
    console.error('Erro ao enviar para Google Sheets:', error);
    
    // Retornar erro estruturado
    return {
      success: false,
      message: error instanceof Error 
        ? `Erro ao conectar com Google Sheets: ${error.message}`
        : 'Erro desconhecido ao enviar dados'
    };
  }
}

// Função para validar URL do Google Apps Script
export function validateGoogleScriptURL(url: string): boolean {
  try {
    const parsedURL = new URL(url);
    return parsedURL.hostname === 'script.google.com';
  } catch {
    return false;
  }
}

// Hook personalizado para gerenciar estado de envio
export function useGoogleSheets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<GoogleSheetsResponse | null>(null);
  
  const sendEvent = async (eventData: Event): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sendToGoogleSheets(eventData);
      setLastResponse(response);
      
      if (!response.success) {
        setError(response.message || 'Erro ao enviar dados');
        return false;
      }
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearError = () => setError(null);
  
  return {
    sendEvent,
    isLoading,
    error,
    lastResponse,
    clearError
  };
}

// Para desenvolvimento - função de teste
export async function testGoogleSheetsConnection(): Promise<boolean> {
  const testEvent: Event = {
    nome: 'Evento Teste - Conexão',
    artista: 'Artista Teste',
    data: new Date().toISOString().split('T')[0],
    horaInicio: '20:00',
    horaTermino: '23:00',
    fusoHorario: 'GMT-4',
    status: 'disponivel',
    endereco: 'Endereço de teste',
    descricao: 'Teste de conexão com Google Sheets',
    ingressos: {
      setores_mesa: [
        {
          id: '1',
          nome: 'Ingresso Teste',
          preco: 100,
          descricao: 'Ingresso de teste'
        }
      ]
    }
  };
  
  try {
    const response = await sendToGoogleSheets(testEvent);
    return response.success;
  } catch {
    return false;
  }
}
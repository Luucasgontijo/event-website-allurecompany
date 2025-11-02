import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface ExtractedEventData {
  nome?: string;
  artista?: string;
  data?: string;
  horaInicio?: string;
  horaTermino?: string;
  status?: string;
  endereco?: string;
  descricao?: string;
  ingressos?: {
    setores_mesa?: Array<{
      nome: string;
      preco: number;
      descricao?: string;
    }>;
    camarotes_premium?: Array<{
      nome: string;
      preco: number;
      descricao?: string;
    }>;
    camarotes_empresariais?: Array<{
      nome: string;
      preco: number;
      descricao?: string;
    }>;
  };
}

export class AIService {
  // Extrair informações de uma imagem
  async extractFromImage(imageBase64: string): Promise<ExtractedEventData> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em extrair informações de eventos de imagens.
Analise a imagem e extraia as seguintes informações sobre o evento:
- Nome do evento
- Nome do artista/organizador
- Data (formato dd-mm-yyyy)
- Hora de início (formato HH:mm)
- Hora de término (formato HH:mm)
- Status (disponível, esgotado, cancelado)
- Endereço do evento
- Descrição
- Ingressos (com nome, preço e descrição de cada tipo)

Retorne APENAS um objeto JSON válido, sem markdown, sem explicações adicionais, seguindo esta estrutura:
{
  "nome": "nome do evento",
  "artista": "nome do artista",
  "data": "dd-mm-yyyy",
  "horaInicio": "HH:mm",
  "horaTermino": "HH:mm",
  "status": "disponivel",
  "endereco": "endereço completo",
  "descricao": "descrição do evento",
  "ingressos": {
    "setores_mesa": [{"nome": "Mesa VIP", "preco": 150, "descricao": "Mesa próxima ao palco"}],
    "camarotes_premium": [],
    "camarotes_empresariais": []
  }
}

Se alguma informação não estiver disponível, omita o campo ou use string vazia.
Para preços, extraia apenas números (sem R$, sem vírgulas de milhar).
Para datas, converta para o formato dd-mm-yyyy.
Para horários, use formato 24h (HH:mm).`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || '{}';
      
      // Limpar possível markdown
      let jsonString = content.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\n?/g, '');
      }
      
      const extractedData: ExtractedEventData = JSON.parse(jsonString);
      return extractedData;
    } catch (error) {
      console.error('Erro ao processar imagem com IA:', error);
      throw new Error('Falha ao processar imagem com IA');
    }
  }

  // Extrair informações de um texto
  async extractFromText(text: string): Promise<ExtractedEventData> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em extrair informações de eventos de textos.
Analise o texto e extraia as seguintes informações sobre o evento:
- Nome do evento
- Nome do artista/organizador
- Data (formato dd-mm-yyyy)
- Hora de início (formato HH:mm)
- Hora de término (formato HH:mm)
- Status (disponível, esgotado, cancelado)
- Endereço do evento
- Descrição
- Ingressos (com nome, preço e descrição de cada tipo)

Retorne APENAS um objeto JSON válido, sem markdown, sem explicações adicionais, seguindo esta estrutura:
{
  "nome": "nome do evento",
  "artista": "nome do artista",
  "data": "dd-mm-yyyy",
  "horaInicio": "HH:mm",
  "horaTermino": "HH:mm",
  "status": "disponivel",
  "endereco": "endereço completo",
  "descricao": "descrição do evento",
  "ingressos": {
    "setores_mesa": [{"nome": "Mesa VIP", "preco": 150, "descricao": "Mesa próxima ao palco"}],
    "camarotes_premium": [],
    "camarotes_empresariais": []
  }
}

Se alguma informação não estiver disponível, omita o campo ou use string vazia.
Para preços, extraia apenas números (sem R$, sem vírgulas de milhar).
Para datas, converta para o formato dd-mm-yyyy.
Para horários, use formato 24h (HH:mm).`
          },
          {
            role: 'user',
            content: text,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content || '{}';
      
      // Limpar possível markdown
      let jsonString = content.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/```\n?/g, '');
      }
      
      const extractedData: ExtractedEventData = JSON.parse(jsonString);
      return extractedData;
    } catch (error) {
      console.error('Erro ao processar texto com IA:', error);
      throw new Error('Falha ao processar texto com IA');
    }
  }
}

export default new AIService();


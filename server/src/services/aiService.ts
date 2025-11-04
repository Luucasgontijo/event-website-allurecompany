import OpenAI from 'openai';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const PLACEHOLDER_TOKENS = ['your-api-key-here', 'sua_chave_aqui'];

const ensureApiKeyIsValid = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada');
  }

  const isPlaceholder = PLACEHOLDER_TOKENS.some((token) =>
    apiKey.toLowerCase().includes(token)
  );

  if (isPlaceholder) {
    throw new Error('OPENAI_API_KEY inválida ou placeholder. Atualize sua variável de ambiente.');
  }
};

const normalizeJsonResponse = (content: string) => {
  let jsonString = content.trim();

  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.replace(/```\n?/g, '');
  }

  try {
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.error('[AI] Falha ao converter resposta em JSON:', {
      contentPreview: jsonString.slice(0, 200),
      error: parseError instanceof Error ? parseError.message : parseError,
    });
    throw new Error('Não foi possível interpretar a resposta da IA.');
  }
};

export interface ExtractedEventData {
  nome?: string;
  local?: string;
  data?: string;
  horaInicio?: string;
  horaFim?: string;
  status?: string;
  endereco?: string;
  descricao?: string;
  imagemUrl?: string;
  ingressos?: Array<{
    id: string;
    nome: string;
    preco: number;
    descricao?: string;
  }>;
}

export class AIService {
  // Extrair informações de uma imagem
  async extractFromImage(imageBase64: string): Promise<ExtractedEventData> {
    ensureApiKeyIsValid();

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em extrair informações de eventos de imagens.
Analise a imagem e extraia as seguintes informações sobre o evento:
- Nome do evento
- Local do evento
- Data (formato dd-mm-yyyy)
- Hora de início (formato HH:mm)
- Hora de término (formato HH:mm)
- Status (disponível, esgotado, cancelado)
- Endereço do evento
- Descrição
- Ingressos (lista com nome, preço e descrição)

Retorne APENAS um objeto JSON válido, sem markdown, sem explicações adicionais, seguindo esta estrutura:
{
  "nome": "nome do evento",
  "local": "nome do local",
  "data": "dd-mm-yyyy",
  "horaInicio": "HH:mm",
  "horaFim": "HH:mm",
  "status": "disponivel",
  "endereco": "endereço completo",
  "descricao": "descrição do evento",
  "ingressos": [
    {"id": "1", "nome": "Pista", "preco": 100, "descricao": "Ingresso comum"}
  ]
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
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{}';
      const extractedData: ExtractedEventData = normalizeJsonResponse(content);
      return extractedData;
    } catch (error) {
      console.error('Erro ao processar imagem com IA:', error);

      if (error && typeof error === 'object') {
        const apiError = (error as any).error;
        if (apiError?.message) {
          throw new Error(`Falha ao processar imagem com IA: ${apiError.message}`);
        }
      }

      throw new Error('Falha ao processar imagem com IA');
    }
  }

  // Extrair informações de um texto
  async extractFromText(text: string): Promise<ExtractedEventData> {
    ensureApiKeyIsValid();

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em extrair informações de eventos de textos.
Analise o texto e extraia as seguintes informações sobre o evento:
- Nome do evento
- Local do evento
- Data (formato dd-mm-yyyy)
- Hora de início (formato HH:mm)
- Hora de término (formato HH:mm)
- Status (disponível, esgotado, cancelado)
- Endereço do evento
- Descrição
- Ingressos (lista com nome, preço e descrição)

Retorne APENAS um objeto JSON válido, sem markdown, sem explicações adicionais, seguindo esta estrutura:
{
  "nome": "nome do evento",
  "local": "nome do local",
  "data": "dd-mm-yyyy",
  "horaInicio": "HH:mm",
  "horaFim": "HH:mm",
  "status": "disponivel",
  "endereco": "endereço completo",
  "descricao": "descrição do evento",
  "ingressos": [
    {"id": "1", "nome": "Pista", "preco": 100, "descricao": "Ingresso comum"}
  ]
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
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content || '{}';
      const extractedData: ExtractedEventData = normalizeJsonResponse(content);
      return extractedData;
    } catch (error) {
      console.error('Erro ao processar texto com IA:', error);

      if (error && typeof error === 'object') {
        const apiError = (error as any).error;
        if (apiError?.message) {
          throw new Error(`Falha ao processar texto com IA: ${apiError.message}`);
        }
      }

      throw new Error('Falha ao processar texto com IA');
    }
  }
}

export default new AIService();
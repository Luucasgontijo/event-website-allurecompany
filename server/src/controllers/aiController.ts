import { Request, Response } from 'express';
import aiService from '../services/aiService.js';
import type { ApiResponse } from '../types/index.js';

export class AIController {
  // POST /api/ai/extract-from-image - Extrair informações de imagem
  async extractFromImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma imagem foi enviada'
        } as ApiResponse);
      }

      // Converter buffer para base64
      const imageBase64 = req.file.buffer.toString('base64');

      // Processar com IA
      const extractedData = await aiService.extractFromImage(imageBase64);

      res.json({
        success: true,
        message: 'Dados extraídos com sucesso',
        data: extractedData
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao extrair dados da imagem:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao processar imagem'
      } as ApiResponse);
    }
  }

  // POST /api/ai/extract-from-text - Extrair informações de texto
  async extractFromText(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text || typeof text !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Texto não foi fornecido'
        } as ApiResponse);
      }

      // Processar com IA
      const extractedData = await aiService.extractFromText(text);

      res.json({
        success: true,
        message: 'Dados extraídos com sucesso',
        data: extractedData
      } as ApiResponse);
    } catch (error) {
      console.error('Erro ao extrair dados do texto:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao processar texto'
      } as ApiResponse);
    }
  }
}

export default new AIController();


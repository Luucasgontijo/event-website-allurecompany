import { Router } from 'express';
import multer from 'multer';
import aiController from '../controllers/aiController.js';

const router = Router();

// Configurar multer para upload de imagens em memória
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas imagens
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  },
});

// Rotas de IA
router.post('/ai/extract-from-image', upload.single('image'), (req, res) => 
  aiController.extractFromImage(req, res)
);

router.post('/ai/extract-from-text', (req, res) => 
  aiController.extractFromText(req, res)
);

export default router;


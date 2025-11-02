import { Router } from 'express';
import eventController from '../controllers/eventController.js';

const router = Router();

// Rotas de eventos
router.post('/events', (req, res) => eventController.createEvent(req, res));
router.get('/events', (req, res) => eventController.getAllEvents(req, res));
router.get('/events/:id', (req, res) => eventController.getEventById(req, res));
router.put('/events/:id', (req, res) => eventController.updateEvent(req, res));
router.delete('/events/:id', (req, res) => eventController.deleteEvent(req, res));
router.get('/events/date/:date', (req, res) => eventController.getEventsByDate(req, res));
router.get('/events/status/:status', (req, res) => eventController.getEventsByStatus(req, res));

export default router;


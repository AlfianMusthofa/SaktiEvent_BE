import express from 'express'
import { AddEvent, DeleteEvent, GetAllEvents, UpdateEvent, GetEventById } from '../controllers/EventController.js'

const router = express.Router()

router.get('/api/v1/events', GetAllEvents);
router.get('/api/v1/events/:id', GetEventById);
router.post('/api/v1/events', AddEvent);
router.delete('/api/v1/events/:id', DeleteEvent);

// Public API
router.get('/api/v1/public/events', GetAllEvents)

export default router;
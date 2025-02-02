import express from 'express'
import { AddEvent, DeleteEvent, GetAllEvents, UpdateEvent, GetEventById, AddUserToEvent, checkUserRegistrationEvent } from '../controllers/EventController.js'
import AuthMiddleware from '../middleware/AuthMiddleware.js'
const router = express.Router()

router.get('/api/v1/events', AuthMiddleware, GetAllEvents);
router.get('/api/v1/events/:id', AuthMiddleware, GetEventById);
router.post('/api/v1/events', AuthMiddleware, AddEvent);
router.delete('/api/v1/events/:id', AuthMiddleware, DeleteEvent);
router.patch('/api/v1/events/:id', AuthMiddleware, UpdateEvent)
router.post('/api/v1/events/addUser/:userId/:eventId', AuthMiddleware, AddUserToEvent)
router.post('/api/v1/events/checkRegistered/:userId/:eventId', AuthMiddleware, checkUserRegistrationEvent)

// Public API
router.get('/api/v1/public/events', GetAllEvents)
router.get('/api/v1/public/events/:id', GetEventById)

export default router;
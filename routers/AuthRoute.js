import express from 'express'
import { login, logout } from '../controllers/AuthController.js'
const router = express.Router()

router.post('/api/v1/login', login)
router.delete('/api/v1/logout', logout)

export default router;
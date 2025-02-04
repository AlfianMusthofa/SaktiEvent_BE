import { getAllHistory, getHistoryByUser } from '../controllers/HistoryController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import express from 'express';
const router = express.Router();

router.get('/api/v1/history', AuthMiddleware, getAllHistory);
router.get('/api/v1/history/user/:userId', AuthMiddleware, getHistoryByUser)

export default router;
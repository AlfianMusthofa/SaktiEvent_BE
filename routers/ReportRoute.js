import { AddReport, DeleteReport, GetAllReports, UpdateReport, GetReportById } from '../controllers/ReportController.js'
import express from 'express'
import AuthMiddleware from '../middleware/AuthMiddleware.js'

const route = express.Router();

route.get('/api/v1/reports', AuthMiddleware, GetAllReports)
route.post('/api/v1/reports', AuthMiddleware, AddReport)
route.patch('/api/v1/reports/:id', AuthMiddleware, UpdateReport)
route.delete('/api/v1/reports/:id', AuthMiddleware, DeleteReport)
route.get('/api/v1/reports/:id', GetReportById)

// Public API
route.get('/api/v1/public/reports', GetAllReports)

export default route;
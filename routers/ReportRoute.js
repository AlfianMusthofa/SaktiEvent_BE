import { AddReport, DeleteReport, GetAllReports, UpdateReport, GetReportById } from '../controllers/ReportController.js'
import express from 'express'

const route = express.Router();

route.get('/api/v1/reports', GetAllReports)
route.post('/api/v1/reports', AddReport)
route.patch('/api/v1/reports/:id', UpdateReport)
route.delete('/api/v1/reports/:id', DeleteReport)
route.get('/api/v1/reports/:id', GetReportById)

export default route;
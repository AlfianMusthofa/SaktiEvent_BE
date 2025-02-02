import express from 'express'
import cors from 'cors'
import UserRoute from './routers/UserRoute.js'
import ReportRoute from './routers/ReportRoute.js'
import EventRoute from './routers/EventRoute.js'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import AuthRoute from './routers/AuthRoute.js'
import cookieParser from 'cookie-parser'
import HistoryRoute from './routers/HistoryRoute.js'

dotenv.config();

const app = express()
app.use(fileUpload())
app.use(express.json())

app.use(cookieParser())

app.use(cors({
   origin: 'http://localhost:5173',
   credentials: true
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(UserRoute)
app.use(ReportRoute)
app.use(EventRoute)
app.use(AuthRoute)
app.use(HistoryRoute)

app.listen(3000, () => console.log("OK..."))
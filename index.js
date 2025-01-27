import express from 'express'
import cors from 'cors'
import UserRoute from './routers/UserRoute.js'
import ReportRoute from './routers/ReportRoute.js'
import EventRoute from './routers/EventRoute.js'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import dotenv from 'dotenv'
import AuthRoute from './routers/AuthRoute.js'

dotenv.config();

const app = express()
app.use(fileUpload())
app.use(express.json())

app.use(session({
   secret: process.env.SECRET_KEY,
   resave: false,
   saveUninitialized: true,
   rolling: true,
   cookie: {
      secure: false,
      maxAge: 7 * 24 * 24 * 1000,
      httpOnly: true
   }
}))

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

app.listen(3000, () => console.log("OK..."))
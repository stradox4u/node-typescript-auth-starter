import express from 'express'
require('dotenv').config()
import cookieParser from 'cookie-parser'
import cors from 'cors'

import passport from './utils/passport'
import { MyError } from "./utils/types"
import sequelize from "./utils/database"

import regRoutes from "./routes/registerRoutes"
import authRoutes from "./routes/authenticationRoutes"

const port: string = process.env.APP_PORT!
const routePrefix: string = "/api/v1"

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

app.use(`${routePrefix}/register`, regRoutes)
app.use(`${routePrefix}/auth`, authRoutes)

app.use((error: MyError, req: any, res: any, next: Function) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data

  res.status(status).json({
    message,
    data,
  })
})

const checkDbConn = () => {
  return sequelize.authenticate()
    .then((connection: any) => {
    console.log('Connection to database successful!')
    })
    .catch((err: any) => {
    console.log('Unable to connect to database!')
  })
}

checkDbConn()

app.listen(port)


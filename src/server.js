import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import { app, server } from './sockets/socket'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT ?? env.APP_PORT ?? 8022

//Fix Cache from disk của ExpressJS
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.use(cookieParser()) // Sử dụng cookie-parser để đọc cookie từ request

app.use(cors(corsOptions))

app.use(express.json())

app.use('/api/v1', APIs_V1)

// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
app.use(errorHandlingMiddleware)

server.listen(PORT, env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${env.APP_HOST}:${PORT}/`)
})

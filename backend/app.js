import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import errorHandler from './middleware/errorHandler.js'
import verifyRoutes from './routes/verifyRoutes.js'


const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/todos', todoRoutes)
app.use('/auth', verifyRoutes)

app.use(errorHandler)

export default app


import express from 'express'
import dotenv from 'dotenv'
import authRoute from './routes/auth.js'
import todoRoute from "./routes/todos.js";
import usersRoute from './routes/users.js'
import verifyRoutes from './routes/verify.js'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cors())

const PORT = process.env.PORT
app.use(express.json())

app.use('/api/auth', authRoute)
app.use("/api/todos", todoRoute);
app.use('/users', usersRoute)
app.use('/', verifyRoutes)

app.listen(PORT, (req, res) => {
    console.log(`Server berjalan di http://localhost${PORT}`)
})
 

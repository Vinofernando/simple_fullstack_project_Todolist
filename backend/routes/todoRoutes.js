import express from 'express'
import { getTodos, addTodo, deleteTodo } from '../controllers/todoController.js'
import authenticateToken from '../middleware/auth.js'
const router = express.Router()
router.get('/', authenticateToken, getTodos)
router.post('/', authenticateToken, addTodo)
router.delete('/:id', authenticateToken, deleteTodo)
export default router

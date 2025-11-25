import express from 'express'
import { register, login } from '../controllers/authController.js'
import { verifyAccount } from '../controllers/verifyController.js'
const router = express.Router()
router.post('/register', register)
router.post('/login', login)
router.get('/:token', verifyAccount)
export default router

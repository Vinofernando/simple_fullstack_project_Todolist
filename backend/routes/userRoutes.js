import express from 'express'
import { getUser, forgotPassword, resetPassword, verifyResetToken } from '../controllers/userController.js'
import authenticateToken from '../middleware/auth.js'
const router = express.Router()
router.get('/', authenticateToken, getUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/reset-password', verifyResetToken)
export default router

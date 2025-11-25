import express from 'express'
import { verifyAccount } from '../controllers/verifyController.js'

const router = express.Router()

router.get('/verify/:token', verifyAccount)

export default router

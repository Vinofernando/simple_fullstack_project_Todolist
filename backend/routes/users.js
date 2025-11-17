import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router()

router.get('/', authenticateToken ,async (req, res) => {
    try{
        const userId = req.user.id

        const result = await pool.query(`
            SELECT * FROM users
            WHERE user_id = $1
        `, [userId])

        res.json(result.rows)
    } catch(error) {
        console.error(error)
        res.status(500).json({message: "Server error"})
    }
})

export default router
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get('/:token', async (req, res) => {
  const { token } = req.params

  const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token])

  if (result.rowCount === 0) {
    return res.status(400).json({ pesan: 'Token tidak valid' })
  }

  // Tandai user sebagai verified
  await pool.query(`
    UPDATE users SET verified = true, verification_token = NULL
    WHERE verification_token = $1
  `, [token])

  res.json({ pesan: 'Akun berhasil diverifikasi, silakan login' })
})

export default router
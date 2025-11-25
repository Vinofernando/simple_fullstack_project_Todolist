// controllers/verifyController.js
import pool from "../config/db.js";

export const verifyAccount = async (req, res, next) => {
  try {
    const { token } = req.params
    const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token])
    if(result.rowCount === 0) throw { status: 400, message: 'Token tidak valid' }
    await pool.query('UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = $1', [token])
    res.json({ message: 'Akun berhasil diverifikasi, silakan login' })
  } catch(err) { next(err) }
}

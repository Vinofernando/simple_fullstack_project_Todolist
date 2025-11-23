import express from 'express'
import pool from '../config/db.js'
import { authenticateToken } from "../middleware/auth.js";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'

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

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE user_email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const token = uuidv4();
    const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 menit

    await pool.query(
      `UPDATE users SET reset_token = $1, reset_expires = $2 WHERE user_email = $3`,
      [token, expires, email]
    );

    const link = `http://localhost:5500/fullstack/frontend/view/resetpassword.html?token=${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // kirim email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<p>Klik link berikut untuk reset password:</p><a href="${link}">${link}</a>`
    });

    res.json({ message: "Link reset password telah dikirim ke email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE reset_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    const user = result.rows[0];

    if (new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET user_password = $1, reset_token = NULL, reset_expires = NULL
      WHERE reset_token = $2
      `,
      [hashed, token]
    );

    res.json({ message: "Password berhasil direset." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/reset-password', async (req, res) => {
  try {
    const token = req.query.token;

    const result = await pool.query(
      `SELECT * FROM users WHERE reset_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Token tidak valid" });
    }

    const user = result.rows[0];

    if (new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Jika valid → frontend boleh tampilkan halaman reset password
    res.json({ message: "Token valid" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router
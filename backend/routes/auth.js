                      import express from 'express'
import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config();

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async(req, res) => {
    try{
        const { username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({message: "All field is required"})
        }

        const existingEmail = await pool.query(`
            SELECT user_email FROM users
            WHERE user_email = $1    
        `, [email])

        if(existingEmail.rows.length > 0){
            return res.status(400).json({message: "Email sudah terdaftar"})
        }

        const hashed = await bcrypt.hash(password, 10)
        const verifyToken = uuidv4()

        await pool.query(`
            INSERT INTO users (username, user_email, user_password, verification_token)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [username, email, hashed, verifyToken])

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        })

        console.log(`email : `, process.env.EMAIL_USER)

        const link = `http://localhost:5000/${verifyToken}`
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Verifikasi email anda`,
          html: `<p>Klik link berikut untuk verifikasi akun:</p><a href=${link}>${link}</a>`
        })

        res.json({pesan : `Registrasi berhasil, cek email anda untuk verifikasi`})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error"})
    }
})

router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const userResult = await pool.query(`
      SELECT * FROM users WHERE user_email = $1
    `, [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.user_password);

    if (!validPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.user_email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
  message: "Login berhasil",
  token,
  user: {
    id : user.user_id,
    username : user.username,
    email : user.user_email
  }
})

  } catch (error) {
    console.error("❌ Terjadi error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router
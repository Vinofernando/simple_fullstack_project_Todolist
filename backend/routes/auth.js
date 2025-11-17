import express from 'express'
import pool from '../config/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/register', async(req, res) => {
    try{
        const { username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({message: "All field is required"})
        }

        const existingEmail = await pool.query(`
            SELECT email FROM users
            WHERE email = $1    
        `, [email])

        if(existingEmail.rows.length > 0){
            return res.status(400).json({message: "Email sudah terdaftar"})
        }

        const hashed = await bcrypt.hash(password, 10)

        const result  = await pool.query(`
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [username, email, hashed])

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Server error"})
    }
})

router.post('/login', async (req, res) => {
  try {
    console.log("1️⃣  Masuk ke route login");

    const { email, password } = req.body;
    console.log("2️⃣  Data diterima:", email);

    const userResult = await pool.query(`
      SELECT * FROM users WHERE email = $1
    `, [email]);
    console.log("3️⃣  Hasil query:", userResult.rows);

    if (userResult.rows.length === 0) {
      console.log("4️⃣  Email tidak ditemukan");
      return res.status(400).json({ message: "Email tidak ditemukan" });
    }

    const user = userResult.rows[0];
    console.log("5️⃣  User ditemukan:", user);

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("6️⃣  Valid password?", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Password salah" });
    }

    console.log("7️⃣  Password benar, membuat token...");

    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("8️⃣  Token berhasil dibuat:", token);

    return res.status(200).json({
  message: "Login berhasil",
  token,
  user: {
    id : user.user_id,
    username : user.username,
    email : user.email
  }
})

  } catch (error) {
    console.error("❌ Terjadi error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router
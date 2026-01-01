import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
import pool from "./config/db.js"; // sesuaikan path

(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database Supabase CONNECTED");
  } catch (error) {
    console.error("❌ Database connection FAILED");
    console.error(error.message);
  }
})();

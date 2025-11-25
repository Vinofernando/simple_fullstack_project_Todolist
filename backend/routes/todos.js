import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET todos milik user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM todos WHERE user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Tambah todo
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { todos } = req.body;

    const duplicate = await pool.query(`
        SELECT * from todos
        WHERE user_id = $1 AND todos = $2
      `, [userId, todos])

    if(duplicate.rows.length >= 1){
        return res.status(400).json({message: "Tugas sudah ada"})
    }

    const result = await pool.query(
      `INSERT INTO todos (todos, user_id) VALUES ($1, $2) RETURNING *`,
      [todos, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try{
    const userId = req.user.id;
    const todoId = req.params.id
    console.log("userId : ", userId)
    console.log("todoId : ", todoId)

    const result = await pool.query(`
        DELETE FROM todos
        WHERE todos_id = $1 AND user_id = $2
    `, [todoId, userId])

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo tidak ditemukan" });
    }

    res.json({message: "Todo berhasil dihapus"})
  } catch(error){
    console.error(error)
    res.status(500).json({message: "Server error"})
  }
})

export default router;

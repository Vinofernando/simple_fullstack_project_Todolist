import pool from "../config/db.js";

export const getTodos = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM todos WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
};

export const addTodo = async (userId, todos) => {
  const duplicate = await pool.query(
    `SELECT * FROM todos WHERE user_id = $1 AND todos = $2`,
    [userId, todos]
  );

  if (duplicate.rows.length > 0) {
    throw { status: 400, message: "Tugas sudah ada" };
  }

  const result = await pool.query(
    `INSERT INTO todos (todos, user_id) VALUES ($1, $2) RETURNING *`,
    [todos, userId]
  );

  return result.rows[0];
};

export const deleteTodo = async (userId, todoId) => {
  const result = await pool.query(
    `DELETE FROM todos WHERE todos_id = $1 AND user_id = $2`,
    [todoId, userId]
  );

  if (result.rowCount === 0) {
    throw { status: 404, message: "Todo tidak ditemukan" };
  }

  return { message: "Todo berhasil dihapus" };
};

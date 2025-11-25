import * as todoService from "../services/todoService.js";

export const getTodos = async (req, res, next) => {
  try {
    const data = await todoService.getTodos(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const addTodo = async (req, res, next) => {
  try {
    const data = await todoService.addTodo(req.user.id, req.body.todos);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const data = await todoService.deleteTodo(req.user.id, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

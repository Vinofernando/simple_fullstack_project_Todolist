import * as userService from "../services/userService.js";

export const getUser = async (req, res, next) => {
  try {
    const data = await userService.getUser(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const data = await userService.forgotPassword(req.body.email);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const data = await userService.resetPassword(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const verifyResetToken = async (req, res, next) => {
  try {
    const data = await userService.verifyResetToken(req.query.token);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

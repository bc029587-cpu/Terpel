'use strict';

const authService = require('./auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login
};

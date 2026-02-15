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

async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;

    // Validar que no exista el email
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const user = await authService.register(email, password, name);

    res.status(201).json({ 
      message: 'Usuario creado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  register
};

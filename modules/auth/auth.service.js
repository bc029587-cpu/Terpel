'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../users/user.service');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function login(email, password) {
  const user = await userService.findByEmail(email);

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
}

async function register(email, password, name) {
  // Validar que el email no existe
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Encriptar contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // Crear usuario
  const user = await userService.createUser({
    email,
    password: passwordHash,
    name: name || email.split('@')[0],
    role: 'USER'
  });

  return user;
}

module.exports = {
  login,
  register
};

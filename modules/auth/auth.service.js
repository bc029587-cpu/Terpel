'use strict';

/**
 * CAPA: Service (Lógica de negocio)
 * MÓDULO: Authentication (Autenticación)
 * DESCRIPCIÓN: Contiene la lógica de autenticación y encriptación
 * INTERACCIONES: userService (obtener usuarios), bcrypt (validar contraseñas), JWT (generar tokens)
 * NOTA: Estos servicios NO interactúan directamente con la BD, usan userService
 */

// Comentario explicativo del patrón arquitectónico
// La lógica siempre va en el servicio, el controlador solo se encarga de recibir la petición,
// llamar al servicio y devolver la respuesta. El middleware se encarga de validar el token y
// agregar la información del usuario a la request para que el controlador pueda usarla.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../users/user.service');
const config = require('../../config'); // 🔑 Usar configuración centralizada


/**
 * FUNCIÓN: login(email, password)
 * CAPA: Service (Lógica de negocio)
 * DESCRIPCIÓN: Autentica un usuario y genera JWT
 * FLUJO: 
 *   1. Busca usuario en BD por email (userService.findByEmail)
 *   2. Valida contraseña usando bcrypt
 *   3. Si credenciales son válidas, genera JWT con datos del usuario
 * ENTRADA: email (string), password (string sin encriptar)
 * RECIBE DE: userService.findByEmail(email) - obtiene usuario con password hasheado
 * SALIDA: JWT token válido por config.auth.jwt.expiration
 * ERRORES: 'Credenciales inválidas' si email no existe o password no coincide
 */
async function login(email, password) {
  /**
   * PASO 1: Busca el usuario por email
   * RECIBE DE: userService (repositorio de usuarios)
   */
  const user = await userService.findByEmail(email);

  /**
   * PASO 2: Verifica que el usuario exista
   */
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  /**
   * PASO 3: Compara password hasheado en BD vs password del cliente
   * bcrypt.compare devuelve true/false
   */
  const validPassword = await bcrypt.compare(password, user.password);

  /**
   * PASO 4: Si password no coincide, rechaza login
   */
  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  /**
   * PASO 5: Genera JWT con datos del usuario
   * PAYLOAD: {id, email, role}
   * SECRETO: config.auth.jwt.secret (debe ser diferente en producción)
   * EXPIRACIÓN: config.auth.jwt.expiration (ej: '1h')
   * SALIDA: Token JWT que cliente debe guardar y enviar en futuras requests
   */
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    config.auth.jwt.secret,
    { expiresIn: config.auth.jwt.expiration }
  );

  return token;
}


/**
 * FUNCIÓN: register(email, password, name)
 * CAPA: Service (Lógica de negocio)
 * DESCRIPCIÓN: Registra un nuevo usuario
 * FLUJO:
 *   1. Verifica que el email no esté registrado
 *   2. Hashea la contraseña
 *   3. Crea usuario en BD
 * ENTRADA: email (string), password (string sin encriptar), name (string)
 * RECIBE DE: userService.findByEmail() - valida si email existe
 *            bcrypt - hashea contraseña
 *            userService.createUser() - crea usuario en BD
 * SALIDA: Usuario creado {_id, email, name, role: 'USER', password hasheado}
 * ERRORES: 'El email ya está registrado' si email existe
 * SEGURIDAD: No devuelve password al controlador
 */
async function register(email, password, name) {
  /**
   * PASO 1: Valida que el email no esté registrado
   * RECIBE DE: userService - busca usuario por email en BD
   */
  const existingUser = await userService.findByEmail(email);
  /**
   * PASO 2: Si el email ya existe, rechaza el registro
   */
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  /**
   * PASO 3: Hashea la contraseña
   * bcrypt.hash(password, rounds) donde rounds = config.security.bcrypt.rounds (default 10)
   * Más rounds = más seguro pero más lento
   * SALIDA: password hasheado ("+60 caracteres aleatorios)
   */
  const passwordHash = await bcrypt.hash(password, config.security.bcrypt.rounds);

  /**
   * PASO 4: Crea usuario en BD
   * RECIBE DE: userService.createUser() - inserta documento en MongoDB
   * ENTRADA: {email, password: passwordHash, name, role: 'USER'}
   * SALIDA: Usuario creado con _id asignado por MongoDB
   */
  const user = await userService.createUser({
    email,
    password: passwordHash,
    name: name || email.split('@')[0],  // Si no hay nombre, usa parte del email
    role: 'USER'
  });

  /**
   * PASO 5: Devuelve usuario creado
   * SALIDA: Usuario con _id, email, name, role (sin password)
   */
  return user;
}

module.exports = {
  login,
  register
};

'use strict';

/**
 * CAPA: Controller (Punto de entrada de requests)
 * MÓDULO: Authentication (Autenticación)
 * DESCRIPCIÓN: Recepciona requests HTTP de auth, valida entrada básica y delega lógica a servicio
 * FLUJO: Request → Valida entrada → Llama service → Responde al cliente
 * NOTA: La lógica compleja está en auth.service.js
 */

const authService = require('./auth.service');

/**
 * FUNCIÓN: login(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Endpoint para iniciar sesión
 * ENTRADA: req.body {email, password}
 * PROCESO: Extrae credenciales → Delega a authService.login()
 * SALIDA: JSON {token: "JWT token"} o error 401
 * FLUJO: Usuario → Envía credenciales → API valida → Devuelve JWT
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const token = await authService.login(email, password);

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: register(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Endpoint para registrar nuevos usuarios
 * ENTRADA: req.body {email, password, name}
 * PROCESO: 
 *   1. Valida que email y password estén presentes
 *   2. Delega a authService.register() para crear usuario
 * SALIDA: JSON con datos del usuario creado o error 400/409
 * SALIDA: 201 Created con usuario {id, email, name, role}
 * FLUJO: Cliente → Envía datos nuevo usuario → API crea usuario → Devuelve datos usuario
 */
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

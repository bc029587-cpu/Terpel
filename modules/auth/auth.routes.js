'use strict';

/**
 * CAPA: Routes (Definición de endpoints HTTP de Autenticación)
 * MÓDULO: Auth
 * DESCRIPCIÓN: Define rutas para iniciar sesión, registrarse y verificar token
 * FLUJO: HTTP Request → Ruta → Controller → Service → Response
 * ENDPOINTS:
 *   POST /api/auth/login    - Inicia sesión y obtiene token JWT
 *   POST /api/auth/register - Registra nuevo usuario
 *   GET  /api/auth/me       - Verifica token y obtiene datos del usuario actual
 */

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

/**
 * RUTA: POST /api/auth/login
 * MÉTODO: login
 * DESCRIPCIÓN: Endpoint para iniciar sesión
 * ENTRADA: Body JSON {email, password}
 * SALIDA: 200 + JSON {token: "JWT..."} o 401 si credenciales inválidas
 * FLUJO: Usuario enviá credenciales → API valida → Genera JWT → Devuelve token
 * CLIENTE: Debe guardar token y enviarlo en requests futuras (Authorization: Bearer token)
 */
router.post('/login', authController.login);
/**
 * RUTA: POST /api/auth/register
 * MÉTODO: register
 * DESCRIPCIÓN: Endpoint para registrase y crear nuevo usuario
 * ENTRADA: Body JSON {email, password, name?}
 * SALIDA: 201 Created + JSON usuario creado {id, email, name, role} o error
 * VALIDACIÓN: Email debe ser único
 * FLUJO: Nuevo usuario enviá datos → API valida unicidad → Hashea password → Crea usuario → Devuelve
 */
router.post('/register', authController.register);

/**
 * RUTA: GET /api/auth/me
 * MÉTODO: Controlador inline anónimo
 * DESCRIPCIÓN: Endpoint protegido para verificar autenticación
 * ENTRADA: Header Authorization: Bearer <token>
 * MIDDLEWARE: authMiddleware valida JWT y popula req.user
 * SALIDA: 200 + JSON {user: {id, email, role}} si token es válido
 * USO: Cliente verifica que token sigue siendo válido
 * FLUJO: Cliente enviá token en header → Middleware valida → Responde con datos usuario
 */
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

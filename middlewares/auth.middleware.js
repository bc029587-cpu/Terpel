'use strict';

/**
 * CAPA: Middleware de Autenticación
 * NOMBRE: authMiddleware
 * DESCRIPCIÓN: Valida tokens JWT en requests autenticadas
 * FLUJO: Extrae token del header → Verifica con JWT secret → Agrega usuario a request
 * ENTRADA: Request con header Authorization: Bearer <token>
 * SALIDA: Req.user poblado con {id, email, role} o error 401
 * PROTEGE: Todos los endpoints que usen este middleware
 */

const jwt = require('jsonwebtoken');
const config = require('../config'); //  Usar configuración centralizada

module.exports = (req, res, next) => {
  try {
    // Extrae el header Authorization
    const authHeader = req.headers.authorization;

    // Valida que el token exista
    if (!authHeader) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    // Extrae el token del formato "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token mal formado' });
    }

    /**
     * Verifica y decodifica el JWT usando el secret
     * Si es válido, decodifica y obtiene el payload {id, email, role}
     * Si es inválido, lanza error
     */
    const decoded = jwt.verify(token, config.auth.jwt.secret);
    req.user = decoded; // { id, email, role } - Disponible para próximos middlewares/controladores
    next();
  } catch (error) {
    // Errores específicos de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    return res.status(401).json({ message: 'Token inválido' });
  }
};

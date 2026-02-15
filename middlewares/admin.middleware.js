'use strict';

/**
 * Middleware para verificar que el usuario es ADMIN
 */
function adminOnly(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de ADMIN'
    });
  }
  next();
}

module.exports = adminOnly;

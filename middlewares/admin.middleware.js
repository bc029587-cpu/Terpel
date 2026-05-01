'use strict';

/**
 * CAPA: Middleware de Autorización
 * NOMBRE: adminOnly
 * DESCRIPCIÓN: Verifica que el usuario tenga rol de ADMIN
 * FLUJO: Obtiene rol de req.user (previamente poblado por authMiddleware) → Valida → Continúa o rechaza
 * ENTRADA: req.user.role (viene del JWT decodificado por authMiddleware)
 * SALIDA: Continúa a próximo middleware si es ADMIN, o error 403 si no
 * DEPENDENCIA: Requiere authMiddleware antes en la cadena
 * USO: Proteger endpoints solo para administradores
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

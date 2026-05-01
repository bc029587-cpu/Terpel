/**
 * CAPA: Middleware de Trazabilidad
 * NOMBRE: requestIdMiddleware
 * DESCRIPCIÓN: Asigna un UUID único a cada request para trazabilidad y debugging
 * FLUJO: Genera UUID → Agrega a request → Disponible en logs y respuestas de error
 * ENTRADA: Cualquier request HTTP
 * SALIDA: req.requestId poblado con UUID único
 * USO: Permite correlacionar logs de una misma transacción
 */

const { v4: uuid } = require('uuid');

module.exports = (req, res, next) => {
  // Genera y asigna UUID único a la request
  req.requestId = uuid();
  next();
};

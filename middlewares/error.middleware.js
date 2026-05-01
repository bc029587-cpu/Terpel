/**
 * CAPA: Middleware de Manejo Global de Errores
 * NOMBRE: errorHandler
 * DESCRIPCIÓN: Captura y formatea todos los errores no manejados de la aplicación
 * FLUJO: Error → Extrae status y mensaje → Envía response JSON
 * ENTRADA: (err, req, res, next) - Recibe error del flujo anterior
 * SALIDA: JSON con mensaje de error y request ID para trazabilidad
 * NOTA: DEBE ir al final de app.js después de todas las rutas
 * DESARROLLO: Incluye stack trace en responses
 * PRODUCCIÓN: Solo muestra mensaje de error (sin stack trace)
 */

const config = require('../config'); //  Usar configuración centralizada

module.exports = (err, req, res, next) => {
  // Extrae status del error o usa 500 por defecto
  const status = err.status || 500;

  // Prepara la respuesta JSON
  const payload = {
    error: err.message,
    requestId: req.requestId  // ID único para poder tracear el error en logs
  };

  // En desarrollo, incluye el stack trace para debugging
  if (config.isDevelopment) {
    payload.stack = err.stack;
  }

  // Envía error al cliente
  res.status(status).json(payload);
};

/**
 * CAPA: Utility (Clase de error personalizado)
 * NOMBRE: CustomError
 * DESCRIPCIÓN: Extiende Error nativo de JavaScript con status HTTP
 * USO: Lanzar errores personalizados en servicios que indicen qué status HTTP usar
 * FLUJO: Service lanza CustomError → Controller via next(error) → errorHandler captura y responde con status
 */

class CustomError extends Error {
  /**
   * CONSTRUCTOR
   * ENTRADA: message (string de error), status (HTTP status code, default 500)
   * SALIDA: Instancia de CustomError con ambas propiedades
   * EJEMPLO: throw new CustomError('Usuario no encontrado', 404);
   */
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

module.exports = CustomError;

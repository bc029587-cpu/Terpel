/**
 * CAPA: Enums/Constants (Valores constantes)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Define enumeraciones y valores permitidos para órdenes de servicio
 * USO: Validar que valores estén dentro de opciones válidas
 * NOTA: Los mismos valores se repiten en el modelo Mongoose (source of truth)
 */

module.exports = {
  TYPES: ['INVOICE', 'SUPPORT', 'REDEMPTION'],
  STATUS: ['CREATED', 'IN_PROGRESS', 'DONE', 'CANCELLED']
};

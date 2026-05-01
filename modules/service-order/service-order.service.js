'use strict';

/**
 * CAPA: Service (Lógica de negocio de Órdenes de Servicio)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Contiene lógica de negocio, validaciones y orquestación
 * INTERACCIÓN: Service Order Model (Mongoose), Custom Error para manejo de errores
 * FLUJO GENERAL: Controller → Service (lógica) → Model (BD)
 */

const ServiceOrder = require('./service-order.model');
const CustomError = require('../../utils/custom-error');

/**
 * FUNCIÓN: createServiceOrder(data, userId)
 * CAPA: Service
 * DESCRIPCIÓN: Crea una nueva orden de servicio asociada a un usuario
 * ENTRADA: data {stationId, title, description, type, status?}, userId (de JWT)
 * PROCESO:
 *   1. Spread operator expande data (stationId, title, description, type)
 *   2. Agrega createdBy: userId para saber quién creó la orden
 *   3. Guarda en BD con valores por defecto (status = 'PENDING')
 * SALIDA: Orden creada con _id, timestamps (createdAt, updatedAt)
 * RECEIBE DE: controller, envía A: BD (Model.create)
 */
async function createServiceOrder(data, userId) {
  return ServiceOrder.create({
    ...data,
    createdBy: userId
  });
}

/**
 * FUNCIÓN: getAllServiceOrders(filters, options)
 * CAPA: Service
 * DESCRIPCIÓN: Obtiene órdenes con filtros opcionales y paginación
 * ENTRADA: 
 *   - filters {stationId?, status?} - Filtros de búsqueda
 *   - options {page?, limit?} - Paginación
 * PROCESO:
 *   1. Construye query basada en filtros
 *   2. Si hay paginación: calcula skip, obtiene total + datos paginados en paralelo
 *   3. Si no hay paginación: obtiene todos los dados
 *   4. Popula createdBy con datos del usuario que creó la orden
 *   5. Ordena por fecha descendente
 * SALIDA: Array de órdenes O objeto {total, data} si hay paginación
 * OPTIMIZACIÓN: Promise.all para consultas paralelas en BD
 */
async function getAllServiceOrders(filters = {}, options = {}) {
  /**
   * PASO 1: Construye objeto de filtros para la query de MongoDB
   */
  const query = {};

  // Filtro por estación (ej: ST-001, ST-002)
  if (filters.stationId) {
    query.stationId = filters.stationId;
  }

  // Filtro por estado (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
  if (filters.status) {
    query.status = filters.status;
  }

  /**
   * PASO 2: Extrae parámetros de paginación
   */
  const page = parseInt(options.page, 10) || null;
  const limit = parseInt(options.limit, 10) || null;

  /**
   * PASO 3: Si hay paginación, ejecuta dos queries en paralelo
   * - Contar total de documentos (para calidad de total pages)
   * - Obtener datos paginados (skip y limit)
   * Promise.all ejecuta ambas en paralelo (más rápido)
   */
  if (page && limit) {
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      ServiceOrder.countDocuments(query),
      ServiceOrder.find(query)
        .populate('createdBy', 'email role')  // Incluye datos del usuario que creo la orden
        .sort({ createdAt: -1 })  // Ordena de más reciente a más antiguo
        .skip(skip)  // Salta los X primeros documentos
        .limit(limit)  // Limita a X documentos
    ]);

    return { total, data };
  }

  /**
   * PASO 4: Si NO hay paginación, obtiene todos los datos
   */
  const orders = await ServiceOrder.find(query)
    .populate('createdBy', 'email role')
    .sort({ createdAt: -1 });

  return orders;
}

/**
 * FUNCIÓN: getServiceOrderById(id)
 * CAPA: Service
 * DESCRIPCIÓN: Obtiene una orden específica por ID
 * ENTRADA: id (ObjectId de MongoDB)
 * PROCESO: Busca orden + popula datos de creador
 * SALIDA: Orden completa o null si no existe
 * USO: GET /api/service-orders/:id
 */
async function getServiceOrderById(id) {
  return ServiceOrder.findById(id).populate('createdBy', 'email role');
}

/**
 * FUNCIÓN: updateServiceOrderStatus(id, status)
 * CAPA: Service (Lógica de negocio con validaciones)
 * DESCRIPCIÓN: Actualiza estado de una orden con validacón de transiciones
 * ENTRADA: id (ObjectId), status (nuevo estado)
 * VALIDACIONES:
 *   1. Orden debe existir
 *   2. No permite cambios si está CANCELLED
 *   3. No permite transición COMPLETED -> IN_PROGRESS (regresiones)
 * PROCESO:
 *   1. Obtiene orden actual
 *   2. Valida existencia y reglas de negocio
 *   3. Cambia status
 *   4. Guarda en BD
 * SALIDA: Orden actualizada o CustomError si falla validación
 * FLUJO: validar -> actualizar -> guardar
 */
async function updateServiceOrderStatus(id, status) {
  /**
   * PASO 1: Obtiene la orden actual de la BD
   */
  const order = await ServiceOrder.findById(id);

  /**
   * PASO 2: Valida que la orden exista
   */
  if (!order) {
    throw new CustomError('Service Order no encontrada', 404);
  }

  /**
   * PASO 3: Regla de negocio - No permitir cambios en órdenes CANCELLED
   * Una vez cancelada, la orden está "congelada"
   */
  if (order.status === 'CANCELLED') {
    throw new CustomError('No se pueden realizar cambios: la orden está CANCELLED', 400);
  }

  /**
   * PASO 4: Regla de negocio - No permite regresar de COMPLETED a IN_PROGRESS
   * Una orden completada no puede volver a estar en progreso
   */
  if (order.status === 'COMPLETED' && status === 'IN_PROGRESS') {
    throw new CustomError('Transición inválida: no se permite COMPLETED -> IN_PROGRESS', 400);
  }

  /**
   * PASO 5: Si todas las validaciones pasan, actualiza status y guarda
   */
  order.status = status;
  return order.save();
}

/**
 * FUNCIÓN: updateServiceOrder(id, data)
 * CAPA: Service
 * DESCRIPCIÓN: Actualiza campos generales de una orden (excepto status)
 * ENTRADA: id (ObjectId), data {title?, description?, type?, ...}
 * PROCESO: Busca orden → Actualiza campos → Guarda retorna actualizada
 * SALIDA: Orden actualizada con cambios aplicados
 * ERROR: CustomError 404 si orden no existe
 * USO: PUT /api/service-orders/:id
 */
async function updateServiceOrder(id, data) {
  const order = await ServiceOrder.findByIdAndUpdate(id, data, { new: true });

  if (!order) {
    throw new Error('Service Order no encontrada');
  }

  return order;
}

/**
 * FUNCIÓN: deleteServiceOrder(id)
 * CAPA: Service
 * DESCRIPCIÓN: Elimina una orden de servicio
 * ENTRADA: id (ObjectId)
 * PROCESO: Busca y elimina documento de BD
 * SALIDA: Orden eliminada o CustomError 404 si no existe
 * NOTA: Eliminación real (no soft delete como usuarios)
 * MOTIVO: Las órdenes no tienen referencias externas críticas
 * USO: DELETE /api/service-orders/:id
 */
async function deleteServiceOrder(id) {
  const order = await ServiceOrder.findByIdAndDelete(id);

  if (!order) {
    throw new Error('Service Order no encontrada');
  }

  return order;
}

module.exports = {
  createServiceOrder,
  getAllServiceOrders,
  getServiceOrderById,
  updateServiceOrderStatus,
  updateServiceOrder,
  deleteServiceOrder
};

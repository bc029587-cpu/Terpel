'use strict';

/**
 * CAPA: Controller (Endpoints HTTP de Órdenes de Servicio)
 * MÓDULO: Service Orders (Gestión de órdenes)
 * DESCRIPCIÓN: Maneja requests HTTP de service orders, valida entrada, delega a servicio
 * FLUJO: Request HTTP → Valida datos → Llama service → Responde cliente
 * AUTENTICACIÓN: Todos los endpoints requieren JWT valido (ruta protegida)
 * OPERACIONES: CRUD (Create, Read, Update, Delete) + Search con filtros
 */

const serviceOrderService = require('./service-order.service');

/**
 * FUNCIÓN: create(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Crea una nueva orden de servicio
 * ENDPOINT: POST /api/service-orders
 * AUTENTICACIÓN: Requerida (req.user disponible)
 * ENTRADA: req.body {stationId, title, description, type, status?}
 *          req.user.id (del JWT)
 * PROCESO:
 *   1. Valida que usuario esté autenticado
 *   2. Delega a serviceOrderService.createServiceOrder()
 *   3. Asocia orden al usuario actual (createdBy)
 * SALIDA: Status 201 Created + JSON con orden creada
 * FLUJO: Usuario → POST /api/service-orders con datos → API crea → BD guarda → Devuelve orden creada
 */
async function create(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    const order = await serviceOrderService.createServiceOrder(
      req.body,
      req.user.id
    );
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: findAll(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Obtiene lista de todas las órdenes de servicio con paginación opcional
 * ENDPOINT: GET /api/service-orders?page=1&limit=20
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.query {page?, limit?}
 * PROCESO:
 *   1. Si vinen parámetros de paginación, usa paginación
 *   2. Si no, devuelve todas las órdenes
 *   3. Ordena por fecha de creación descendente
 * SALIDA: JSON {total, page?, limit?, data: [...]}
 * VALIDACIÓN: Si no hay órdenes, devuelve 404 con mensaje
 */
async function findAll(req, res, next) {
  try {
    // Soporta paginación opcional: ?page=1&limit=20
    const page = req.query.page ? parseInt(req.query.page, 10) : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

    if (page && limit) {
      const result = await serviceOrderService.getAllServiceOrders({}, { page, limit });
      return res.json({
        total: result.total,
        page,
        limit,
        data: result.data
      });
    }

    const orders = await serviceOrderService.getAllServiceOrders();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        message: 'No se encontraron órdenes en la base de datos.',
        data: [] 
      });
    }

    res.json({
      total: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: searchByFilters(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Busca órdenes de servicio aplicando filtros
 * ENDPOINT: GET /api/service-orders/search/filters?stationId=XXX&status=PENDING
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.query {stationId?, status?}
 * VALIDACIÓN:
 *   - Al menos un filtro es obligatorio
 *   - Status debe estar en lista válida [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 * PROCESO: Construye objeto filtros → Delega a service → Valida resultados
 * SALIDA: JSON {total, data: [...]} o 404 si no encuentra resultados
 * FLUJO: Cliente → GET /api/service-orders/search/filters?stationId=ST001 → API filtra en BD → Devuelve resultados
 */
async function searchByFilters(req, res, next) {
  try {
    const { stationId, status } = req.query;

    // Validar que al menos un filtro esté presente
    if (!stationId && !status) {
      return res.status(400).json({ 
        message: 'Debe proporcionar al menos un filtro: stationId o status' 
      });
    }

    // Construir objeto de filtros
    const filters = {};
    if (stationId) filters.stationId = stationId;
    if (status) {
      // Validar que el status sea válido
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}` 
        });
      }
      filters.status = status;
    }

    const orders = await serviceOrderService.getAllServiceOrders(filters);

    // Validar si se encontraron resultados
    if (orders.length === 0) {
      let message = 'No se encontraron órdenes en la base de datos.';
      if (stationId && status) {
        message = `No se encontraron órdenes para la estación "${stationId}" con estado "${status}".`;
      } else if (stationId) {
        message = `No se encontraron órdenes para la estación "${stationId}".`;
      } else if (status) {
        message = `No se encontraron órdenes con estado "${status}".`;
      }
      return res.status(404).json({ message, data: [] });
    }

    res.json({
      total: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: findById(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Obtiene una órden de servicio por ID
 * ENDPOINT: GET /api/service-orders/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id (ObjectId de MongoDB)
 * VALIDACIÓN: Si no existe, devuelve 404
 * PROCESO: Delega a serviceOrderService.getServiceOrderById()
 * SALIDA: JSON con datos completos de la orden
 * FLUJO: Cliente → GET /api/service-orders/507f1f77bcf86cd799439011 → API busca → Devuelve orden
 */
async function findById(req, res, next) {
  try {
    const order = await serviceOrderService.getServiceOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Service Order no encontrada' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: updateStatus(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Actualiza el estado de una orden de servicio
 * ENDPOINT: PATCH /api/service-orders/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id, req.body {status}
 * VALIDACIÓN:
 *   - Status es obligatorio
 *   - Status debe ser válido [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 * PROCESO: Valida status → Delega a service para actualizar y validar transiciones
 * SALIDA: JSON orden actualizada o error 400
 * RESTRICCIONES: Ciertas transiciones no están permitidas (ej: COMPLETED -> IN_PROGRESS)
 */
async function updateStatus(req, res, next) {
  try {
    const { status } = req.body || {};

    if (!status) {
      return res.status(400).json({ message: 'Debe proporcionar el campo "status" en el body' });
    }

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status inválido. Valores permitidos: ${validStatuses.join(', ')}` });
    }

    const order = await serviceOrderService.updateServiceOrderStatus(
      req.params.id,
      status
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: update(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Actualiza campos seleccionados de una orden (excepto status)
 * ENDPOINT: PUT /api/service-orders/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id, req.body {title?, description?, type?, ...}
 * PROCESO: Delega a serviceOrderService.updateServiceOrder()
 * SALIDA: JSON orden actualizada
 * FLUJO: Cliente → PUT /api/service-orders/:id → API actualiza en BD → Devuelve orden actualizada
 */
async function update(req, res, next) {
  try {
    const order = await serviceOrderService.updateServiceOrder(
      req.params.id,
      req.body
    );
    res.json(order);
  } catch (error) {
    next(error);
  }
}

/**
 * FUNCIÓN: remove(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Elimina una orden de servicio
 * ENDPOINT: DELETE /api/service-orders/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id (ObjectId)
 * PROCESO: Delega a serviceOrderService.deleteServiceOrder()
 * SALIDA: Status 204 No Content (sin body)
 * NOTA: Elimina realmente de BD (no soft delete como usuarios)
 * FLUJO: Cliente → DELETE /api/service-orders/:id → API elimina de BD → Devuelve 204
 */
async function remove(req, res, next) {
  try {
    await serviceOrderService.deleteServiceOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  findAll,
  searchByFilters,
  findById,
  updateStatus,
  update,
  remove
};

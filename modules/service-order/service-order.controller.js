'use strict';

const serviceOrderService = require('./service-order.service');

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

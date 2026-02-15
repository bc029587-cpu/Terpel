'use strict';

const serviceOrderService = require('./service-order.service');

async function create(req, res, next) {
  try {
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
    const { stationId, status } = req.query;

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
      // Mensaje diferente según qué se buscaba
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
    const { status } = req.body;
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
  findById,
  updateStatus,
  update,
  remove
};

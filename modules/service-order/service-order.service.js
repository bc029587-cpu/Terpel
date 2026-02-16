'use strict';

const ServiceOrder = require('./service-order.model');
const CustomError = require('../../utils/custom-error');

async function createServiceOrder(data, userId) {
  return ServiceOrder.create({
    ...data,
    createdBy: userId
  });
}

async function getAllServiceOrders(filters = {}) {
  const query = {};

  // Filtro por stationId
  if (filters.stationId) {
    query.stationId = filters.stationId;
  }

  // Filtro por status
  if (filters.status) {
    query.status = filters.status;
  }

  const orders = await ServiceOrder.find(query)
    .populate('createdBy', 'email role')
    .sort({ createdAt: -1 });

  return orders;
}

async function getServiceOrderById(id) {
  return ServiceOrder.findById(id).populate('createdBy', 'email role');
}

async function updateServiceOrderStatus(id, status) {
  const order = await ServiceOrder.findById(id);

  if (!order) {
    throw new CustomError('Service Order no encontrada', 404);
  }

  // No permitir cambios si la orden está CANCELLED
  if (order.status === 'CANCELLED') {
    throw new CustomError('No se pueden realizar cambios: la orden está CANCELLED', 400);
  }

  // No permitir COMPLETED -> IN_PROGRESS
  if (order.status === 'COMPLETED' && status === 'IN_PROGRESS') {
    throw new CustomError('Transición inválida: no se permite COMPLETED -> IN_PROGRESS', 400);
  }

  order.status = status;
  return order.save();
}

async function updateServiceOrder(id, data) {
  const order = await ServiceOrder.findByIdAndUpdate(id, data, { new: true });

  if (!order) {
    throw new Error('Service Order no encontrada');
  }

  return order;
}

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

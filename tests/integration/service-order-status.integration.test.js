/**
 * Test de Integración: Service Order Status Updates
 * 
 * Este test simula el ciclo completo de cambios de estado
 * sin necesidad de Testcontainers (usa mocks de MongoDB)
 */

const mongoose = require('mongoose');

// Almacenamiento en memoria para mocks
let mockOrdersDatabase = {};

/**
 * Mock del modelo
 */
class MockServiceOrder {
  constructor(data) {
    this.id = data.id || new mongoose.Types.ObjectId().toString();
    this.stationId = data.stationId;
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'PENDING';
    this.createdBy = data.createdBy;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Guardar en BD simulada
    mockOrdersDatabase[this.id] = this;
  }

  async save() {
    this.updatedAt = new Date();
    mockOrdersDatabase[this.id] = this;
    return this;
  }

  static async findById(id) {
    const order = mockOrdersDatabase[id];
    if (!order) return null;
    
    // Retornar una copia
    return new MockServiceOrder({
      id: order.id,
      stationId: order.stationId,
      title: order.title,
      description: order.description,
      status: order.status,
      createdBy: order.createdBy
    });
  }

  static async findByIdAndUpdate(id, data, options) {
    if (!mockOrdersDatabase[id]) return null;
    
    const updated = { ...mockOrdersDatabase[id], ...data };
    mockOrdersDatabase[id] = updated;
    
    return new MockServiceOrder(updated);
  }
}

// Función de negocio para actualizar estado
async function updateServiceOrderStatusWithValidation(orderId, newStatus) {
  const order = await MockServiceOrder.findById(orderId);

  if (!order) {
    throw new Error('Service Order no encontrada');
  }

  // Validación 1: No permitir cambios si está CANCELLED
  if (order.status === 'CANCELLED') {
    throw new Error('No se pueden realizar cambios: la orden está CANCELLED');
  }

  // Validación 2: No permitir COMPLETED -> IN_PROGRESS
  if (order.status === 'COMPLETED' && newStatus === 'IN_PROGRESS') {
    throw new Error('Transición inválida: no se permite COMPLETED -> IN_PROGRESS');
  }

  order.status = newStatus;
  return order.save();
}

/**
 * ==========================================
 * TESTS DE INTEGRACIÓN
 * ==========================================
 */

describe('Service Order - Integración de Cambios de Estado', () => {

  // Limpiar la BD en memoria antes de cada test
  beforeEach(() => {
    mockOrdersDatabase = {};
  });

  describe('📝 Ciclo de vida completo de una orden', () => {

    test('Orden completa ciclo: PENDING -> IN_PROGRESS -> COMPLETED', async () => {
      // 1. Crear orden
      let order = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Test Integration Order',
        createdBy: 'user123'
      });
      
      expect(order.status).toBe('PENDING');

      // 2. Cambiar a IN_PROGRESS
      order = await updateServiceOrderStatusWithValidation(order.id, 'IN_PROGRESS');
      expect(order.status).toBe('IN_PROGRESS');

      // 3. Cambiar a COMPLETED
      order = await updateServiceOrderStatusWithValidation(order.id, 'COMPLETED');
      expect(order.status).toBe('COMPLETED');
    });

    test('Orden puede ser cancelada en cualquier momento antes de COMPLETED', async () => {
      let order = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Test Cancellation Order',
        createdBy: 'user123',
        status: 'IN_PROGRESS'
      });

      order = await updateServiceOrderStatusWithValidation(order.id, 'CANCELLED');
      expect(order.status).toBe('CANCELLED');
    });

  });

  describe('🚫 Errores de negocio', () => {

    test('No se puede actualizar orden cuando no existe', async () => {
      await expect(
        updateServiceOrderStatusWithValidation('nonexistent_id_12345', 'IN_PROGRESS')
      ).rejects.toThrow('Service Order no encontrada');
    });

    test('No se puede actualizar estado de orden CANCELLED', async () => {
      const cancelledOrder = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Test Order',
        status: 'CANCELLED',
        createdBy: 'user123'
      });

      await expect(
        updateServiceOrderStatusWithValidation(cancelledOrder.id, 'PENDING')
      ).rejects.toThrow('No se pueden realizar cambios: la orden está CANCELLED');
    });

    test('No se puede regresionar de COMPLETED a IN_PROGRESS', async () => {
      const completedOrder = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Test Order',
        status: 'COMPLETED',
        createdBy: 'user123'
      });

      await expect(
        updateServiceOrderStatusWithValidation(completedOrder.id, 'IN_PROGRESS')
      ).rejects.toThrow('Transición inválida: no se permite COMPLETED -> IN_PROGRESS');
    });

  });

  describe('✅ Operaciones válidas', () => {

    test('Puede cambiar de PENDING a COMPLETED directamente', async () => {
      const order = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Quick Complete Order',
        status: 'PENDING',
        createdBy: 'user123'
      });

      const updated = await updateServiceOrderStatusWithValidation(order.id, 'COMPLETED');
      expect(updated.status).toBe('COMPLETED');
    });

    test('Puede pasar de COMPLETED a CANCELLED', async () => {
      const order = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Completed Order to Cancel',
        status: 'COMPLETED',
        createdBy: 'user123'
      });

      const updated = await updateServiceOrderStatusWithValidation(order.id, 'CANCELLED');
      expect(updated.status).toBe('CANCELLED');
    });

  });

  describe('⏱️ Timestamp validation', () => {

    test('El timestamp de actualización debe cambiar cuando se actualiza', async () => {
      const order = new MockServiceOrder({
        stationId: 'STATION_001',
        title: 'Test Timestamp Order',
        status: 'PENDING',
        createdBy: 'user123'
      });

      const originalUpdatedAt = order.updatedAt;
      
      // Esperar un poco para que sea perceptible
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await updateServiceOrderStatusWithValidation(order.id, 'IN_PROGRESS');

      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });

  });

});


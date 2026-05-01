/**
 * CAPA: Facade (Patrones de diseño - Simplificación de interfaz)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Proporciona una interfaz simplificada que combina repository y service
 * USO: En este proyecto NO se usa activamente, pero muestra el patrón
 * VENTAJA: Si se necesitara, centraliza acceso a datos de service orders
 */

const repository = require('./service-order.repository');
const service = require('./service-order.service');

class ServiceOrderFacade {

  /**
   * MÉTODO: getAll()
   * CAPA: Facade
   * DESCRIPCIÓn: Obtiene todas las órdenes delegando a repository
   * ENTRADA: Sin parámetros
   * SALIDA: Array de todas las órdenes
   */
  async getAll() {
    return repository.findAll();
  }

  /**
   * MÉTODO: create(data)
   * CAPA: Facade
   * DESCRIPCIÓn: Crea orden delegando a repository
   * ENTRADA: data {stationId, title, ...}
   * SALIDA: Orden creada con _id
   */
  async create(data) {
    return repository.create(data);
  }

  /**
   * MÉTODO: getById(id)
   * CAPA: Facade
   * DESCRIPCIÓn: Obtiene orden por ID con manejo de errores
   * ENTRADA: id (ObjectId)
   * PROCESO: Busca en repository → Valida existencia
   * SALIDA: Orden encontrada
   * ERROR: Lanza 'Service order not found' si no existe
   */
  async getById(id) {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error('Service order not found');
    }
    return order;
  }

  /**
   * MÉTODO: updateStatus(id, status)
   * CAPA: Facade
   * DESCRIPCIÓn: Actualiza status validando transiciones
   * ENTRADA: id (ObjectId), status (new status)
   * PROCESO:
   *   1. Obtiene orden actual
   *   2. Valida reglas de transición (via service.validateStatusTransition)
   *   3. Actualiza status via repository
   * SALIDA: Orden actualizada
   * ERROR: Si validación falla
   */
  async updateStatus(id, status) {
    const order = await repository.findById(id);
    if (!order) {
      throw new Error('Service order not found');
    }

    service.validateStatusTransition(order.status, status);
    return repository.updateStatus(id, status);
  }

}

module.exports = new ServiceOrderFacade();

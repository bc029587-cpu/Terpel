/**
 * CAPA: Repository (Acceso directo a datos)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Encapsula operaciones básicas con la BD (CRUD)
 * INTERACCIÓN: Mongoose Model (ServiceOrder)
 * NOTA: En este proyecto el servicio tambien hace trabajo de repository
 *       Este archivo es un patrón alternativo no usado activamente
 */

const ServiceOrder = require('./service-order.model');

class ServiceOrderRepository {

  /**
   * MÉTODO: findAll()
   * DESCRIPCIÓn: Obtiene todas las órdenes ordendas por fecha
   * ENTRADA: Sin parámetros
   * SALIDA: Array de todas las órdenes [{...}, {...}, ...]
   * RECIBE / ENVÍA: BD MongoDB
   */
  findAll() {
    return ServiceOrder.find().sort({ createdAt: -1 });
  }

  /**
   * MÉTODO: create(data)
   * DESCRIPCIÓn: Crea un documento nuevo en la BD
   * ENTRADA: data {stationId, title, description, type, createdBy}
   * SALIDA: Documento creado con _id asignado
   * RECIBE / ENVÍA: BD MongoDB
   */
  create(data) {
    return ServiceOrder.create(data);
  }

  /**
   * MÉTODO: findById(id)
   * DESCRIPCIÓn: Busca una orden por ObjectId
   * ENTRADA: id (ObjectId de MongoDB)
   * SALIDA: Documento encontrado o null
   * RECIBE / ENVÍA: BD MongoDB
   */
  findById(id) {
    return ServiceOrder.findById(id);
  }

  /**
   * MÉTODO: updateStatus(id, status)  
   * DESCRIPCIÓn: Actualiza el estado de una orden
   * ENTRADA: id (ObjectId), status (new status string)
   * SALIDA: Documento actualizado con nuevo status
   * RECIBE / ENVÍA: BD MongoDB
   */
  updateStatus(id, status) {
    return ServiceOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

}

module.exports = new ServiceOrderRepository();

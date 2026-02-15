const repository = require('./service-order.repository');
const service = require('./service-order.service');

class ServiceOrderFacade {

  async create(data) {
    return repository.create(data);
  }

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

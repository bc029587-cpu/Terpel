const ServiceOrder = require('./service-order.model');

class ServiceOrderRepository {

  create(data) {
    return ServiceOrder.create(data);
  }

  findById(id) {
    return ServiceOrder.findById(id);
  }

  updateStatus(id, status) {
    return ServiceOrder.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  }

}

module.exports = new ServiceOrderRepository();

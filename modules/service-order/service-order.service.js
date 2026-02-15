const CustomError = require('../../utils/custom-error');

class ServiceOrderService {

  validateStatusTransition(current, next) {
    if (current === 'CANCELLED') {
      throw new CustomError('Order is cancelled', 400);
    }

    if (current === 'DONE' && next === 'IN_PROGRESS') {
      throw new CustomError('Invalid status transition', 400);
    }
  }

}

module.exports = new ServiceOrderService();

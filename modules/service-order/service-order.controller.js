const facade = require('./service-order.facade');

exports.getAll = async (req, res, next) => {
  try {
    const orders = await facade.getAll();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const order = await facade.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await facade.getById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await facade.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
};

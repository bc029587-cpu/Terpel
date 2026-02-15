const facade = require('./service-order.facade');

exports.create = async (req, res, next) => {
  try {
    const order = await facade.create(req.body);
    res.status(201).json(order);
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

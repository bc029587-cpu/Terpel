const { v4: uuid } = require('uuid');

module.exports = (req, res, next) => {
  req.requestId = uuid();
  next();
};

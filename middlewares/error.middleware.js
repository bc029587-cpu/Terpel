const config = require('../config'); // 🔑 Usar configuración centralizada

module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  const payload = {
    error: err.message,
    requestId: req.requestId
  };

  // En desarrollo incluir stack para facilitar debugging
  if (config.isDevelopment) {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};

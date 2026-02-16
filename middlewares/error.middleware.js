module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  const payload = {
    error: err.message,
    requestId: req.requestId
  };

  // En entornos de desarrollo incluir stack para facilitar debugging
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  res.status(status).json(payload);
};

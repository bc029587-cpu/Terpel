exports.health = (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date()
  });
};

'use strict';

const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', authController.register);

// Endpoint protegido para verificar token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

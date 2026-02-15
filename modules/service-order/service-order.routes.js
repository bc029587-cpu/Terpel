'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./service-order.controller');
const auth = require('../../middlewares/auth.middleware');

// 🔐 protegida
router.get('/', auth, controller.getAll);

// 🔐 protegida
router.post('/', auth, controller.create);

// 🔐 protegida
router.get('/:id', auth, controller.getById);

// 🔐 protegida - Actualizar estado de la orden
router.put('/:id/status', auth, controller.updateStatus);

module.exports = router;


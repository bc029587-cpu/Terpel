'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./service-order.controller');
const auth = require('../../middlewares/auth.middleware');

// 
router.post('/', controller.create);

// 🔐 protegida
router.get('/', auth, controller.findAll);

// 🔐 protegida
router.get('/:id', auth, controller.findById);

// 🔐 protegida - Actualizar estado de la orden
router.put('/:id/status', auth, controller.updateStatus);

// 🔐 protegida - Actualizar orden completa
router.put('/:id', auth, controller.update);

// 🔐 protegida - Eliminar orden
router.delete('/:id', auth, controller.remove);

module.exports = router;


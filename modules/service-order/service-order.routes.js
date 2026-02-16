'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./service-order.controller');
const auth = require('../../middlewares/auth.middleware');

// // 🔓 Sin protección - Crear orden
// router.post('/', auth, controller.create);

// // 🔐 protegida - Búsqueda CON filtros (DEBE ir ANTES que /:id)
// router.get('/search/filters',  auth,controller.searchByFilters);

// // 🔐 protegida - Listar TODAS las órdenes (sin filtros)
// router.get('/', auth, controller.findAll);

// // 🔐 protegida - Obtener orden por ID (DEBE ir DESPUÉS de /search/filters)
// router.get('/:id', auth, controller.findById);

// // 🔐 protegida - Actualizar estado de la orden
// router.put('/:id/status', auth, controller.updateStatus);

// // 🔐 protegida - Actualizar orden completa
// router.put('/:id', auth, controller.update);

// // 🔐 protegida - Eliminar orden
// router.delete('/:id', auth, controller.remove);

// 🔐 protege TODO el módulo
router.use(auth);

// ⚠️ rutas específicas primero
// router.get('/search/filters', controller.searchByFilters);

router.get('/search/filters', (req, res, next) => {
    console.log("¡Ruta de filtros detectada!");
    next();
}, controller.searchByFilters);

// generales
router.post('/', controller.create);
router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.patch('/:id/status', controller.updateStatus);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;


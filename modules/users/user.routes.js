'use strict';

const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

/**
 * @route   GET /api/users
 * @desc    Listar todos los usuarios (ADMIN only)
 * @private
 */
router.get('/', auth, controller.getAll);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @private
 */
router.get('/:id', auth, controller.getById);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario
 * @private
 */
router.put('/:id', auth, controller.update);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario (soft delete)
 * @private
 */
router.delete('/:id', auth, controller.delete);

/**
 * @route   POST /api/users/change-password
 * @desc    Cambiar contraseña del usuario actual
 * @private
 */
router.post('/change-password', auth, controller.changePassword);

module.exports = router;

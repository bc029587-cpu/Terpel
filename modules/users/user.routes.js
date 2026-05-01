'use strict';

/**
 * CAPA: Routes (Definición de endpoints HTTP de Usuarios)
 * MÓDULO: Users (Gestión de usuarios)
 * DESCRIPCIÓN: Define rutas CRUD para gestionar usuarios
 * FLUJO: HTTP Request → Ruta → Middleware (auth) → Controller → Service → Response
 * AUTENTICACIÓN: Todas las rutas requieren token JWT valido
 * ENDPOINTS:
 *   GET    /api/users          - Listar todos los usuarios
 *   GET    /api/users/:id      - Obtener usuario por ID
 *   PUT    /api/users/:id      - Actualizar usuario
 *   DELETE /api/users/:id      - Eliminar usuario (soft delete)
 *   POST   /api/users/change-password - Cambiar contraseña
 */

const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const auth = require('../../middlewares/auth.middleware');

/**
 * RUTA: GET /api/users
 * MÉTODO: getAll
 * DESCRIPCIÓn: Lista todos los usuarios del sistema
 * AUTENTICACIÓN: Requerida (authMiddleware)
 * SALIDA: 200 + JSON array de usuarios {_id, email, name, role, active, createdAt}
 * SEGURIDAD: Excluye passwords
 * FLUJO: Cliente solicita → API obtiene de BD → Devuelve lista usuarios
 */
router.get('/', auth, controller.getAll);

/**
 * RUTA: GET /api/users/:id
 * MÉTODO: getById
 * DESCRIPCIÓN: Obtiene los datos de un usuario específico
 * ENTRADA: req.params.id (ObjectId)
 * AUTENTICACIÓN: Requerida
 * SALIDA: 200 + JSON usuario {_id, email, name, role} O 404 si no existe
 * FLUJO: Cliente solicita usuario → API busca por ID → Devuelve datos
 */
router.get('/:id', auth, controller.getById);

/**
 * RUTA: PUT /api/users/:id
 * MÉTODO: update
 * DESCRIPCIÓN: Actualiza datos de un usuario
 * ENTRADA: req.params.id, Body {email?, name?, role?}
 * AUTENTICACIÓN: Requerida
 * AUTORIZACIÓN: Solo ADMIN puede cambiar rol
 * SALIDA: 200 + JSON usuario actualizado O 403 si no tiene permisos
 * FLUJO: Cliente enviá datos nuevos → API valida permisos → actualiza → Devuelve usuario
 */
router.put('/:id', auth, controller.update);

/**
 * RUTA: DELETE /api/users/:id
 * MÉTODO: delete
 * DESCRIPCIÓN: Elimina un usuario (soft delete - marca como inactivo)
 * ENTRADA: req.params.id (ObjectId)
 * AUTENTICACIÓN: Requerida
 * SALIDA: 204 No Content (sin body)
 * NOTA: No elimina datos, solo marca active: false
 * FLUJO: Cliente solicita eliminar → API marca inactivo → Devuelve 204
 */
router.delete('/:id', auth, controller.delete);

/**
 * RUTA: POST /api/users/change-password
 * MÉTODO: changePassword
 * DESCRIPCIÓN: Cambia la contraseña del usuario autenticado
 * ENTRADA: req.body {currentPassword, newPassword}
 * AUTENTICACIÓN: Requerida (req.user disponible en req.user.id)
 * SALIDA: 200 + JSON {message: '...'} O 401 si password actual es incorrecto
 * SEGURIDAD: Verifica password actual antes de permitir cambio
 * FLUJO: Usuario enviá {old, new} → API verifica actual → Hashea nuevo → Actualiza → Confirma
 */
router.post('/change-password', auth, controller.changePassword);

module.exports = router;

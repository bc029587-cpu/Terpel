'use strict';

/**
 * CAPA: Controller (Endpoints HTTP de usuarios)
 * MÓDULO: Users (Gestión de usuarios)
 * DESCRIPCIÓN: Maneja requests HTTP de usuarios, valida entrada, delega a servicio
 * FLUJO: Request HTTP → Valida datos → Llama service → Responde cliente
 * AUTENTICACIÓN: Usa authMiddleware para proteger todos los endpoints
 * AUTORIZACIÓN: Algunos endpoints requieren verificación adicional (ej: cambiar rol requiere ADMIN)
 */

const userService = require('./user.service');
const bcrypt = require('bcryptjs');

/**
 * FUNCIÓN: getAll(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Obtiene lista de todos los usuarios
 * ENDPOINT: GET /api/users
 * AUTENTICACIÓN: Requerida (authMiddleware)
 * ENTRADA: Sin parámetros
 * PROCESO: Delega a userService.getAllUsers()
 * SALIDA: JSON array de usuarios activos sin passwords
 * FLUJO: Cliente → GET /api/users con JWT → API busca en BD → Devuelve lista usuarios
 */
exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * FUNCIÓN: getById(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Obtiene datos de un usuario especifico
 * ENDPOINT: GET /api/users/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id (ObjectId)
 * PROCESO: 
 *   1. Valida que el usuario exista
 *   2. Delega a userService.findById()
 * SALIDA: JSON con datos del usuario o 404 si no existe
 * FLUJO: Cliente → GET /api/users/123abc → API busca en BD → Devuelve usuario
 */
exports.getById = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * FUNCIÓN: update(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Actualiza datos de un usuario
 * ENDPOINT: PUT /api/users/:id
 * AUTENTICACIÓN: Requerida
 * AUTORIZACIÓN: Solo ADMIN puede cambiar rol
 * ENTRADA: req.params.id (ObjectId), req.body {email?, name?, role?}
 * PROCESO:
 *   1. Valida que no intente cambiar rol si no es ADMIN
 *   2. Filtra campos actualizables
 *   3. Delega a userService.updateUser()
 * SALIDA: JSON usuario actualizado o 403 si no tiene permisos
 * SEGURIDAD: Valida permisos antes de permitir cambio de rol
 */
exports.update = async (req, res, next) => {
  try {
    const { email, name, role } = req.body;

    // Validar que no se intente cambiar el rol si no es ADMIN
    if (role && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permisos para cambiar roles' });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;

    const user = await userService.updateUser(req.params.id, updateData);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * FUNCIÓN: delete(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Desactiva un usuario (soft delete)
 * ENDPOINT: DELETE /api/users/:id
 * AUTENTICACIÓN: Requerida
 * ENTRADA: req.params.id (ObjectId)
 * PROCESO: Delega a userService.deleteUser() que marca active: false
 * SALIDA: Status 204 No Content (sin body)
 * NOTA: No elimina datos, solo marca como inactivo
 * FLUJO: Cliente → DELETE /api/users/123abc → API marca inactivo en BD → Devuelve 204
 */
exports.delete = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/**
 * FUNCIÓN: changePassword(req, res, next)
 * CAPA: Controller
 * DESCRIPCIÓN: Cambia la contraseña del usuario actual
 * ENDPOINT: POST /api/users/change-password
 * AUTENTICACIÓN: Requerida (req.user disponible desde authMiddleware)
 * ENTRADA: req.body {currentPassword, newPassword}
 * PROCESO:
 *   1. Valida que ambas contraseñas estén presentes
 *   2. Obtiene usuario actual de BD
 *   3. Verifica que currentPassword coincida con hash en BD
 *   4. Hashea nueva contraseña
 *   5. Actualiza en BD
 * SALIDA: Mensaje de éxito o error 400/401
 * SEGURIDAD: Verifica contraseña actual antes de permitir cambio
 * FLUJO: Usuario → Envía {old_pass, new_pass} → API verifica → Actualiza → Devuelve confirmación
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
    }

    // Obtener usuario actual
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear nueva contraseña
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar
    await userService.updateUser(req.user.id, { password: passwordHash });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    next(err);
  }
};

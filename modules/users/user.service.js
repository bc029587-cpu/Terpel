'use strict';

/**
 * CAPA: Service/Repository (Acceso a datos de usuarios)
 * MÓDULO: Users (Gestión de usuarios)
 * DESCRIPCIÓN: Encapsula todas las operaciones CRUD de usuarios en la BD
 * INTERACCIÓN: BD (MongoDB) a través de modelo User (Mongoose)
 * NOTA: Este servicio contiene lógica de datos, no lógica de negocio compleja
 */

const User = require('./user.model');

/**
 * FUNCIÓN: findByEmail(email)
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Busca un usuario por email en la BD
 * ENTRADA: email (string)
 * SALIDA: Usuario encontrado {_id, email, password (hasheado), role, name, ...} o null
 * USO: Validación en login, registro, verificación de duplicados
 * RECIBE DE: MongoDB (User Model)
 */
async function findByEmail(email) {
  return User.findOne({ email });
}

/**
 * FUNCIÓN: findById(id)
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Busca usuario por ObjectId de MongoDB
 * ENTRADA: id (string - ObjectId de MongoDB)
 * SALIDA: Usuario {_id, email, name, role, active} sin password (select('-password'))
 * SEGURIDAD: No devuelve password al usar select('-password')
 * USO: Obtener datos del usuario actual, mostrar perfil, etc
 * RECIBE DE: MongoDB
 */
async function findById(id) {
  return User.findById(id).select('-password');
}

/**
 * FUNCIÓN: createUser(data)
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Crea un nuevo usuario en la BD
 * ENTRADA: data {email, password (ya hasheado), name, role}
 * PROCESO: Instancia User con datos → Valida esquema Mongoose → Guarda en BD
 * SALIDA: Usuario creado con _id asignado por MongoDB
 * RECIBE DE: auth.service (durante registro)
 * ENVÍA A: MongoDB
 */
async function createUser(data) {
  const user = new User(data);
  return user.save();
}

/**
 * FUNCIÓN: getAllUsers()
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Obtiene lista completa de usuarios activos
 * ENTRADA: Sin parámetros
 * PROCESO: Busca usuarios {active: true} → Ordena por fecha creación descendente → Excluye passwords
 * SALIDA: Array de usuarios activos [{_id, email, name, role, active, createdAt}, ...]
 * SEGURIDAD: select('-password') excluye contraseñas
 * USO: Listar usuarios en panel admin
 * RECIBE DE: user.controller.getAll()
 */
async function getAllUsers() {
  return User.find({ active: true }).select('-password').sort({ createdAt: -1 });
}

/**
 * FUNCIÓN: updateUser(id, data)
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Actualiza campos seleccionados de un usuario
 * ENTRADA: id (ObjectId), data (objeto con campos a actualizar)
 * PROCESO: Busca usuario → Actualiza campos → Guarda en BD
 * SALIDA: Usuario actualizado {_id, email, name, role, ...} sin password
 * SEGURIDAD: select('-password') no devuelve password
 * USO: Cambiar nombre, email, rol, contraseña
 * RECIBE DE: user.controller (PUT /api/users/:id)
 * ENVÍA A: MongoDB (actualización)
 */
async function updateUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
}

/**
 * FUNCIÓN: deleteUser(id)
 * CAPA: Service/Repository
 * DESCRIPCIÓN: Marca usuario como inactivo (soft delete)
 * ENTRADA: id (ObjectId)
 * PROCESO: Busca usuario → Establece active: false → Guarda en BD
 * SALIDA: Usuario desactivado
 * IMPORTANTE: No elimina datos, solo marca como inactivo
 * MOTIVO: Mantener integridad referencial (historial de órdenes, etc)
 * USO: DELETE /api/users/:id
 * RECIBE DE: user.controller.delete()
 * ENVÍA A: MongoDB (soft delete)
 */
async function deleteUser(id) {
  return User.findByIdAndUpdate(id, { active: false }, { new: true });
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};

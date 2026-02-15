'use strict';

const userService = require('./user.service');
const bcrypt = require('bcryptjs');

exports.getAll = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

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

exports.delete = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

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

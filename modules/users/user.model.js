'use strict';

/**
 * CAPA: Model (Esquema Mongoose de usuarios)
 * MÓDULO: Users
 * DESCRIPCIÓN: Define estructura de documentos User en MongoDB
 * VALIDACIONES: Tipo de datos, requeridos, Único, etc
 * COLECIÓN: 'users' en MongoDB
 */

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    /**
     * CAMPO: email
     * TIPO: String
     * VALIDACIONES: 
     *   - required: obligatorio
     *   - unique: no puede repetirse (solo 1 usuario por email)
     *   - lowercase: convierte a minúsculas antes de guardar
     *   - trim: elimina espacios en blanco
     */
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    /**
     * CAMPO: name
     * TIPO: String
     * VALIDACIONES:
     *   - trim: elimina espacios en blanco
     * OPCIONAL: No es requerido
     */
    name: {
      type: String,
      trim: true
    },
    /**
     * CAMPO: password
     * TIPO: String
     * CONTENIDO: Password hasheado con bcrypt (+60 caracteres)
     * SEGURIDAD: Nunca guardar password en texto plano
     */
    password: {
      type: String,
      required: true
    },
    /**
     * CAMPO: role
     * TIPO: String (enum)
     * VALORES PERMITIDOS: 'ADMIN', 'USER'
     * DEFAULT: 'USER'
     * USO: Control de acceso - determina permisos del usuario
     */
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    },
    /**
     * CAMPO: active
     * TIPO: Boolean
     * DEFAULT: true
     * USO: Soft delete - cuando se elimina un usuario, se marca inactivo
     * VENTAJA: Mantiene integridad referencial con órdenes del usuario
     */
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

'use strict';

/**
 * CAPA: Model (Esquema Mongoose de Órdenes de Servicio)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Define estructura de documentos ServiceOrder en MongoDB
 * VALIDACIONES: Tipos, requeridos, enums, etc
 * COLECCIÓN: 'serviceorders' en MongoDB
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ServiceOrderSchema = new mongoose.Schema(
  {
    /**
     * CAMPO: id
     * TIPO: String (UUID)
     * GENERACIÓN: Autómatica con uuidv4()
     * USO: ID de negocio (diferente del _id de MongoDB)
     * ÍNDICE: Indexado para búsquedas rápidas
     */
  //  ID de negocio (UUID)
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    /**
     * CAMPO: stationId
     * TIPO: String
     * VALIDACIONES: required, trim
     * USO: Identificación de la estación de servicio asociada
     * EJEMPLO: 'ST-001', 'ST-BOGOTA-01', etc
     * ÍNDICE: Indexado para filtrados frecuentes
     */
    stationId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    /**
     * CAMPO: title
     * TIPO: String
     * VALIDACIONES: required, trim
     * USO: Título descriptivo de la orden
     * EJEMPLO: 'Revísion de motor', 'Cambio de aceite', etc
     */
    title: {
      type: String,
      required: true,
      trim: true
    },
    /**
     * CAMPO: description
     * TIPO: String
     * VALIDACIONES: trim
     * OPCIONAL: No es requerido
     * USO: Descripción detallada de la orden
     */
    description: {
      type: String,
      trim: true
    },
    /**
     * CAMPO: status
     * TIPO: String (enum)
     * VALORES: 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
     * DEFAULT: 'PENDING'
     * USO: Estado del flujo de la orden
     * ÍNDICE: Indexado para filtrados frecuentes
     * TRANSICIONES:
     *   - PENDING -> IN_PROGRESS
     *   - IN_PROGRESS -> COMPLETED
     *   - Cualquiera -> CANCELLED (siempre permitido)
     *   - COMPLETED -> IN_PROGRESS (NO permitido)
     */
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    /**
     * CAMPO: type
     * TIPO: String (enum)
     * VALORES: 'INVOICE', 'SUPPORT', 'REDEMPTION'
     * DEFAULT: 'INVOICE'
     * REQUERIDO: Sí
     * USO: Tipo de orden de servicio
     */
      type: {
      type: String,
      enum: ['INVOICE', 'SUPPORT', 'REDEMPTION'],
      default: 'INVOICE',
      required: true,
    },


    /**
     * CAMPO: createdBy
     * TIPO: ObjectId (referencia a documento User)
     * VALIDACIONES: required
     * REF: 'User' (establece relación con colección de usuarios)
     * USO: Qué usuario creó esta orden
     * POPULATE: Se puede usar populate('createdBy') para obtener datos del usuario
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ServiceOrder', ServiceOrderSchema);

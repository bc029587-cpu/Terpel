'use strict';

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ServiceOrderSchema = new mongoose.Schema(
  {

  //  ID de negocio (UUID)
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    stationId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
      type: {
      type: String,
      enum: ['INVOICE', 'SUPPORT', 'REDEMPTION'],
      default: 'INVOICE',
      required: true,
    },


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

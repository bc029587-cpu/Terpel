const mongoose = require('mongoose');
const { TYPES, STATUS } = require('./service-order.enums');

const schema = new mongoose.Schema({
  stationId: { type: String, required: true },
  type: { type: String, enum: TYPES, required: true },
  description: { type: String },
  status: { type: String, enum: STATUS, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ServiceOrder', schema);

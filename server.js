'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 4201;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/terpel';

/* ======================
   Inicio del servidor
====================== */
async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

startServer();

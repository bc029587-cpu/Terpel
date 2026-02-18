'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config'); //  Importar configuración centralizada

/* ======================
   Inicio del servidor
====================== */
async function startServer() {
  try {
    // Conectar a MongoDB
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(config.database.uri, config.database.options);
    console.log(' MongoDB conectado correctamente');

    // Iniciar servidor
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`Servidor corriendo en ${config.server.url}`);
      console.log(` Ambiente: ${config.env.toUpperCase()}`);
      console.log(` Node Version: ${process.version}`);
    });

    // Manejo de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
      console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    process.on('uncaughtException', (error) => {
      console.error(' Uncaught Exception:', error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM recibido, cerrando servidor...');
      server.close(() => {
        mongoose.connection.close();
        console.log(' Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error(' Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();

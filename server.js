'use strict';

/**
 * CAPA: Server Entry Point
 * ARCHIVO: server.js
 * DESCRIPCIÓN: Punto de entrada. Inicia el servidor Express e instancia MongoDB
 * FLUJO: Cargar env → Conectar BD → Iniciar servidor → Manejo de errores/graceful shutdown
 */

require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config'); //  Importar configuración centralizada

/**
 * FUNCIÓN: startServer()
 * CAPA: Server Bootstrap
 * DESCRIPCIÓN: Inicializa el servidor completo
 * FLUJO: 
 *   1. Conecta a MongoDB usando URI de config
 *   2. Inicia servidor Express en puerto configurado
 *   3. Configura manejadores para errores no capturados
 *   4. Configura graceful shutdown (SIGTERM)
 * ENTRADA: Variables de entorno (.env)
 * SALIDA: Servidor corriendo en puerto config.server.port
 */
async function startServer() {
  try {
    /**
     * PASO 1: Conectar a MongoDB
     * PROCESO: Utiliza mongoose para conectarse a la BD
     * RECIBE: config.database.uri (URI de MongoDB)
     * SALIDA: Conexión establecida o error
     */
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(config.database.uri, config.database.options);
    console.log(' MongoDB conectado correctamente');

    /**
     * PASO 2: Iniciar Servidor
     * PROCESO: Inicia servidor Express en puerto y host configurados
     * RECIBE: app (aplicación Express), puerto y host de config
     * SALIDA: Servidor escuchando en http://host:port
     */
    const server = app.listen(config.server.port, config.server.host, () => {
      console.log(`Servidor corriendo en ${config.server.url}`);
      console.log(` Ambiente: ${config.env.toUpperCase()}`);
      console.log(` Node Version: ${process.version}`);
    });

    /**
     * PASO 3: Manejo de Rechazos no capturados
     * PROCESO: Captura Promesas que fueron rechazadas sin .catch()
     * ENTRADA: Error de una Promesa no manejada
     * SALIDA: Log del error y cierre del proceso
     */
    process.on('unhandledRejection', (reason, promise) => {
      console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    /**
     * PASO 4: Manejo de Excepciones no capturadas
     * PROCESO: Captura errores sincrónicos no manejados
     * ENTRADA: Excepción no capturada
     * SALIDA: Log del error y cierre del proceso
     */
    process.on('uncaughtException', (error) => {
      console.error(' Uncaught Exception:', error);
      process.exit(1);
    });

    /**
     * PASO 5: Graceful Shutdown (SIGTERM)
     * PROCESO: Cierra el servidor de forma segura cuando recibe SIGTERM
     * ENTRADA: Señal SIGTERM del sistema operativo
     * SALIDA: Servidor cerrado y conexión a BD cerrada
     * NOTA: Permite que las requests activas terminen antes de cerrar
     */
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

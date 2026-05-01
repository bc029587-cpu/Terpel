'use strict';

/**
 * CAPA: Punto de entrada de la aplicación
 * ARCHIVO: app.js
 * DESCRIPCIÓN: Configura y estructura la aplicación Express
 * FLUJO GENERAL: Imports → Middlewares globales → CORS → Rutas → Error handling
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const config = require('./config'); // 🔑 Importar configuración centralizada

const app = express();

const authRoutes = require('./modules/auth/auth.routes');
const serviceOrderRoutes = require('./modules/service-order/service-order.routes');
const userRoutes = require('./modules/users/user.routes');
const authMiddleware = require('./middlewares/auth.middleware');
const requestId = require('./middlewares/request-id.middleware');
const errorHandler = require('./middlewares/error.middleware');

/* ======================
   CAPA: Middlewares globales
   DESCRIPCIÓN: Se aplican a TODAS las requests
   - urlencoded: Parsea datos en formularios
   - json: Parsea JSON (max 50mb)
   - requestId: Agrega ID único para trazabilidad
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(requestId);

/* ======================
   CAPA: CORS Configuration
   DESCRIPCIÓN: Controla qué orígenes pueden acceder a la API
   RECIBE: Configuración de config.cors
   ENVÍA: Headers CORS en respuestas
====================== */
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders
}));

/* ======================
   CAPA: Application Routes (Health Check)
   DESCRIPCIÓN: Endpoint de prueba para verificar si la API está activa
   ENTRADA: GET request
   SALIDA: JSON con estado de la API
====================== */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

/* ======================
   CAPA: API Documentation (Swagger)
   DESCRIPCIÓN: Interfaz interactiva para probar endpoints
   ENTRADA: GET /api-docs
   SALIDA: HTML con documentación interactiva
====================== */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  swaggerOptions: {
    url: '/api-docs',
    displayOperationId: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: false,
    docExpansion: 'list'
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Terpel API - Documentación de Service Orders'
}));

/**
 * CAPA: Application Routes (Protected Test)
 * DESCRIPCIÓN: Endpoint para verificar autenticación
 * ENTRADA: GET request con token JWT en header Authorization
 * MIDDLEWARE: authMiddleware valida el token
 * SALIDA: JSON con datos del usuario autenticado
 */
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Accediste a un endpoint protegido',
    user: req.user
  });
});

/* ======================
   CAPA: Rutas de módulos
   DESCRIPCIÓN: Registra los routers de cada módulo en sus prefijos
   - /api/auth: Autenticación (login, register)
   - /api/service-orders: Órdenes de servicio (CRUD)
   - /api/users: Gestión de usuarios (CRUD, cambio de contraseña)
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api/users', userRoutes);

// Log de diagnóstico
if (config.isDevelopment) {
  console.log('✓ Auth router montado en /api/auth');
  console.log('✓ Service Orders router montado en /api/service-orders');
  console.log('✓ Users router montado en /api/users');
}

/**
 * CAPA: Error Handling
 * DESCRIPCIÓN: Manejo de rutas 404 y errores globales
 * 404 Handler: Responde cuando ninguna ruta coincide
 * errorHandler: Captura y formatea todos los errores (debe ir al final)
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;

'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./modules/auth/auth.routes');
const serviceOrderRoutes = require('./modules/service-order/service-order.routes');
const userRoutes = require('./modules/users/user.routes');
const authMiddleware = require('./middlewares/auth.middleware');
const requestId = require('./middlewares/request-id.middleware');
const errorHandler = require('./middlewares/error.middleware');

/* ======================
   Middlewares globales
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(requestId);



/* ======================
   CORS (usando librería)
====================== */
app.use(cors({
  origin: '*', // En producción se restringe
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

/* ======================
   Rutas base
====================== */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'API funcionando correctamente'
  });
});



// Endpoint protegido de prueba
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'Accediste a un endpoint protegido',
    user: req.user
  });
});

/* ======================
   Rutas de módulos
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/service-orders', serviceOrderRoutes);
app.use('/api/users', userRoutes);

// Log de diagnóstico
console.log('✓ Auth router montado en /api/auth');
console.log('✓ Service Orders router montado en /api/service-orders');
console.log('✓ Users router montado en /api/users');

// Middleware 404 explícito
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;

'use strict';

const express = require('express');
const cors = require('cors');

const app = express();

const authRoutes = require('./modules/auth/auth.routes');
const authMiddleware = require('./middlewares/auth.middleware');

/* ======================
   Middlewares globales
====================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));



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

// Aquí luego irán tus módulos
app.use('/api/auth', authRoutes);



module.exports = app;

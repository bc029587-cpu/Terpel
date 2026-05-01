'use strict';

/**
 * CAPA: Routes (Definición de endpoints HTTP)
 * MÓDULO: Service Orders
 * DESCRIPCIÓN: Define todas las rutas HTTP para órdenes de servicio
 * FLUJO: Request HTTP → Ruta coincide → Middleware (auth) → Controller → Response
 * AUTENTICACIÓN: router.use(auth) protege TODAS las rutas de este módulo
 */

const express = require('express');
const router = express.Router();

const controller = require('./service-order.controller');
const auth = require('../../middlewares/auth.middleware');

// 🔐 Todas las rutas requieren auenticación JWT
router.use(auth);

/**
 * @swagger
 * /api/service-orders:
 *   post:
 *     summary: Crear nueva orden de servicio
 *     description: Crea una nueva orden de servicio asociada a una estación Terpel
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceOrderRequest'
 *     responses:
 *       '201':
 *         description: Orden de servicio creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       '400':
 *         description: Datos inválidos o incompletos
 *       '401':
 *         description: No autorizado
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/service-orders:
 *   get:
 *     summary: Listar todas las órdenes de servicio
 *     description: Obtiene un listado de todas las órdenes (con paginación opcional)
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Registros por página
 *     responses:
 *       '200':
 *         description: Listado de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       '404':
 *         description: No se encontraron órdenes
 *       '401':
 *         description: No autorizado
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/service-orders/search/filters:
 *   get:
 *     summary: Buscar órdenes con filtros avanzados
 *     description: Busca órdenes aplicando filtros específicos (stationId y/o status)
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: stationId
 *         in: query
 *         schema:
 *           type: string
 *         description: Identificador de la estación
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Estado de la orden
 *     responses:
 *       '200':
 *         description: Búsqueda completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceOrder'
 *       '400':
 *         description: Filtros inválidos
 *       '401':
 *         description: No autorizado
 */
router.get('/search/filters', (req, res, next) => {
    console.log("¡Ruta de filtros detectada!");
    next();
}, controller.searchByFilters);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   get:
 *     summary: Obtener orden de servicio por ID
 *     description: Recupera los detalles completos de una orden específica
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId de la orden
 *     responses:
 *       '200':
 *         description: Orden recuperada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       '404':
 *         description: Orden no encontrada
 *       '401':
 *         description: No autorizado
 */
router.get('/:id', controller.findById);

/**
 * @swagger
 * /api/service-orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de la orden
 *     description: Actualiza únicamente el estado de una orden existente
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       '200':
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       '400':
 *         description: Transición inválida o status no proporcionado
 *       '404':
 *         description: Orden no encontrada
 *       '401':
 *         description: No autorizado
 */
router.patch('/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   put:
 *     summary: Actualizar orden de servicio
 *     description: Actualiza uno o más campos de una orden existente
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceOrderRequest'
 *     responses:
 *       '200':
 *         description: Orden actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceOrder'
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Orden no encontrada
 *       '401':
 *         description: No autorizado
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   delete:
 *     summary: Eliminar orden de servicio
 *     description: Elimina permanentemente una orden de servicio
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId de la orden
 *     responses:
 *       '204':
 *         description: Orden eliminada exitosamente
 *       '404':
 *         description: Orden no encontrada
 *       '401':
 *         description: No autorizado
 */
router.delete('/:id', controller.remove);

module.exports = router;


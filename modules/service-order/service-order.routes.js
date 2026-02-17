'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./service-order.controller');
const auth = require('../../middlewares/auth.middleware');

// 🔐 protege TODO el módulo----------------------------reevisar protecciones------------------
//router.use(auth);

/**
 * @swagger
 * /api/service-orders:
 *   post:
 *     summary: Crear una nueva orden de servicio
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
 *         description: Orden creada exitosamente
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/service-orders:
 *   get:
 *     summary: Listar todas las órdenes de servicio
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listado de órdenes
 */
router.get('/', controller.findAll);

/**
 * @swagger
 * /api/service-orders/search/filters:
 *   get:
 *     summary: Buscar órdenes con filtros
 *     tags:
 *       - Service Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: stationId
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Búsqueda completada
 */
router.get('/search/filters', (req, res, next) => {
    console.log("¡Ruta de filtros detectada!");
    next();
}, controller.searchByFilters);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
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
 *     responses:
 *       200:
 *         description: Orden encontrada
 */
router.get('/:id', controller.findById);

/**
 * @swagger
 * /api/service-orders/{id}/status:
 *   patch:
 *     summary: Actualizar estado de la orden
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/status', controller.updateStatus);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   put:
 *     summary: Actualizar orden de servicio
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateServiceOrderRequest'
 *     responses:
 *       200:
 *         description: Orden actualizada
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/service-orders/{id}:
 *   delete:
 *     summary: Eliminar orden de servicio
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
 *     responses:
 *       204:
 *         description: Orden eliminada
 */
router.delete('/:id', controller.remove);

module.exports = router;

//       Crea una nueva orden de servicio asociada a una estación Terpel.
//       Requiere autenticación JWT. El usuario autenticado será registrado como creador.
//       
//       **Validaciones:**
//       - stationId es requerido y será indexado para búsquedas rápidas
//       - title es requerido y puede tener máximo 255 caracteres
//       - description es opcional
//       - El estado inicial siempre es 'PENDING'
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             $ref: '#/components/schemas/CreateServiceOrderRequest'
//           examples:
//             basic:
//               summary: Ejemplo básico
//               value:
//                 stationId: "STATION-001"
//                 title: "Mantenimiento de dispensadores"
//             detailed:
//               summary: Ejemplo con descripción
//               value:
//                 stationId: "STATION-002"
//                 title: "Revisión de tanques"
//                 description: "Inspección completa de tanques de almacenamiento y filtros"
//     responses:
//       '201':
//         description: Orden de servicio creada exitosamente
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ServiceOrder'
//       '400':
//         description: Datos inválidos o incompletos
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
//       '500':
//         description: Error interno del servidor
// ============================================
router.post('/', controller.create);

// ============================================
// @swagger
// /api/service-orders:
//   get:
//     summary: Listar todas las órdenes de servicio
//     description: |
//       Obtiene un listado de todas las órdenes de servicio o con paginación.
//       Soporta parámetros opcionales de paginación.
//       
//       **Parámetros de paginación:**
//       - Si se proporcionan tanto 'page' como 'limit', la respuesta incluye metadatos de paginación
//       - Sin parámetros, retorna todas las órdenes ordenadas por fecha de creación (descendente)
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: page
//         in: query
//         description: Número de página (comienza en 1)
//         schema:
//           type: integer
//           minimum: 1
//           example: 1
//       - name: limit
//         in: query
//         description: Cantidad de registros por página
//         schema:
//           type: integer
//           minimum: 1
//           example: 20
//     responses:
//       '200':
//         description: Listado de órdenes recuperado exitosamente
//         content:
//           application/json:
//             schema:
//               oneOf:
//                 - $ref: '#/components/schemas/PaginatedResponse'
//                 - type: object
//                   properties:
//                     total:
//                       type: integer
//                     data:
//                       type: array
//                       items:
//                         $ref: '#/components/schemas/ServiceOrder'
//       '404':
//         description: No se encontraron órdenes en la base de datos
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 message:
//                   type: string
//                 data:
//                   type: array
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.get('/', controller.findAll);

// ============================================
// @swagger
// /api/service-orders/search/filters:
//   get:
//     summary: Buscar órdenes con filtros avanzados
//     description: |
//       Busca órdenes de servicio aplicando filtros específicos.
//       Al menos un filtro debe ser proporcionado (stationId o status).
//       
//       **Filtros disponibles:**
//       - stationId: Filtra por estación específica
//       - status: Filtra por estado de la orden
//       
//       **Estados válidos:** PENDING, IN_PROGRESS, COMPLETED, CANCELLED
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: stationId
//         in: query
//         description: Identificador de la estación
//         schema:
//           type: string
//           example: "STATION-001"
//       - name: status
//         in: query
//         description: Estado de la orden
//         schema:
//           type: string
//           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
//           example: "IN_PROGRESS"
//     responses:
//       '200':
//         description: Búsqueda completada exitosamente
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 total:
//                   type: integer
//                 data:
//                   type: array
//                   items:
//                     $ref: '#/components/schemas/ServiceOrder'
//       '400':
//         description: Filtros inválidos o ausentes / Status no válido
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '404':
//         description: No se encontraron órdenes que cumplan los filtros
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 message:
//                   type: string
//                 data:
//                   type: array
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.get('/search/filters', (req, res, next) => {
    console.log("¡Ruta de filtros detectada!");
    next();
}, controller.searchByFilters);

// ============================================
// @swagger
// /api/service-orders/{id}:
//   get:
//     summary: Obtener orden de servicio por ID
//     description: |
//       Recupera los detalles completos de una orden de servicio específica.
//       Incluye información del usuario creador y timestamps.
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: id
//         in: path
//         required: true
//         description: MongoDB ObjectId de la orden
//         schema:
//           type: string
//           format: uuid
//           example: "507f1f77bcf86cd799439011"
//     responses:
//       '200':
//         description: Orden recuperada exitosamente
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ServiceOrder'
//       '404':
//         description: Orden de servicio no encontrada
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.get('/:id', controller.findById);

// ============================================
// @swagger
// /api/service-orders/{id}/status:
//   patch:
//     summary: Actualizar estado de la orden de servicio
//     description: |
//       Actualiza únicamente el estado de una orden de servicio existente.
//       
//       **Restricciones de transición:**
//       - No se pueden realizar cambios si la orden está en estado CANCELLED
//       - No se permite la transición COMPLETED -> IN_PROGRESS
//       - Estados válidos: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
//       
//       **Caso de uso típico:** PENDING -> IN_PROGRESS -> COMPLETED
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: id
//         in: path
//         required: true
//         description: MongoDB ObjectId de la orden
//         schema:
//           type: string
//           format: uuid
//           example: "507f1f77bcf86cd799439011"
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             $ref: '#/components/schemas/UpdateStatusRequest'
//           examples:
//             toPending:
//               summary: Cambiar a PENDING
//               value:
//                 status: "PENDING"
//             toInProgress:
//               summary: Cambiar a IN_PROGRESS
//               value:
//                 status: "IN_PROGRESS"
//             toCompleted:
//               summary: Cambiar a COMPLETED
//               value:
//                 status: "COMPLETED"
//             toCancelled:
//               summary: Cancelar orden
//               value:
//                 status: "CANCELLED"
//     responses:
//       '200':
//         description: Estado actualizado exitosamente
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ServiceOrder'
//       '400':
//         description: Transición inválida o status no proporcionado
//         content:
//           application/json:
//             schema:
//               type: object
//               properties:
//                 message:
//                   type: string
//                   example: "Transición inválida: no se permite COMPLETED -> IN_PROGRESS"
//       '404':
//         description: Orden no encontrada
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.patch('/:id/status', controller.updateStatus);

// ============================================
// @swagger
// /api/service-orders/{id}:
//   put:
//     summary: Actualizar orden de servicio completa
//     description: |
//       Actualiza uno o más campos de una orden de servicio existente.
//       Puede actualizar título, descripción, estado y otros campos.
//       
//       **Nota:** Para actualizar solo el estado, use el endpoint PATCH /api/service-orders/{id}/status
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: id
//         in: path
//         required: true
//         description: MongoDB ObjectId de la orden
//         schema:
//           type: string
//           format: uuid
//           example: "507f1f77bcf86cd799439011"
//     requestBody:
//       required: true
//       content:
//         application/json:
//           schema:
//             $ref: '#/components/schemas/UpdateServiceOrderRequest'
//           examples:
//             updateTitle:
//               summary: Actualizar título
//               value:
//                 title: "Nuevo título de orden"
//             updateDescription:
//               summary: Actualizar descripción
//               value:
//                 description: "Nueva descripción detallada"
//             updateMultiple:
//               summary: Actualizar múltiples campos
//               value:
//                 title: "Título actualizado"
//                 description: "Descripción actualizada"
//                 status: "IN_PROGRESS"
//     responses:
//       '200':
//         description: Orden actualizada exitosamente
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ServiceOrder'
//       '404':
//         description: Orden no encontrada
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '400':
//         description: Datos inválidos
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.put('/:id', controller.update);

// ============================================
// @swagger
// /api/service-orders/{id}:
//   delete:
//     summary: Eliminar orden de servicio
//     description: |
//       Elimina permanentemente una orden de servicio de la base de datos.
//       Esta acción no se puede deshacer.
//       
//       **Recomendación:** Considere usar PATCH para cambiar estado a CANCELLED 
//       en lugar de eliminar, para mantener auditoría.
//     tags:
//       - Service Orders
//     security:
//       - bearerAuth: []
//     parameters:
//       - name: id
//         in: path
//         required: true
//         description: MongoDB ObjectId de la orden
//         schema:
//           type: string
//           format: uuid
//           example: "507f1f77bcf86cd799439011"
//     responses:
//       '204':
//         description: Orden eliminada exitosamente (sin contenido)
//       '404':
//         description: Orden no encontrada
//         content:
//           application/json:
//             schema:
//               $ref: '#/components/schemas/ErrorResponse'
//       '401':
//         description: No autorizado - Token JWT inválido o expirado
// ============================================
router.delete('/:id', controller.remove);

module.exports = router;


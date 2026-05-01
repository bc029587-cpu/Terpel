'use strict';

/**
 * CAPA: Configuration (Swagger/OpenAPI)
 * ARCHIVO: swagger.js
 * DESCRIPCIÓN: Configuración de Swagger UI para documentación interactiva de API
 * USO: Genera interfaz visual en /api-docs para probar endpoints
 * HERRAMIENTA: swagger-jsdoc analiza comentarios @swagger en rutas y genera spec OpenAPI 3.0.0
 */

const swaggerJsdoc = require('swagger-jsdoc');

/**
 * CONFIGURACIÓN: Definición de especificación OpenAPI
 * DESCRIPCIÓN: Parámetros que definen la API en Swagger
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Terpel API - Gestión de Órdenes de Servicio',
      version: '1.0.0',
      description: 'API RESTful para la gestión centralizada de órdenes de servicio en estaciones Terpel',
      contact: {
        name: 'José Reyesco',
        email: 'jose.reyesco@adecco.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:4201',
        description: 'Servidor local de desarrollo'
      },
      {
        url: 'https://api.terpel.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint /api/auth/login. Formato: Authorization: Bearer {token}'
        }
      },
      schemas: {
        ServiceOrder: {
          type: 'object',
          required: ['stationId', 'title', 'createdBy'],
          properties: {
            _id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único de la orden de servicio (MongoDB ObjectId)'
            },
            stationId: {
              type: 'string',
              description: 'Identificador único de la estación Terpel asociada',
              example: 'STATION-001'
            },
            title: {
              type: 'string',
              description: 'Título descriptivo de la orden de servicio',
              example: 'Mantenimiento de dispensadores'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada de la orden (opcional)',
              example: 'Revisión y limpieza de dispensadores de gasolina'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              default: 'PENDING',
              description: 'Estado actual de la orden'
            },
            createdBy: {
              type: 'object',
              description: 'Información del usuario que creó la orden',
              properties: {
                _id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID del usuario'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'Email del usuario creador'
                },
                role: {
                  type: 'string',
                  description: 'Rol del usuario'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de creación (ISO 8601)'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp de última actualización (ISO 8601)'
            }
          }
        },
        CreateServiceOrderRequest: {
          type: 'object',
          required: ['stationId', 'title'],
          properties: {
            stationId: {
              type: 'string',
              description: 'Identificador único de la estación',
              example: 'STATION-001'
            },
            title: {
              type: 'string',
              description: 'Título de la orden de servicio',
              example: 'Mantenimiento preventivo'
            },
            description: {
              type: 'string',
              description: 'Descripción detallada (opcional)',
              example: 'Cambio de aceite y filtros'
            }
          }
        },
        UpdateStatusRequest: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              description: 'Nuevo estado de la orden'
            }
          }
        },
        UpdateServiceOrderRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Nuevo título'
            },
            description: {
              type: 'string',
              description: 'Nueva descripción'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
              description: 'Nuevo estado'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Cantidad total de órdenes'
            },
            page: {
              type: 'integer',
              description: 'Número de página actual'
            },
            limit: {
              type: 'integer',
              description: 'Cantidad de registros por página'
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ServiceOrder'
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error descriptivo'
            },
            statusCode: {
              type: 'integer',
              description: 'Código HTTP del error'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp del error'
            }
          }
        }
      }
    }
  },
  apis: ['./modules/service-order/service-order.routes.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;

# 🏗️ Terpel API - Service Orders Management

API REST para la gestión centralizada de órdenes de servicio en estaciones Terpel.

## 📋 Características

- ✅ **Gestión de órdenes de servicio** (CRUD completo)
- ✅ **Autenticación segura** con JWT
- ✅ **Control de estados** con máquina de transiciones
- ✅ **API documentada** con Swagger/OpenAPI
- ✅ **Tests automatizados** (unitarios e integración)
- ✅ **Base de datos MongoDB** con Mongoose
- ✅ **Configuración centralizada** de variables de entorno

## 🚀 Quick Start

### Requisitos previos

- Node.js 18+
- MongoDB 5.0+
- npm o yarn

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/terpel-api.git
cd terpel-api

# 2. Instalar dependencias
npm install

# 3. Crear archivo de configuración
cp .env.example .env.local

# 4. Editar .env.local con tus valores
nano .env.local

# 5. Iniciar el servidor
npm start
```

El servidor ejecutará en `http://localhost:4201`

## 📖 Documentación

### Endpoints principales

**Base URL**: `/api`

#### Autenticación
- `POST /auth/login` - Login de usuario
- `POST /auth/register` - Registrar nuevo usuario

#### Órdenes de servicio
- `GET /service-orders` - Listar todas las órdenes
- `GET /service-orders/search?stationId=...&status=...` - Búsqueda con filtros
- `GET /service-orders/:id` - Obtener orden específica
- `POST /service-orders` - Crear nueva orden
- `PUT /service-orders/:id` - Actualizar orden
- `PATCH /service-orders/:id/status` - Cambiar estado de la orden
- `DELETE /service-orders/:id` - Eliminar orden

#### Usuarios
- `GET /users` - Listar usuarios (admin)
- `GET /users/:id` - Obtener usuario específico

### API Docs Interactivo

Accede a la documentación interactiva en:
```
http://localhost:4201/api-docs
```

## 🔐 Variables de Entorno

Ver [ENV-GUIDE.md](ENV-GUIDE.md) para la documentación completa.

Variables requeridas:
```bash
NODE_ENV=development
PORT=4201
MONGO_URI=mongodb://127.0.0.1:27017/terpel
JWT_SECRET=your-secret-key-here
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test:watch

# Generar reporte de coverage
npm test:coverage
```

## 📁 Estructura del Proyecto

```
Terpel/
├── server.js                      # Punto de entrada
├── app.js                         # Configuración Express
├── config/
│   ├── index.js                   # Configuración centralizada
│   └── swagger.js                 # Documentación OpenAPI
├── middlewares/
│   ├── auth.middleware.js         # Validación JWT
│   ├── error.middleware.js        # Manejo de errores
│   ├── admin.middleware.js        # Verificación de admin
│   └── request-id.middleware.js   # Tracking de requests
├── modules/
│   ├── auth/                      # Módulo de autenticación
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   └── auth.routes.js
│   ├── service-order/             # Módulo de órdenes (Core)
│   │   ├── service-order.controller.js
│   │   ├── service-order.service.js
│   │   ├── service-order.model.js
│   │   ├── service-order.repository.js
│   │   ├── service-order.routes.js
│   │   ├── service-order.facade.js
│   │   └── service-order.enums.js
│   └── users/                     # Módulo de usuarios
│       ├── user.controller.js
│       ├── user.service.js
│       ├── user.model.js
│       └── user.routes.js
├── tests/
│   ├── unit/                      # Tests unitarios
│   └── integration/               # Tests de integración
├── utils/
│   └── custom-error.js            # Clase de errores personalizado
└── scripts/
    └── create-admin.js            # Script para crear admin
```

## 🔄 Flujo de Órdenes de Servicio

```
PENDING
  ├─→ IN_PROGRESS
  │    ├─→ COMPLETED
  │    └─→ CANCELLED
  └─→ CANCELLED
```

**Reglas de transición**:
- ✅ Pueden cambiar de PENDING a cualquier estado
- ✅ Pueden cambiar de IN_PROGRESS a COMPLETED o CANCELLED
- ❌ No pueden retroceder (ej: COMPLETED → IN_PROGRESS)
- ❌ Una orden CANCELLED no puede cambiar

## 🔑 Autenticación

El API usa **JWT (JSON Web Tokens)** para autenticación:

```bash
# 1. Login para obtener token
curl -X POST http://localhost:4201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'

# Respuesta:
# {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# 2. Usar token en requests
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📊 Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 5.2.1 | Framework HTTP |
| MongoDB | 5.0+ | Base de datos |
| Mongoose | 9.2.1 | ODM |
| JWT | 9.0.3 | Autenticación |
| bcryptjs | 3.0.3 | Hashing de contraseñas |
| Swagger | 6.2.8 | Documentación |
| Jest | 29.7.0 | Testing |

## 🚀 Deployment

### Producción

1. Crear `.env.production` en el servidor con credenciales reales
2. Configurar JWT_SECRET seguro
3. Configurar MongoDB Atlas (o similar)
4. Configurar CORS con dominios reales

```bash
NODE_ENV=production npm start
```

## 📝 Scripts Útiles

```bash
# Crear usuario admin
node scripts/create-admin.js

# Ejecutar servidor en desarrollo con auto-reload
npm run dev
```

## 🐛 Troubleshooting

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
# En Windows:
mongod

# En Linux/Mac:
brew services start mongodb-community
```

### Token expirado

JWT tokens expiran después de 1 hora (configurable en .env)

```bash
JWT_EXPIRATION=24h  # Extender a 24 horas
```

### Puerto 4201 ocupado

```bash
# Cambiar puerto
PORT=5000 npm start
```

## 📄 Licencia

ISC © 2026 Terpel

## 👥 Contribuciones

Para reportar bugs o sugerir features, abir un issue o pull request.

## 📞 Contacto

- **Autor**: Jose Reyesco
- **Email**: jose.reyesco@adecco.com
- **Proyecto**: Terpel - Gestión de órdenes de servicio

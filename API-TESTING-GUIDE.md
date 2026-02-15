# 🧪 Guía de Testing - API Terpel

## 📌 Configuración Inicial

```bash
# Instalar dependencias
npm install

# Arrancar servidor
npm start
```

**Puerto:** `http://localhost:4201`  
**BD:** MongoDB (local o remoto según `.env`)

---

## 🔑 Paso 1: Obtener Token (Login)

### REQUEST
```bash
curl -X POST http://localhost:4201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@terpel.com",
    "password": "admin123"
  }'
```

### RESPONSE
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Guardar el token para los siguientes requests**

---

## 🧬 Endpoints Disponibles

### 1️⃣ **Health Check** (SIN AUTENTICACIÓN)
```bash
curl -X GET http://localhost:4201/health
```

---

### 2️⃣ **Listar Órdenes de Servicio**
```bash
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

### 3️⃣ **Crear Nueva Orden**
```bash
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "stationId": "ESTACION_001",
    "type": "INVOICE",
    "description": "Factura de combustible",
    "status": "CREATED"
  }'
```

**Tipos válidos:** `INVOICE`, `SUPPORT`, `REDEMPTION`  
**Estados válidos:** `CREATED`, `IN_PROGRESS`, `DONE`, `CANCELLED`

---

### 4️⃣ **Obtener Orden por ID**
```bash
curl -X GET http://localhost:4201/api/service-orders/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

### 5️⃣ **Actualizar Estado de Orden**
```bash
curl -X PUT http://localhost:4201/api/service-orders/ID_AQUI/status \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

---

### 6️⃣ **Verificar Token Actual**
```bash
curl -X GET http://localhost:4201/api/auth/me \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 📊 Estructura de Carpetas

```
Terpel/
├── app.js                          ← Configuración de Express
├── server.js                       ← Punto de entrada
├── package.json
├── config/
│   ├── env.js                     ← Variables de entorno
│   └── logger.js                  ← Sistema de logs
├── middlewares/
│   ├── auth.middleware.js         ← Validación JWT
│   ├── error.middleware.js        ← Manejo de errores
│   └── request-id.middleware.js   ← ID único por request
├── modules/
│   ├── auth/                      ← Autenticación
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── auth.service.js
│   ├── service-order/             ← Órdenes de servicio
│   │   ├── service-order.controller.js
│   │   ├── service-order.facade.js
│   │   ├── service-order.model.js
│   │   ├── service-order.repository.js
│   │   ├── service-order.routes.js
│   │   ├── service-order.service.js
│   │   └── service-order.enums.js
│   └── users/                     ← Gestión de usuarios
│       ├── user.model.js
│       └── user.service.js
├── health/                        ← Health check
│   └── health.controller.js
├── utils/
│   └── custom-error.js
├── scripts/
│   └── create-admin.js            ← Script para crear admin
└── tests/
    ├── integration/
    └── unit/
```

---

## 🔧 Recomendaciones de Mejora

### ✅ Completado
- ✓ Rutas de service-order registradas en app.js
- ✓ Ruta PUT para actualizar status agregada

### 📝 Pendiente
- [ ] Agregar validación de inputs (Joi o Yup)
- [ ] Completar métodos en controller (solo tiene create y updateStatus)
- [ ] Implementar paginación en getAll
- [ ] Agregar tests unitarios e integración
- [ ] Documentar con Swagger/OpenAPI
- [ ] Logs más detallados
- [ ] Rate limiting
- [ ] Validar role del usuario para ciertas acciones

---

## 🚀 Próximos Pasos

1. **Crear un usuario admin:**
   ```bash
   node scripts/create-admin.js
   ```

2. **Usar Postman o Insomnia** para testing más fácil
   - Importar colección de endpoints
   - Guardar variables (token, baseURL)

3. **Implementar métodos faltantes** en service-order.controller.js

---

## ⚠️ Variables de Entorno Necesarias

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=4201
MONGO_URI=mongodb://127.0.0.1:27017/terpel
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```


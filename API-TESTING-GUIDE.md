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

## 🔑 Paso 1: Obtener Token (Login/Register)

### OPCIÓN A: LOGIN (Usuario existente)
```bash
curl -X POST http://localhost:4201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@terpel.com",
    "password": "123456"
  }'
```

### OPCIÓN B: REGISTRARSE (Nuevo usuario)
```bash
curl -X POST http://localhost:4201/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456",
    "name": "Tu Nombre"
  }'
```

### RESPONSE (ambos)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Guardar el token para los siguientes requests**

---

## 🧬 ENDPOINTS POR MÓDULO

### 🔓 PÚBLICOS (Sin autenticación)

- `GET /health` - Health check

---

### 🔐 AUTENTICACIÓN (Privados)

#### 1. Login
```bash
curl -X POST http://localhost:4201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@terpel.com","password":"123456"}'
```

#### 2. Registrarse
```bash
curl -X POST http://localhost:4201/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@ejemplo.com",
    "password":"123456",
    "name":"Nuevo Usuario"
  }'
```

#### 3. Verificar Usuario Actual
```bash
curl -X GET http://localhost:4201/api/auth/me \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

### 👥 USUARIOS (Privados)

#### 1. Listar Todos los Usuarios
```bash
curl -X GET http://localhost:4201/api/users \
  -H "Authorization: Bearer TOKEN_AQUI"
```

#### 2. Obtener Usuario por ID
```bash
curl -X GET http://localhost:4201/api/users/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```

#### 3. Actualizar Usuario
```bash
curl -X PUT http://localhost:4201/api/users/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Nombre",
    "email": "nuevoemail@ejemplo.com"
  }'
```

#### 4. Cambiar Contraseña
```bash
curl -X POST http://localhost:4201/api/users/change-password \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "123456",
    "newPassword": "nuevacontraseña123"
  }'
```

#### 5. Eliminar Usuario
```bash
curl -X DELETE http://localhost:4201/api/users/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```
**Nota:** Soft delete (marca como inactivo)

---

### 📦 ÓRDENES DE SERVICIO (Privados)

#### 1. Listar Todas las Órdenes
```bash
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN_AQUI"
```

#### 2. Crear Nueva Orden
```bash
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Orden de Servicio #001",
    "description": "Mantenimiento de estación",
    "status": "PENDING"
  }'
```

**Estados válidos:** `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

#### 3. Obtener Orden por ID
```bash
curl -X GET http://localhost:4201/api/service-orders/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```

#### 4. Actualizar Estado de Orden
```bash
curl -X PUT http://localhost:4201/api/service-orders/ID_AQUI/status \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

#### 5. Actualizar Orden Completa
```bash
curl -X PUT http://localhost:4201/api/service-orders/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nuevo Título",
    "description": "Nueva descripción",
    "status": "PENDING"
  }'
```

#### 6. Eliminar Orden
```bash
curl -X DELETE http://localhost:4201/api/service-orders/ID_AQUI \
  -H "Authorization: Bearer TOKEN_AQUI"
```

---

## 📊 Estructura de Carpetas

```
Terpel/
├── app.js                                ← Configuración Express
├── server.js                             ← Punto de entrada
├── package.json
├── config/
│   ├── env.js
│   └── logger.js
├── middlewares/
│   ├── auth.middleware.js              ← JWT validation
│   ├── admin.middleware.js             ← ADMIN only
│   ├── error.middleware.js
│   └── request-id.middleware.js
├── modules/
│   ├── auth/                           ← Login/Register
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── auth.service.js
│   ├── users/                          ← Gestión de usuarios
│   │   ├── user.controller.js          ✨ NUEVO
│   │   ├── user.routes.js              ✨ NUEVO
│   │   ├── user.model.js
│   │   └── user.service.js
│   └── service-order/                  ← Órdenes de servicio
│       ├── service-order.controller.js (✏️ Actualizado)
│       ├── service-order.routes.js     (✏️ Actualizado)
│       ├── service-order.service.js    (✏️ Actualizado)
│       ├── service-order.facade.js
│       ├── service-order.model.js
│       ├── service-order.repository.js
│       └── service-order.enums.js
├── utils/
│   └── custom-error.js
├── scripts/
│   └── create-admin.js
└── tests/
    ├── integration/
    └── unit/
```

---

## 🔑 Crear Usuario ADMIN

```bash
node scripts/create-admin.js
```

**Credenciales creadas:**
- Email: `admin@terpel.com`
- Password: `123456`

---

## 📝 Resumen de Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /health | Health check | ❌ |
| POST | /api/auth/login | Login | ❌ |
| POST | /api/auth/register | Registrarse | ❌ |
| GET | /api/auth/me | Usuario actual | ✅ |
| GET | /api/users | Listar usuarios | ✅ |
| GET | /api/users/:id | Obtener usuario | ✅ |
| PUT | /api/users/:id | Actualizar usuario | ✅ |
| DELETE | /api/users/:id | Eliminar usuario | ✅ |
| POST | /api/users/change-password | Cambiar contraseña | ✅ |
| GET | /api/service-orders | Listar órdenes | ✅ |
| POST | /api/service-orders | Crear orden | ✅ |
| GET | /api/service-orders/:id | Obtener orden | ✅ |
| PUT | /api/service-orders/:id/status | Actualizar estado | ✅ |
| PUT | /api/service-orders/:id | Actualizar orden | ✅ |
| DELETE | /api/service-orders/:id | Eliminar orden | ✅ |

---

## ⚙️ Variables de Entorno

Crear `.env` en raíz:

```env
PORT=4201
MONGO_URI=mongodb://127.0.0.1:27017/terpel
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

---

## 🚀 Testing con Herramientas

### Postman
- Importar `postman-collection.json`
- Establecer variables: `baseUrl`, `token`

### Insomnia
- Importar colección
- Configurar workspace

### cURL
- Usar ejemplos de arriba

---

## 📌 Notas Importantes

1. **Tokens JWT**: Expiran en 1 hora
2. **Soft Delete**: Los usuarios no se eliminan, se marcan como inactivos
3. **Contraseñas**: Se hashean con bcryptjs antes de almacenarlas
4. **CORS**: Permitido para todos los orígenes (cambiar en producción)
5. **Roles**: ADMIN y USER (se asignan al crear el usuario)




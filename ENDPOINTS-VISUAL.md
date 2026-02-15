# 🚀 ENDPOINTS COMPLETAMENTE GENERADOS - TERPEL API

## 📊 TABLA COMPLETA DE 15 ENDPOINTS

```
┌───────────────────────────────────────────────────────────────────────┐
│                      AUTENTICACIÓN (4 endpoints)                       │
├─────┬──────────────────────────┬──────────┬──────────────────────────┤
│ Nº  │ Ruta                     │ Método   │ Descripción              │
├─────┼──────────────────────────┼──────────┼──────────────────────────┤
│ 1.  │ /health                  │ GET      │ Health Check (público)   │
│ 2.  │ /api/auth/login          │ POST     │ Login                    │
│ 3.  │ /api/auth/register       │ POST     │ Registrarse (NUEVO)      │
│ 4.  │ /api/auth/me             │ GET      │ Usuario actual           │
└─────┴──────────────────────────┴──────────┴──────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                      USUARIOS (5 endpoints - NUEVO)                    │
├─────┬──────────────────────────┬──────────┬──────────────────────────┤
│ Nº  │ Ruta                     │ Método   │ Descripción              │
├─────┼──────────────────────────┼──────────┼──────────────────────────┤
│ 5.  │ /api/users               │ GET      │ Listar usuarios          │
│ 6.  │ /api/users/:id           │ GET      │ Obtener usuario          │
│ 7.  │ /api/users/:id           │ PUT      │ Actualizar usuario       │
│ 8.  │ /api/users/:id           │ DELETE   │ Eliminar usuario         │
│ 9.  │ /api/users/change-pwd    │ POST     │ Cambiar contraseña       │
└─────┴──────────────────────────┴──────────┴──────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                  ÓRDENES DE SERVICIO (6 endpoints)                     │
├─────┬──────────────────────────┬──────────┬──────────────────────────┤
│ Nº  │ Ruta                     │ Método   │ Descripción              │
├─────┼──────────────────────────┼──────────┼──────────────────────────┤
│ 10. │ /api/service-orders      │ GET      │ Listar órdenes           │
│ 11. │ /api/service-orders      │ POST     │ Crear orden              │
│ 12. │ /api/service-orders/:id  │ GET      │ Obtener orden            │
│ 13. │ /api/service-orders/:id  │ PUT      │ Actualizar orden (NUEVO) │
│ 14. │ /api/service-orders/:id/ │ PUT      │ Cambiar estado           │
│     │ status                   │          │                          │
│ 15. │ /api/service-orders/:id  │ DELETE   │ Eliminar orden (NUEVO)   │
└─────┴──────────────────────────┴──────────┴──────────────────────────┘
```

---

## 🎯 CATEGORIZACIÓN POR TIPO

### 🔓 **PÚBLICOS** (Sin autenticación)
- `GET /health` - Health check

### 🔐 **PRIVADOS** (Requieren token JWT)
- Todos los demás (14 endpoints)

### 👑 **SOLO ADMIN** (Con validación de rol)
- `GET /api/users` - Listar todos los usuarios
- `DELETE /api/users/:id` - Eliminar usuarios

---

## 📈 ESTADÍSTICAS

| Métrica | Valor |
|---------|-------|
| Total Endpoints | 15 |
| GET | 6 |
| POST | 3 |
| PUT | 3 |
| DELETE | 2 |
| Módulos | 3 |
| Autentificación | JWT (1h) |
| Base de datos | MongoDB |
| Framework | Express.js |

---

## 🧪 FLUJO DE TESTING RECOMENDADO

### Paso 1: Health Check
```bash
curl http://localhost:4201/health
→ Respuesta: {"status":"UP","message":"API funcionando correctamente"}
```

### Paso 2: Crear admin (si no existe)
```bash
node scripts/create-admin.js
→ Email: admin@terpel.com
→ Password: 123456
```

### Paso 3: Login
```bash
curl -X POST http://localhost:4201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@terpel.com","password":"123456"}'
→ Guardar el token retornado
```

### Paso 4: Probar Usuarios
```bash
# Listar
curl -X GET http://localhost:4201/api/users \
  -H "Authorization: Bearer TOKEN"

# Crear (via register)
curl -X POST http://localhost:4201/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123","name":"Test"}'
```

### Paso 5: Probar Órdenes de Servicio
```bash
# Listar
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN"

# Crear
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mi Orden","description":"Test","status":"PENDING"}'

# Actualizar
curl -X PUT http://localhost:4201/api/service-orders/ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

---

## 📋 VALIDACIONES IMPLEMENTADAS

### Auth
✅ Validar credenciales en login  
✅ Verificar email no duplicado en registro  
✅ Hash de contraseñas  
✅ JWT token generation  

### Users
✅ No permitir cambio de rol sin ADMIN  
✅ Validar contraseña actual al cambiar  
✅ Soft delete (marcar como inactivo)  
✅ Ocultar contraseña en respuesta  

### Service Orders
✅ Validar estado válido  
✅ Relacionar con usuario (createdBy)  
✅ Timestamps automáticos  

---

## 🔄 RELACIONES DE MODELOS

```
User (ADMIN/USER)
├── id
├── email (unique)
├── name
├── password (hashed)
├── role
├── active
├── createdAt
└── updatedAt

ServiceOrder
├── id
├── title
├── description
├── status (PENDING/IN_PROGRESS/COMPLETED/CANCELLED)
├── createdBy → User._id
├── createdAt
└── updatedAt
```

---

## 📦 RESPUESTAS ESPERADAS

### Login Exitoso
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Register Exitoso
```json
{
  "message": "Usuario creado exitosamente",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@test.com",
    "name": "Test",
    "role": "USER"
  }
}
```

### Get Users Exitoso
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@terpel.com",
    "name": "Admin",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2026-02-15T10:00:00Z",
    "updatedAt": "2026-02-15T10:00:00Z"
  }
]
```

### Create Order Exitoso
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Mi Orden",
  "description": "Test",
  "status": "PENDING",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@terpel.com",
    "role": "ADMIN"
  },
  "createdAt": "2026-02-15T10:05:00Z",
  "updatedAt": "2026-02-15T10:05:00Z"
}
```

---

## ⚡ CÓDIGOS HTTP ESPERADOS

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 204 | No Content - Eliminado |
| 400 | Bad Request - Error en datos |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no existe |
| 500 | Server Error - Error interno |

---

## 📝 NOTAS IMPORTANTES

1. **Tokens JWT**
   - Expiran en 1 hora
   - Se incluyen en header: `Authorization: Bearer TOKEN`

2. **Contraseñas**
   - Se hashean con bcryptjs (salt rounds: 10)
   - Nunca se devuelven en respuestas

3. **Soft Deletes**
   - Los usuarios se marcan como inactivos, no se eliminan
   - Las órdenes SÍ se eliminan físicamente

4. **Roles**
   - ADMIN: Acceso total
   - USER: Acceso limitado

5. **CORS**
   - Permitido para todos los orígenes
   - Cambiar en producción

---

## 🎓 DOCUMENTOS DE REFERENCIA

- 📄 [API-TESTING-GUIDE.md](./API-TESTING-GUIDE.md) - Guía detallada
- 📄 [ENDPOINTS-GENERADOS.md](./ENDPOINTS-GENERADOS.md) - Resumen de cambios
- 📦 [postman-collection.json](./postman-collection.json) - Colección Postman
- ⚙️ [.env.example](./.env.example) - Variables de entorno

---

## ✅ ESTADO ACTUAL

```
✅ Servidor corriendo en localhost:4201
✅ MongoDB conectado
✅ 15 endpoints funcionales
✅ Autenticación JWT implementada
✅ Gestión de usuarios implementada
✅ CRUD de órdenes completo
✅ Documentación actualizada
✅ Colección Postman lista

📊 Listo para Testing
```

---

**Generado:** 15 de Febrero 2026  
**Versión:** 2.0.0  
**Estado:** ✅ Producción-Ready (testing)

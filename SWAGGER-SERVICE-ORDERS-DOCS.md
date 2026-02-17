# DOCUMENTACIÓN SWAGGER - SERVICE ORDERS API

## 📋 Resumen Ejecutivo

Se ha implementado documentación OpenAPI 3.0 completa y profesional para todos los endpoints del módulo **Service Orders** utilizando **Swagger JSDoc** y **Swagger UI Express**.

La documentación está disponible en: `http://localhost:4201/api-docs`

---

## 🔐 Autenticación Requerida

**Todos los endpoints de Service Orders requieren autenticación JWT.**

### Cómo obtener el token:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "tu_password"
}
```

### Usar el token en las solicitudes:
Agregar el header:
```
Authorization: Bearer {tu_token_jwt}
```

---

## 📊 Endpoints Documentados

### 1. **Crear Orden de Servicio**
```
POST /api/service-orders
```
- **Descripción**: Crea una nueva orden de servicio
- **Estado inicial**: PENDING (automático)
- **Usuario creador**: Se establece automáticamente del JWT
- **Validaciones**:
  - `stationId` requerido
  - `title` requerido
  - `description` opcional
- **Respuesta**: 201 Created

**Ejemplo de solicitud:**
```json
{
  "stationId": "STATION-001",
  "title": "Mantenimiento de dispensadores",
  "description": "Revisión y limpieza de dispensadores de gasolina"
}
```

---

### 2. **Listar Todas las Órdenes**
```
GET /api/service-orders
```
- **Parámetros opcionales**:
  - `page=1` - Número de página
  - `limit=20` - Registros por página
- **Ordenamiento**: Por fecha de creación descendente (más recientes primero)
- **Respuesta**: 200 OK

**Con paginación:**
```
GET /api/service-orders?page=1&limit=10
```

**Respuesta:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

---

### 3. **Buscar con Filtros**
```
GET /api/service-orders/search/filters
```
- **Parámetros requeridos** (al menos uno):
  - `stationId=STATION-001` - Filtra por estación
  - `status=IN_PROGRESS` - Filtra por estado
  - `stationId=STATION-001&status=PENDING` - Combinación de filtros
- **Estados válidos**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- **Respuesta**: 200 OK

**Ejemplos:**
```
GET /api/service-orders/search/filters?stationId=STATION-001
GET /api/service-orders/search/filters?status=IN_PROGRESS
GET /api/service-orders/search/filters?stationId=STATION-001&status=PENDING
```

---

### 4. **Obtener Orden por ID**
```
GET /api/service-orders/{id}
```
- **Parámetro**: MongoDB ObjectId de la orden
- **Incluye**: Información del usuario creador
- **Respuesta**: 200 OK o 404 Not Found

**Ejemplo:**
```
GET /api/service-orders/507f1f77bcf86cd799439011
```

---

### 5. **Actualizar Estado de la Orden** ⭐
```
PATCH /api/service-orders/{id}/status
```
- **Recomendado** para cambios de estado
- **Validaciones de transición**:
  - No se permite: CANCELLED → cualquier estado (orden bloqueada)
  - No se permite: COMPLETED → IN_PROGRESS (retroceso inválido)
  - Permitidas: Todas las otras transiciones

**Estados válidos:**
- `PENDING` - Pendiente
- `IN_PROGRESS` - En progreso
- `COMPLETED` - Completada
- `CANCELLED` - Cancelada

**Ejemplo de solicitud:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Flujo típico recomendado:**
```
PENDING → IN_PROGRESS → COMPLETED
  ↓
CANCELLED (en cualquier momento)
```

---

### 6. **Actualizar Orden Completa**
```
PUT /api/service-orders/{id}
```
- **Descripción**: Actualiza uno o más campos
- **Campos actualizables**: `title`, `description`, `status`
- **Respuesta**: 200 OK
- **Nota**: Para solo actualizar estado, use PATCH

**Ejemplo:**
```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción",
  "status": "IN_PROGRESS"
}
```

---

### 7. **Eliminar Orden de Servicio**
```
DELETE /api/service-orders/{id}
```
- **Acción**: Elimina permanentemente el registro
- **No recuperable**: No se puede deshacer
- **Respuesta**: 204 No Content
- **Recomendación**: Considere usar estado CANCELLED en lugar de eliminar

---

## 🚨 Códigos de Error

| Código | Descripción | Causa |
|--------|-------------|-------|
| **400** | Bad Request | Datos inválidos, validaciones fallidas |
| **401** | Unauthorized | Token JWT ausente, expirado o inválido |
| **404** | Not Found | Recurso no existe, no hay resultados |
| **500** | Server Error | Error interno del servidor |

### Errores Específicos de Service Orders:

```json
{
  "message": "Debe proporcionar al menos un filtro: stationId o status",
  "statusCode": 400
}
```

```json
{
  "message": "Status inválido. Valores permitidos: PENDING, IN_PROGRESS, COMPLETED, CANCELLED",
  "statusCode": 400
}
```

```json
{
  "message": "Transición inválida: no se permite COMPLETED -> IN_PROGRESS",
  "statusCode": 400
}
```

```json
{
  "message": "No se pueden realizar cambios: la orden está CANCELLED",
  "statusCode": 400
}
```

---

## 🔗 CORS Configuration

La API soporta CORS con los siguientes métodos permitidos:
- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`

Headers permitidos:
- `Authorization`
- `Content-Type`

---

## 🧪 Testing con cURL

### Crear orden:
```bash
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"stationId":"STATION-001","title":"Test"}'
```

### Listar órdenes:
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  http://localhost:4201/api/service-orders
```

### Buscar con filtros:
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  "http://localhost:4201/api/service-orders/search/filters?stationId=STATION-001&status=PENDING"
```

### Actualizar estado:
```bash
curl -X PATCH http://localhost:4201/api/service-orders/{ID}/status \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
```

### Eliminar:
```bash
curl -X DELETE http://localhost:4201/api/service-orders/{ID} \
  -H "Authorization: Bearer {TOKEN}"
```

---

## 📁 Estructura de Archivos

```
config/
├── swagger.js              # Configuración OpenAPI 3.0 y esquemas
modules/service-order/
├── service-order.routes.js # Documentación JSDoc de endpoints
├── service-order.controller.js
├── service-order.service.js
├── service-order.model.js
└── service-order.repository.js
```

---

## 🎯 Características Implementadas

✅ **OpenAPI 3.0** - Especificación completa con esquemas JSON  
✅ **JWT Bearer Auth** - Seguridad requerida en todos los endpoints  
✅ **Descripciones detalladas** - Cada endpoint bien documentado  
✅ **Ejemplos prácticos** - Solicitudes y respuestas de ejemplo  
✅ **Validaciones documentadas** - Reglas de negocio claramente expuestas  
✅ **Swagger UI interactivo** - Prueba endpoints directamente  
✅ **Esquemas reutilizables** - DRY principles aplicados  
✅ **Manejo de errores** - Respuestas de error documentadas  
✅ **CORS configurado** - Soporta PATCH y otros métodos  

---

## 🔧 Acceso a la Documentación

**URL Local:**
```
http://localhost:4201/api-docs
```

**Funcionalidades de Swagger UI:**
- ✓ Ver todos los endpoints
- ✓ Probar endpoints en tiempo real
- ✓ Ver esquemas de solicitud/respuesta
- ✓ Copiar ejemplos cURL
- ✓ Descargar especificación OpenAPI

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints requieren token JWT válido
2. **Paginación**: Sin parámetros `page` y `limit`, retorna todos los registros
3. **Filtros**: Al menos uno requerido en `/search/filters`
4. **Estados**: Validación estricta, solo valores enum permitidos
5. **Transiciones**: Hay restricciones en los cambios de estado
6. **Soft Delete**: Considere usar CANCELLED en lugar de DELETE
7. **Auditoría**: Cada orden mantiene registro del usuario creador y timestamps

---

## 📞 Soporte

Para reportar errores o sugerencias, contacte al equipo de desarrollo.

**Autor:** José Reyesco  
**Empresa:** Adecco - Proyecto Terpel  
**Versión API:** 1.0.0  
**Última actualización:** Febrero 2026

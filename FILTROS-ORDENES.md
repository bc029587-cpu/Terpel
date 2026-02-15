# 🔍 FILTROS DE ÓRDENES DE SERVICIO

## 📌 Endpoint Implementado

### GET /api/service-orders (con filtros)

**Autenticación:** ✅ Requerida (JWT)  
**Método:** GET  
**URL Base:** `http://localhost:4201`

---

## 📝 Parámetros de Query

| Parámetro | Tipo | Obligatorio | Descripción |
|-----------|------|------------|-------------|
| `stationId` | string | ❌ No | ID de la estación para filtrar |
| `status` | string | ❌ No | Estado de la orden (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) |

**Nota:** Ambos parámetros son opcionales. Puedes usar uno, otro, ambos o ninguno.

---

## 🧪 EJEMPLOS DE TESTING

### 1️⃣ Listar todas las órdenes (SIN filtros)
```bash
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "total": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Mi Primera Orden",
      "description": "Descripción de prueba",
      "status": "PENDING",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "email": "admin@terpel.com",
        "role": "ADMIN"
      },
      "createdAt": "2026-02-15T10:00:00Z",
      "updatedAt": "2026-02-15T10:00:00Z"
    }
  ]
}
```

---

### 2️⃣ Filtrar por stationId
```bash
curl -X GET "http://localhost:4201/api/service-orders?stationId=EST_001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "total": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Orden de mantenimiento",
      "status": "IN_PROGRESS",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "stationId": "EST_001",
      "title": "Orden de revisión",
      "status": "COMPLETED",
      ...
    }
  ]
}
```

**Respuesta cuando NO se encuentran órdenes (404):**
```json
{
  "message": "No se encontraron órdenes para la estación \"EST_999\".",
  "data": []
}
```

---

### 3️⃣ Filtrar por status
```bash
curl -X GET "http://localhost:4201/api/service-orders?status=PENDING" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "total": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Tarea pendiente 1",
      "status": "PENDING",
      ...
    }
  ]
}
```

**Respuesta cuando NO se encuentran órdenes (404):**
```json
{
  "message": "No se encontraron órdenes con estado \"COMPLETED\".",
  "data": []
}
```

---

### 4️⃣ Filtrar por stationId Y status (COMBINADO)
```bash
curl -X GET "http://localhost:4201/api/service-orders?stationId=EST_001&status=IN_PROGRESS" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "total": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Orden en progreso",
      "status": "IN_PROGRESS",
      ...
    }
  ]
}
```

**Respuesta cuando NO se encuentran órdenes (404):**
```json
{
  "message": "No se encontraron órdenes para la estación \"EST_001\" con estado \"COMPLETED\".",
  "data": []
}
```

---

### 5️⃣ Status inválido
```bash
curl -X GET "http://localhost:4201/api/service-orders?status=INVALIDO" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Respuesta error (400):**
```json
{
  "message": "Status inválido. Valores permitidos: PENDING, IN_PROGRESS, COMPLETED, CANCELLED"
}
```

---

## ✅ Estados Válidos

```
PENDING        - Orden pendiente
IN_PROGRESS    - Orden en progreso
COMPLETED      - Orden completada
CANCELLED      - Orden cancelada
```

---

## 🔐 Requisitos

1. **Token JWT válido** - Pasar en header `Authorization: Bearer TOKEN`
2. **StationId existente** (si lo usas) - Debe existir una orden con ese ID
3. **Status válido** (si lo usas) - Debe ser uno de los 4 valores arriba

---

## 📊 Casos de Uso Comunes

### Caso 1: Ver todas mis órdenes pendientes
```bash
curl -X GET "http://localhost:4201/api/service-orders?status=PENDING"
```

### Caso 2: Ver órdenes de una estación específica
```bash
curl -X GET "http://localhost:4201/api/service-orders?stationId=CARACAS_CENTRO"
```

### Caso 3: Ver órdenes completadas de una estación
```bash
curl -X GET "http://localhost:4201/api/service-orders?stationId=CARACAS_CENTRO&status=COMPLETED"
```

### Caso 4: Ver todas las órdenes en progreso
```bash
curl -X GET "http://localhost:4201/api/service-orders?status=IN_PROGRESS"
```

---

## 🧪 Testing Avanzado

### Con Postman
1. Importa `postman-collection.json`
2. Ve a la request "📦 Service Orders - Get All"
3. En la pestaña "Params" agrega:
   - Key: `stationId`, Value: `EST_001`
   - Key: `status`, Value: `PENDING`
4. Click en "Send"

### Con Insomnia
1. Abre la request GET /api/service-orders
2. En Query > agrega los parámetros
3. Enviar

### Script PowerShell
```powershell
$token = "TU_TOKEN_AQUI"
$baseUrl = "http://localhost:4201"

# Sin filtros
Invoke-WebRequest -Uri "$baseUrl/api/service-orders" `
  -Headers @{"Authorization" = "Bearer $token"}

# Con filtro de stationId
Invoke-WebRequest -Uri "$baseUrl/api/service-orders?stationId=EST_001" `
  -Headers @{"Authorization" = "Bearer $token"}

# Con ambos filtros
Invoke-WebRequest -Uri "$baseUrl/api/service-orders?stationId=EST_001&status=PENDING" `
  -Headers @{"Authorization" = "Bearer $token"}
```

---

## 🎯 Comportamiento del Endpoint

| Escenario | Respuesta | Código HTTP |
|-----------|-----------|------------|
| Órdenes encontradas | Array de órdenes | 200 |
| Sin órdenes coincidentes | Mensaje descriptivo + array vacío | 404 |
| Status inválido | Mensaje de error + valores válidos | 400 |
| Sin autenticación | Error de autenticación | 401 |
| Error en servidor | Mensaje de error | 500 |

---

## 📝 Notas Técnicas

✅ **Implementado:**
- Filtro por `stationId`
- Filtro por `status` con validación
- Búsqueda combinada (ambos filtros)
- Índices en BD para mejor rendimiento
- Mensajes descriptivos cuando no hay resultados
- Ordenamiento por `createdAt` descendente

📋 **Campo agregado al modelo:**
```javascript
stationId: {
  type: String,
  required: true,
  trim: true,
  index: true  // Para búsquedas rápidas
}
```

---

## 🚀 Crear Órdenes de Prueba

Primero crea algunas órdenes con diferentes estaciones:

```bash
# Orden 1
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stationId": "EST_001",
    "title": "Revisión de bombas",
    "description": "Revisión general",
    "status": "PENDING"
  }'

# Orden 2
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stationId": "EST_002",
    "title": "Mantenimiento de tanques",
    "description": "Limpieza",
    "status": "IN_PROGRESS"
  }'

# Orden 3
curl -X POST http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stationId": "EST_001",
    "title": "Inspección de válvulas",
    "description": "Control de funcionamiento",
    "status": "COMPLETED"
  }'
```

Luego prueba los filtros.

---

## ✨ Mejoras Futuras

- [ ] Paginación (limit, offset)
- [ ] Más filtros (por rango de fechas, usuario, etc.)
- [ ] Búsqueda por texto en title/description
- [ ] Ordenamiento personalizado
- [ ] Exportar resultados (CSV, PDF)

---

**Versión:** 2.1.0  
**Fecha:** 15 de Febrero 2026  
**Status:** ✅ Implementado y Funcional

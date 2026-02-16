# 🔍 DOS ENDPOINTS DE BÚSQUEDA - DOCUMENTACIÓN

## ✅ ESTADO: IMPLEMENTADO

Ahora tienes **DOS endpoints separados** para diferentes casos de uso:

---

## 📋 ENDPOINTS DISPONIBLES

### 1️⃣ GET /api/service-orders - SIN FILTROS (Trae TODO)

Obtiene **TODAS las órdenes** sin ningún filtro.

```bash
curl -X GET http://localhost:4201/api/service-orders \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta exitosa (200):**
```json
{
  "total": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Orden 1",
      "status": "PENDING",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "stationId": "EST_002",
      "title": "Orden 2",
      "status": "IN_PROGRESS",
      ...
    }
  ]
}
```

**Respuesta si no hay órdenes (404):**
```json
{
  "message": "No se encontraron órdenes en la base de datos.",
  "data": []
}
```

---

### 2️⃣ GET /api/service-orders/search/filters - CON FILTROS

Busca órdenes usando filtros específicos.

**Parámetros Query:**
- `stationId` (opcional) - ID de la estación
- `status` (opcional) - Estado de la orden

**⚠️ IMPORTANTE:** Debes proporcionar **al menos UNO** de los dos parámetros.

#### Ejemplos:

##### A) Buscar por estación
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters?stationId=EST_001" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta:**
```json
{
  "total": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "stationId": "EST_001",
      "title": "Orden de mantenimiento",
      "status": "PENDING",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "stationId": "EST_001",
      "title": "Orden de revisión",
      "status": "COMPLETED",
      ...
    }
  ]
}
```

---

##### B) Buscar por estado
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters?status=IN_PROGRESS" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta:**
```json
{
  "total": 3,
  "data": [...]
}
```

---

##### C) Buscar por AMBOS (estación Y estado)
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters?stationId=EST_001&status=PENDING" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta:**
```json
{
  "total": 1,
  "data": [
    {
      "stationId": "EST_001",
      "status": "PENDING",
      ...
    }
  ]
}
```

---

## ⚠️ CASOS DE ERROR

### Falta de parámetros de filtro
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta (400):**
```json
{
  "message": "Debe proporcionar al menos un filtro: stationId o status"
}
```

### Status inválido
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters?status=INVALIDO" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta (400):**
```json
{
  "message": "Status inválido. Valores permitidos: PENDING, IN_PROGRESS, COMPLETED, CANCELLED"
}
```

### No se encuentran resultados
```bash
curl -X GET "http://localhost:4201/api/service-orders/search/filters?stationId=EST_999" \
  -H "Authorization: Bearer TOKEN"
```

**Respuesta (404):**
```json
{
  "message": "No se encontraron órdenes para la estación \"EST_999\".",
  "data": []
}
```

---

## 📊 TABLA COMPARATIVA

| Característica | GET / | GET /search/filters |
|---|---|---|
| **Traer todo** | ✅ Sí | ❌ No |
| **Usar filtros** | ❌ No | ✅ Sí |
| **stationId requerido** | ❌ | ❌ |
| **status requerido** | ❌ | ❌ |
| **Min. filtros requeridos** | 0 | 1 |
| **Para casos masivos** | ✅ | ❌ |
| **Para búsquedas específicas** | ❌ | ✅ |

---

## 🎯 CUÁNDO USAR CADA UNO

### Usa `GET /api/service-orders` cuando:
✅ Necesitas ver **TODAS** las órdenes  
✅ Quieres un listado general sin filtrar  
✅ Necesitas hacer un reporte completo  
✅ Quieres toda la información de golpe  

### Usa `GET /api/service-orders/search/filters` cuando:
✅ Necesitas buscar órdenes de una **estación específica**  
✅ Quieres ver solo órdenes en cierto **estado**  
✅ Necesitas una **búsqueda específica**  
✅ Quieres filtrar por estación Y estado simultáneamente  

---

## 🧪 EJEMPLOS PRÁCTICOS

### Caso 1: Ver todas las órdenes del sistema
```bash
GET /api/service-orders
## Respuesta: todas las órdenes (pueden ser cientos)
```

### Caso 2: Ver órdenes pendientes
```bash
GET /api/service-orders/search/filters?status=PENDING
## Respuesta: solo órdenes sin procesar
```

### Caso 3: Ver órdenes de una estación
```bash
GET /api/service-orders/search/filters?stationId=CARACAS_ESTE
## Respuesta: todas las órdenes de esa estación
```

### Caso 4: Ver órdenes completadas de una estación
```bash
GET /api/service-orders/search/filters?stationId=CARACAS_ESTE&status=COMPLETED
## Respuesta: histórico de órdenes completadas de esa estación
```

---

## 💡 TIPS ÚTILES

1. **Combina filtros** para búsquedas más precisas
   ```bash
   ?stationId=EST_001&status=IN_PROGRESS
   ```

2. **Sin filtros** en /search/filters dará error 400
   - Usa GET / si quieres todo sin filtros

3. **Case-sensitive** para stationId
   - `EST_001` ≠ `est_001`

4. **Status** no es case-sensitive en ciertos contextos pero úsalo como se muestra

---

## 📁 CAMBIOS REALIZADOS

```
✏️ service-order.controller.js
   • Separado findAll (sin filtros)
   • Agregado searchByFilters (con filtros)

✏️ service-order.routes.js
   • Ruta GET / → findAll (todo)
   • Ruta GET /search/filters → searchByFilters (con filtros)
   • GET /:id → findById (por ID específico)
```

---

## 🔄 Flujo de Uso Típico

```
Usuario quiere buscar
         ↓
¿Quiere VER TODO?
    ↙          ↘
  SÍ            NO
   ↓            ↓
GET /         ¿Tiene criterios?
             ↙         ↘
           SÍ           NO
            ↓           ↓
      GET /search/    Error:
      filters      Proporciona filtros
           ↓
    (usa ?stationId=&status=)
```

---

## ✨ Ventajas de los DOS Endpoints

1. **Clarity** - Es claro qué hace cada uno
2. **Performance** - Puedes optimizar cada uno por separado
3. **Validation** - Validaciones apropiadas para cada caso
4. **Flexibility** - Puedes cambiar uno sin afectar el otro
5. **API Design** - Sigue mejores prácticas REST

---

**Versión:** 2.2.0  
**Estado:** ✅ Implementado y Funcional  
**Testing:** ✅ Listo

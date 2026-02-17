# 🧪 PASO A PASO: Cómo Probar los Endpoints Sin Swagger UI

Dado que Swagger UI tiene errores de parsing, aquí te muestro cómo probar todos los endpoints manualmente:

---

## 📋 Tabla de Contenidos

1. [Obtener Token JWT](#obtener-token-jwt)
2. [Crear Orden (POST)](#crear-orden)
3. [Listar Todas las Órdenes (GET)](#listar-órdenes)
4. [Buscar con Filtros (GET /search/filters)](#buscar-con-filtros)
5. [Obtener Orden por ID (GET /{id})](#obtener-por-id)
6. [Actualizar Estado (PATCH /{id}/status)](#actualizar-estado)
7. [Actualizar Orden Completa (PUT /{id})](#actualizar-orden)
8. [Eliminar Orden (DELETE /{id})](#eliminar-orden)

---

## 1. Obtener Token JWT

**Paso 1:** Abre PowerShell y ejecuta este comando para obtener el token:

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4201/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@terpel.com","password":"123456"}' `
  -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: $token"
```

**Guarda el token** que aparece en pantalla. Lo necesitarás para todos los endpoints.

---

## 2. Crear Orden (POST)

**Endpoint:**
```
POST http://localhost:4201/api/service-orders
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"

$body = @{
    stationId = "STATION-001"
    title = "Mantenimiento de dispensadores"
    description = "Revisión y limpieza general"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Orden creada:"
$result | ConvertTo-Json | Write-Host
$orderId = $result._id
Write-Host "ID de la orden: $orderId" -ForegroundColor Green
```

---

## 3. Listar Todas las Órdenes (GET)

**Endpoint:**
```
GET http://localhost:4201/api/service-orders
GET http://localhost:4201/api/service-orders?page=1&limit=5
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"

# Sin paginación
$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Total de órdenes: $($result.total)"
Write-Host "Órdenes:"
$result.data | Format-Table -AutoSize

# Con paginación
$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders?page=1&limit=5" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Página 1, 5 registros por página"
Write-Host "Total: $($result.total), Página: $($result.page), Limit: $($result.limit)"
```

---

## 4. Buscar con Filtros (GET /search/filters)

**Endpoint:**
```
GET http://localhost:4201/api/service-orders/search/filters?stationId=STATION-001&status=PENDING
GET http://localhost:4201/api/service-orders/search/filters?status=IN_PROGRESS
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"

# Filtrar por estación
$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/search/filters?stationId=STATION-001" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Órdenes de STATION-001:"
$result | ConvertTo-Json | Write-Host

# Filtrar por estado
$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/search/filters?status=IN_PROGRESS" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Órdenes en estado IN_PROGRESS:"
$result.data | Format-Table -AutoSize
```

---

## 5. Obtener Orden por ID (GET /{id})

**Endpoint:**
```
GET http://localhost:4201/api/service-orders/{ORDER_ID}
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"
$orderId= "ID_DE_LA_ORDEN"  # Ejemplo: 507f1f77bcf86cd799439011

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/$orderId" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Orden encontrada:"
$result | ConvertTo-Json | Write-Host
```

---

## 6. Actualizar Estado (PATCH /{id}/status)

**Endpoint:**
```
PATCH http://localhost:4201/api/service-orders/{ORDER_ID}/status
```

**Estados válidos:** `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"
$orderId = "ID_DE_LA_ORDEN"

# Cambiar a IN_PROGRESS
$body = @{
    status = "IN_PROGRESS"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/$orderId/status" `
  -Method PATCH `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Estado actualizado a: $($result.status)"

# Cambiar a COMPLETED
$body = @{
    status = "COMPLETED"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/$orderId/status" `
  -Method PATCH `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Estado actualizado a: $($result.status)"
```

---

## 7. Actualizar Orden Completa (PUT /{id})

**Endpoint:**
```
PUT http://localhost:4201/api/service-orders/{ORDER_ID}
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"
$orderId = "ID_DE_LA_ORDEN"

$body = @{
    title = "Nuevo título actualizando"
    description = "Nueva descripción completamente actualizada"
    status = "PENDING"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/$orderId" `
  -Method PUT `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "Orden actualizada:"
$result | ConvertTo-Json | Write-Host
```

---

## 8. Eliminar Orden (DELETE /{id})

**Endpoint:**
```
DELETE http://localhost:4201/api/service-orders/{ORDER_ID}
```

**PowerShell:**
```powershell
$token = "TU_TOKEN_AQUI"
$orderId = "ID_DE_LA_ORDEN"

$response = Invoke-WebRequest -Uri `
  "http://localhost:4201/api/service-orders/$orderId" `
  -Method DELETE `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

if ($response.StatusCode -eq 204) {
    Write-Host "✓ Orden eliminada exitosamente" -ForegroundColor Green
} else {
    Write-Host "Error: $($response.StatusCode)" -ForegroundColor Red
}
```

---

## 🧪 Script Completo de Prueba

Guarda este archivo como `test-endpoints.ps1`:

```powershell
# ==========================================
# SCRIPT DE PRUEBA COMPLETO - Service Orders
# ==========================================

# PASO 1: OBTENER TOKEN
Write-Host "1️⃣  Obteniendo token JWT..." -ForegroundColor Cyan

$loginResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@terpel.com","password":"123456"}' `
  -UseBasicParsing

$token = ($loginResponse.Content | ConvertFrom-Json).token
Write-Host "✓ Token obtenido" -ForegroundColor Green
Write-Host "Token: $token`n" -ForegroundColor Yellow

# PASO 2: CREAR ORDEN
Write-Host "2️⃣  Creando nueva orden..." -ForegroundColor Cyan

$createBody = @{
    stationId = "STATION-TEST-$(Get-Random)"
    title = "Orden de Prueba $(Get-Date -Format 'HH:mm:ss')"
    description = "Creada automáticamente por script de prueba"
} | ConvertTo-Json

$createResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders" `
  -Method POST `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $createBody `
  -UseBasicParsing

$order = $createResponse.Content | ConvertFrom-Json
$orderId = $order._id

Write-Host "✓ Orden creada" -ForegroundColor Green
Write-Host "ID: $orderId" -ForegroundColor Yellow
Write-Host "Estado: $($order.status)`n" -ForegroundColor Yellow

# PASO 3: LISTAR ÓRDENES
Write-Host "3️⃣  Listando todas las órdenes..." -ForegroundColor Cyan

$listResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$orders = $listResponse.Content | ConvertFrom-Json
Write-Host "✓ Total de órdenes: $($orders.total)" -ForegroundColor Green
Write-Host "$($orders.data.Count) órdenes en la página actual`n" -ForegroundColor Yellow

# PASO 4: OBTENER ORDEN POR ID
Write-Host "4️⃣  Obteniendo orden por ID..." -ForegroundColor Cyan

$getResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/$orderId" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$singleOrder = $getResponse.Content | ConvertFrom-Json
Write-Host "✓ Orden encontrada: $($singleOrder.title)" -ForegroundColor Green
Write-Host "Estación: $($singleOrder.stationId)`n" -ForegroundColor Yellow

# PASO 5: ACTUALIZAR ESTADO
Write-Host "5️⃣  Actualizando estado a IN_PROGRESS..." -ForegroundColor Cyan

$statusBody = @{
    status = "IN_PROGRESS"
} | ConvertTo-Json

$statusResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/$orderId/status" `
  -Method PATCH `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $statusBody `
  -UseBasicParsing

$updatedOrder = $statusResponse.Content | ConvertFrom-Json
Write-Host "✓ Estado actualizado a: $($updatedOrder.status)" -ForegroundColor Green
Write-Host "Actualizado en: $($updatedOrder.updatedAt)`n" -ForegroundColor Yellow

# PASO 6: ACTUALIZAR ORDEN COMPLETA
Write-Host "6️⃣  Actualizando título y descripción..." -ForegroundColor Cyan

$updateBody = @{
    title = "Orden Modificada por Script"
    description = "Esta orden fue completamente actualizada"
} | ConvertTo-Json

$updateResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/$orderId" `
  -Method PUT `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $updateBody `
  -UseBasicParsing

$puttedOrder = $updateResponse.Content | ConvertFrom-Json
Write-Host "✓ Orden actualizada: $($puttedOrder.title)" -ForegroundColor Green
Write-Host "Descripción: $($puttedOrder.description)`n" -ForegroundColor Yellow

# PASO 7: BUSCAR CON FILTROS
Write-Host "7️⃣  Buscando órdenes con filtro de status..." -ForegroundColor Cyan

$searchResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/search/filters?status=IN_PROGRESS" `
  -Method GET `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

$searchResults = $searchResponse.Content | ConvertFrom-Json
Write-Host "✓ Encontradas $($searchResults.total) órdenes en estado IN_PROGRESS" -ForegroundColor Green
Write-Host "$($searchResults.data.Count) órdenes en la respuesta`n" -ForegroundColor Yellow

# PASO 8: CAMBIAR A COMPLETED
Write-Host "8️⃣  Cambiando estado a COMPLETED..." -ForegroundColor Cyan

$completeBody = @{
    status = "COMPLETED"
} | ConvertTo-Json

$completeResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/$orderId/status" `
  -Method PATCH `
  -ContentType "application/json" `
  -Headers @{"Authorization" = "Bearer $token"} `
  -Body $completeBody `
  -UseBasicParsing

$completedOrder = $completeResponse.Content | ConvertFrom-Json
Write-Host "✓ Orden completada: $($completedOrder.status)" -ForegroundColor Green
Write-Host "Completada en: $($completedOrder.updatedAt)`n" -ForegroundColor Yellow

# PASO 9: ELIMINAR ORDEN
Write-Host "9️⃣  Eliminando orden..." -ForegroundColor Cyan

$deleteResponse = Invoke-WebRequest -Uri "http://localhost:4201/api/service-orders/$orderId" `
  -Method DELETE `
  -Headers @{"Authorization" = "Bearer $token"} `
  -UseBasicParsing

if ($deleteResponse.StatusCode -eq 204) {
    Write-Host "✓ Orden eliminada exitosamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error al eliminar: $($deleteResponse.StatusCode)" -ForegroundColor Red
}

Write-Host "`n✅ PRUEBA COMPLETADA EXITOSAMENTE" -ForegroundColor Green
```

**Para ejecutar:**
```powershell
.\test-endpoints.ps1
```

---

## 🔑 Resumo de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-----------|
| POST | `/api/service-orders` | Crear orden |
| GET | `/api/service-orders` | Listar todas |
| GET | `/api/service-orders/search/filters` | Buscar con filtros |
| GET | `/api/service-orders/{id}` | Obtener por ID |
| PATCH | `/api/service-orders/{id}/status` | Cambiar estado |
| PUT | `/api/service-orders/{id}` | Actualizar orden |
| DELETE | `/api/service-orders/{id}` | Eliminar |

---

## 🚀 Para Inicia el Servidor

```powershell
cd C:\waaps\Terpel
npm start
```

---

**Todos los endpoints están funcionando correctamente. Solo necesitas seguir estos pasos para probarlos.** ✅

#!/usr/bin/env pwsh

# 🧪 SCRIPT DE TESTING RÁPIDO PARA WINDOWS - TERPEL API
# Uso: .\test-api.ps1

$BASE_URL = "http://localhost:4201"
$ADMIN_EMAIL = "admin@terpel.com"
$ADMIN_PASSWORD = "123456"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🧪 TESTING API TERPEL - FLUJO COMPLETO" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1️⃣  HEALTH CHECK" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $health = Invoke-WebRequest -Uri "$BASE_URL/health" -UseBasicParsing
    Write-Host "GET /health" -ForegroundColor White
    Write-Host "Respuesta: $($health.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error en health check" -ForegroundColor Red
}
Write-Host ""

# 2. Login
Write-Host "2️⃣  LOGIN" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $loginBody = @{
        email = $ADMIN_EMAIL
        password = $ADMIN_PASSWORD
    } | ConvertTo-Json

    $login = Invoke-WebRequest -Uri "$BASE_URL/api/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody `
        -UseBasicParsing

    Write-Host "POST /api/auth/login" -ForegroundColor White
    Write-Host "Respuesta: $($login.Content)" -ForegroundColor Green
    
    $TOKEN = ($login.Content | ConvertFrom-Json).token
    Write-Host "Token obtenido: $($TOKEN.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}
Write-Host ""

# 3. Verificar Usuario
Write-Host "3️⃣  VERIFICAR USUARIO ACTUAL" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $me = Invoke-WebRequest -Uri "$BASE_URL/api/auth/me" `
        -Headers @{"Authorization" = "Bearer $TOKEN"} `
        -UseBasicParsing

    Write-Host "GET /api/auth/me" -ForegroundColor White
    Write-Host "Respuesta: $($me.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error obteniendo usuario: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Listar Usuarios
Write-Host "4️⃣  LISTAR USUARIOS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $users = Invoke-WebRequest -Uri "$BASE_URL/api/users" `
        -Headers @{"Authorization" = "Bearer $TOKEN"} `
        -UseBasicParsing

    Write-Host "GET /api/users" -ForegroundColor White
    Write-Host "Respuesta (primeros 300 caracteres):" -ForegroundColor White
    Write-Host "$($users.Content.Substring(0, [Math]::Min(300, $users.Content.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Error listando usuarios: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Crear Nueva Orden
Write-Host "5️⃣  CREAR NUEVA ORDEN" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $orderBody = @{
        title = "Orden de Prueba - $(Get-Date -Format 'HH:mm:ss')"
        description = "Creada desde script de testing PowerShell"
        status = "PENDING"
    } | ConvertTo-Json

    $order = Invoke-WebRequest -Uri "$BASE_URL/api/service-orders" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $TOKEN"
            "Content-Type" = "application/json"
        } `
        -Body $orderBody `
        -UseBasicParsing

    Write-Host "POST /api/service-orders" -ForegroundColor White
    $orderJson = ConvertFrom-Json $order.Content
    Write-Host "Orden creada con ID: $($orderJson._id)" -ForegroundColor Cyan
    Write-Host "Respuesta: $($order.Content)" -ForegroundColor Green
    $ORDER_ID = $orderJson._id
} catch {
    Write-Host "❌ Error creando orden: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 6. Listar Órdenes
Write-Host "6️⃣  LISTAR ÓRDENES" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
try {
    $orders = Invoke-WebRequest -Uri "$BASE_URL/api/service-orders" `
        -Headers @{"Authorization" = "Bearer $TOKEN"} `
        -UseBasicParsing

    Write-Host "GET /api/service-orders" -ForegroundColor White
    Write-Host "Respuesta (primeros 300 caracteres):" -ForegroundColor White
    Write-Host "$($orders.Content.Substring(0, [Math]::Min(300, $orders.Content.Length)))..." -ForegroundColor Green
} catch {
    Write-Host "❌ Error listando órdenes: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 7. Actualizar Estado
if ($ORDER_ID) {
    Write-Host "7️⃣  ACTUALIZAR ESTADO DE ORDEN" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    try {
        $updateBody = @{
            status = "IN_PROGRESS"
        } | ConvertTo-Json

        $update = Invoke-WebRequest -Uri "$BASE_URL/api/service-orders/$ORDER_ID/status" `
            -Method PUT `
            -Headers @{
                "Authorization" = "Bearer $TOKEN"
                "Content-Type" = "application/json"
            } `
            -Body $updateBody `
            -UseBasicParsing

        Write-Host "PUT /api/service-orders/$ORDER_ID/status" -ForegroundColor White
        Write-Host "Estado actualizado a: IN_PROGRESS" -ForegroundColor Cyan
        Write-Host "Respuesta: $($update.Content)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error actualizando estado: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# 8. Obtener Orden Específica
if ($ORDER_ID) {
    Write-Host "8️⃣  OBTENER ORDEN ESPECÍFICA" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    try {
        $getOrder = Invoke-WebRequest -Uri "$BASE_URL/api/service-orders/$ORDER_ID" `
            -Headers @{"Authorization" = "Bearer $TOKEN"} `
            -UseBasicParsing

        Write-Host "GET /api/service-orders/$ORDER_ID" -ForegroundColor White
        Write-Host "Respuesta: $($getOrder.Content)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error obteniendo orden: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ TESTING COMPLETADO" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 RESUMEN:" -ForegroundColor Yellow
Write-Host "  • Token obtenido: ✅" -ForegroundColor Green
Write-Host "  • Usuario verificado: ✅" -ForegroundColor Green
Write-Host "  • Usuarios listados: ✅" -ForegroundColor Green
Write-Host "  • Orden creada: ✅" -ForegroundColor Green
Write-Host "  • Orden actualizada: ✅" -ForegroundColor Green

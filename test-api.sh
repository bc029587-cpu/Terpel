#!/bin/bash

# 🧪 SCRIPT DE TESTING RÁPIDO - TERPEL API
# Uso: bash test-api.sh

BASE_URL="http://localhost:4201"
ADMIN_EMAIL="admin@terpel.com"
ADMIN_PASSWORD="123456"

echo "================================================"
echo "🧪 TESTING API TERPEL - FLUJO COMPLETO"
echo "================================================"
echo ""

# 1. Health Check
echo "1️⃣  HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HEALTH=$(curl -s -X GET "$BASE_URL/health")
echo "GET /health"
echo "Respuesta: $HEALTH"
echo ""

# 2. Login
echo "2️⃣  LOGIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
echo "POST /api/auth/login"
echo "Respuesta: $LOGIN"
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtenido: ${TOKEN:0:20}..."
echo ""

# 3. Verificar Usuario
echo "3️⃣  VERIFICAR USUARIO ACTUAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ME=$(curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")
echo "GET /api/auth/me"
echo "Respuesta: $ME"
echo ""

# 4. Listar Usuarios
echo "4️⃣  LISTAR USUARIOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
USERS=$(curl -s -X GET "$BASE_URL/api/users" \
  -H "Authorization: Bearer $TOKEN")
echo "GET /api/users"
echo "Respuesta: $USERS"
echo ""

# 5. Crear Nueva Orden
echo "5️⃣  CREAR NUEVA ORDEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ORDER=$(curl -s -X POST "$BASE_URL/api/service-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Orden de Prueba",
    "description":"Creada desde script de testing",
    "status":"PENDING"
  }')
echo "POST /api/service-orders"
echo "Respuesta: $ORDER"
ORDER_ID=$(echo $ORDER | grep -o '"_id":"[^"]*' | cut -d'"' -f4 | head -1)
echo "Order ID: $ORDER_ID"
echo ""

# 6. Listar Órdenes
echo "6️⃣  LISTAR ÓRDENES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ORDERS=$(curl -s -X GET "$BASE_URL/api/service-orders" \
  -H "Authorization: Bearer $TOKEN")
echo "GET /api/service-orders"
echo "Respuesta (primeros 200 caracteres): ${ORDERS:0:200}..."
echo ""

# 7. Actualizar Estado
if [ ! -z "$ORDER_ID" ]; then
  echo "7️⃣  ACTUALIZAR ESTADO DE ORDEN"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  UPDATE=$(curl -s -X PUT "$BASE_URL/api/service-orders/$ORDER_ID/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"IN_PROGRESS"}')
  echo "PUT /api/service-orders/$ORDER_ID/status"
  echo "Respuesta: $UPDATE"
  echo ""
fi

echo "================================================"
echo "✅ TESTING COMPLETADO"
echo "================================================"

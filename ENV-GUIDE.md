# 🔐 GUÍA COMPLETA: VARIABLES DE ENTORNO EN TERPEL

## 📋 ÍNDICE
1. [Introducción](#introducción)
2. [Archivos .env](#archivos-env)
3. [Cómo usar el sistema](#cómo-usar-el-sistema)
4. [Variables disponibles](#variables-disponibles)
5. [Mejores prácticas](#mejores-prácticas)
6. [Troubleshooting](#troubleshooting)

---

## Introducción

Este proyecto implementa un sistema **seguro y centralizado de variables de entorno** usando:

- **dotenv**: Carga archivos `.env` en `process.env`
- **config/index.js**: Centraliza todas las variables en un único punto
- **Validación automática**: Detecta variables faltantes en el startup

### Por qué es importante:

✅ **Seguridad**: Las credenciales NO van en el código  
✅ **Flexibilidad**: Diferentes configuraciones por ambiente  
✅ **Mantenibilidad**: Un único lugar donde ver todas las variables  
✅ **Detección temprana**: Los errores aparecen al iniciar, no en runtime  

---

## Archivos .env

### `.env.example` 📖
- **Propósito**: Documentación de variables disponibles
- **Ubicación**: Raíz del proyecto
- **Contiene**: Estructura de todas las variables sin valores sensibles
- **Uso**: Referencia para nuevos desarrolladores
- **⚠️ Importante**: Committearse al repositorio (sin secretos)

### `.env.local` 🔨
- **Propósito**: Configuración local para desarrollo
- **Ubicación**: Raíz del proyecto
- **Contiene**: Valores reales para desarrollo local
- **Uso**: Tu máquina local de desarrollo
- **⚠️ Importante**: NOT committeearse al repositorio (agregar a .gitignore)

### `.env.production` 🚀
- **Propósito**: Configuración para servidor de producción
- **Ubicación**: Solo en servidor de producción
- **Contiene**: Credenciales REALES y secretas
- **Uso**: Servidor de producción (ej: AWS, Heroku, DigitalOcean)
- **⚠️ CRÍTICO**: NUNCA committeearse al repositorio

### `.env.test` 🧪
- **Propósito**: Configuración para tests
- **Ubicación**: Raíz del proyecto (opcional)
- **Contiene**: Valores para BD de test, API keys fake
- **Uso**: Cuando ejecutas npm test
- **⚠️ Importante**: NOT committeearse al repositorio

---

## Cómo usar el sistema

### 1️⃣ En Desarrollo Local

```bash
# 1. Copiar archivo de ejemplo
cp .env.example .env.local

# 2. Editar con tus valores locales
nano .env.local

# 3. dotenv cargará automáticamente en server.js
npm start

# El sistema imprimirá:
# ✅ Configuración cargada:
#    Ambiente: development
#    Puerto: 4201
#    BD: mongodb://127.0.0.1...
#    CORS Orígenes: http://localhost:3000, http://localhost:5173
```

### 2️⃣ En Producción

```bash
# En tu servidor (ej: AWS EC2)
cd /app/terpel

# Crear .env.production con credenciales reales
nano .env.production

# Ver la sección de "Críticos en Producción" abajo

# Iniciar servidor
NODE_ENV=production npm start
```

### 3️⃣ En Tests

```bash
# El script de test cargará automáticamente variables de test
NODE_ENV=test npm test

# Las variables se cargan en este orden de prioridad:
# 1. process.env (variables del sistema)
# 2. archivo .env.test (si existe)
# 3. archivo .env (si existe)
# 4. valores por defecto en config/index.js
```

---

## Variables disponibles

### 🔧 GENERAL

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `NODE_ENV` | Ambiente: development, test, production | ✅ | development |
| `PORT` | Puerto del servidor | ❌ | 4201 |
| `HOST` | Host del servidor | ❌ | localhost |
| `SERVER_URL` | URL pública del servidor | ❌ | http://localhost:4201 |

### 🗄️ BASE DE DATOS

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `MONGO_URI` | URL de conexión a MongoDB | ✅ | mongodb://127.0.0.1:27017/terpel |
| `MONGO_USER` | Usuario MongoDB | ❌ | admin |
| `MONGO_PASSWORD` | Contraseña MongoDB | ❌ | p@ssw0rd |

**Tipos de conexión:**

```bash
# Local (desarrollo)
MONGO_URI=mongodb://127.0.0.1:27017/terpel

# MongoDB Atlas (producción recomendada)
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/terpel
```

### 🔐 AUTENTICACIÓN (CRÍTICO)

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `JWT_SECRET` | 🔴 Clave para firmar tokens JWT | ✅ | abc123xyz456... (32+ caracteres) |
| `JWT_EXPIRATION` | Duración del token | ❌ | 1h, 24h, 7d |
| `JWT_REFRESH_EXPIRATION` | Duración del refresh token | ❌ | 7d |
| `SESSION_SECRET` | Clave para sesiones | ❌ | secret123 |

**Generar JWT_SECRET seguro:**

```bash
# En Linux/Mac
openssl rand -hex 32

# En Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# En Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 🌐 CORS

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `ALLOWED_ORIGINS` | Dominios permitidos | ❌ | http://localhost:3000,https://terpel.com |

```bash
# Desarrollo
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Producción
ALLOWED_ORIGINS=https://terpel.com,https://www.terpel.com,https://admin.terpel.com
```

### 📧 EMAIL (SMTP)

| Variable | Descripción | Requerida | Ejemplo |
|---|---|---|---|
| `SMTP_HOST` | Servidor SMTP | ❌ | smtp.gmail.com |
| `SMTP_PORT` | Puerto SMTP | ❌ | 587 |
| `SMTP_USER` | Usuario SMTP | ❌ | noreply@terpel.com |
| `SMTP_PASSWORD` | Contraseña/App Password | ❌ | abc123xyz |
| `EMAIL_FROM` | Email remitente | ❌ | noreply@terpel.com |

**Configurar Gmail:**

1. Habilitar 2FA en tu cuenta Google
2. Generar "App Password" en https://myaccount.google.com/apppasswords
3. Usar ese password en `SMTP_PASSWORD`

### 🔑 API KEYS (Servicios externos)

| Variable | Servicio | Requerida | Dónde obtener |
|---|---|---|---|
| `GOOGLE_API_KEY` | Google Cloud | ❌ | https://console.cloud.google.com |
| `STRIPE_API_KEY` | Stripe (secreto) | ❌ | https://dashboard.stripe.com/apikeys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe (público) | ❌ | https://dashboard.stripe.com/apikeys |
| `FOOTBALL_DATA_API_KEY` | Football Data | ❌ | https://www.football-data.org |

### 📊 LOGGING

| Variable | Descripción | Valores | Predeterminado |
|---|---|---|---|
| `LOG_LEVEL` | Nivel de logging | debug, info, warn, error | debug (dev) / info (prod) |
| `LOG_FILE` | Ubicación de logs | ruta local | ./logs/app.log |

### 🔧 SEGURIDAD

| Variable | Descripción | Rango | Predeterminado |
|---|---|---|---|
| `BCRYPT_ROUNDS` | Vueltas de hashing bcrypt | 10-12 | 10 (dev) / 12 (prod) |

Mayor número = más seguro pero más lento

### 🚀 MONITOREO

| Variable | Servicio | Requerida | Ejemplo |
|---|---|---|---|
| `SENTRY_DSN` | Error tracking | ❌ | https://xxx@sentry.io/123456 |

---

## Mejores prácticas

### ✅ HAZLO

```bash
# 1. Usar nombres descriptivos en MAYÚSCULAS
JWT_SECRET=...
STRIPE_API_KEY=...

# 2. Agrupar por categoría
# 🔐 AUTENTICACIÓN
JWT_SECRET=...

# 🔑 API KEYS
STRIPE_API_KEY=...

# 3. Proporcionar valores por defecto SEGUROS para desarrollo
JWT_SECRET=supersecret-dev-key  # OK en desarrollo
# Pero NO en producción:
JWT_SECRET=abc123xyz456abc123xyz456abc123xyz456  # Producción

# 4. Validar variables en el startup
# config/index.js lo hace automáticamente

# 5. Documentar cada variable
# Ver .env.example para documentación
```

### ❌ NO HAGAS

```bash
# 1. NO committear .env.local o .env.production
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore

# 2. NO usar valores sensibles en el código
// MALO ❌
const JWT_SECRET = 'abc123xyz';

// BIEN ✅
const JWT_SECRET = process.env.JWT_SECRET;
// O mejor:
const { auth: { jwt: { secret } } } = require('./config');

# 3. NO reutilizar credenciales entre ambientes
# Desarrollo: tu laptop, BD local
# Producción: servidor real, BD Atlas

# 4. NO dejar valores vacíos en producción
# Siempre validar en el startup

# 5. NO publicar credenciales en issues/PRs
# Rotar credenciales si encuentras que fue committeado
```

---

## Críticos en Producción 🚨

### 1️⃣ JWT_SECRET

```bash
# GENERAR CLAVE ÚNICA
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copiar el resultado y asignar a JWT_SECRET
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# ROTAR regularmente (cada 90 días)
```

### 2️⃣ MONGO_URI

```bash
# NUNCA usar default en producción
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/terpel

# Crear usuario específico de servicio en MongoDB Atlas
# NO reutilizar contraseña de cuenta personal
```

### 3️⃣ API KEYS

```bash
# Usar claves de PRODUCCIÓN, no de test
STRIPE_API_KEY=sk_live_...  # Producción
STRIPE_API_KEY=sk_test_...  # Test (NO en producción)

# Rotar claves anualmente
# Usar separadas para cada ambiente
```

### 4️⃣ CORS

```bash
# NUNCA usar '*' en producción
ALLOWED_ORIGINS=*  # ❌ Inseguro

# Siempre especificar dominios
ALLOWED_ORIGINS=https://terpel.com,https://www.terpel.com  # ✅ Seguro
```

### 5️⃣ Certificados y TLS

```bash
# Usar HTTPS en producción
SERVER_URL=https://api.terpel.com

# Certificados SSL/TLS obligatorios
# Let's Encrypt ofrece certificados gratis
```

---

## Troubleshooting

### Error: "Variable de entorno REQUERIDA no encontrada: JWT_SECRET"

**Causa**: No definiste una variable obligatoria

**Solución**:
```bash
# 1. Revisar config/index.js para ver qué requiere
# 2. Agregar a tu .env o .env.local
JWT_SECRET=your-secret-key

# 3. Reiniciar servidor
npm start
```

### Error: "Variable NODE_ENV inválida"

**Causa**: NODE_ENV no es development, test o production

**Solución**:
```bash
# Valores válidos:
NODE_ENV=development
NODE_ENV=test
NODE_ENV=production
```

### Las variables no se cargan

**Causa**: dotenv no se ejecutó antes de usarlas

**Solución**:
```javascript
// En el PRIMER archivo que se ejecuta (server.js):
require('dotenv').config();  // DEBE ser la primera línea
```

### JWT_SECRET expuesto en logs

**Causa**: Logueaste el valor secreto

**Solución**:
```javascript
// MALO ❌
console.log('JWT_SECRET:', config.auth.jwt.secret);

// BIEN ✅
console.log('JWT_SECRET configurado:', config.auth.jwt.secret ? '✅' : '❌');
```

### MongoDB conectada a la BD equivocada

**Causa**: MONGO_URI apunta a otro ambiente

**Solución**:
```bash
# Verificar cuál está activo
echo $MONGO_URI
cat .env.local | grep MONGO_URI

# Y asegurarte que uses la correcta
# Desarrollo: mongodb://127.0.0.1:27017/terpel
# Producción: mongodb+srv://user:pass@cluster.mongodb.net/terpel
```

---

## Cómo acceder a las variables en tu código

### Anónimo (evitar)

```javascript
const secret = process.env.JWT_SECRET;  // No recomendado
```

### Recomendado (usar siempre)

```javascript
// En cualquier archivo
const config = require('./config');

// Acceder a variables
console.log(config.auth.jwt.secret);
console.log(config.database.uri);
console.log(config.server.port);
console.log(config.isDevelopment);  // boolean
console.log(config.isProduction);   // boolean
```

### Validación automática

```javascript
// config/index.js valida automáticamente en startup
// Si falta una variable requerida, el servidor NO inicia

// Ejemplo:
// ❌ JWT_SECRET no definido
// Error: Variable de entorno REQUERIDA no encontrada: JWT_SECRET
```

---

## Próximos pasos

1. ✅ Copiar `.env.example` a `.env.local`
2. ✅ Editar `.env.local` con tus valores
3. ✅ Agregar `.env.local` y `.env.production` a `.gitignore`
4. ✅ Ejecutar `npm start` para validar
5. ✅ En producción, crear `.env.production` en el servidor

---

**Preguntas frecuentes:**
- ¿Cómo compartir `.env` con el equipo? → Usar `.env.example`, distribuir secretos por canal seguro
- ¿Cada desarrollador su propio `.env.local`? → Sí
- ¿Versionar `.env.example`? → Sí, siempre
- ¿Versionar secretos? → NUNCA


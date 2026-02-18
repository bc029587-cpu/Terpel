# 📊 DIAGRAMA DEL SISTEMA DE VARIABLES DE ENTORNO

## Flujo de Carga de Variables

```
┌─────────────────────────────────────────────────────────────────┐
│                     npm start (Desarrollo)                       │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   server.js (Punto de entrada)                   │
│                                                                   │
│   require('dotenv').config()          ← Carga variables de:    │
│                                          1. .env.local (primera)
│                                          2. .env (segunda)
│                                          3. process.env (sistema)
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              config/index.js (Centralización)                    │
│                                                                   │
│   ✅ Valida variables obligatorias                              │
│   ✅ Aplica valores por defecto seguros                         │
│   ✅ Organiza en categorías (server, db, auth, etc)           │
│   ✅ Detecta ambiente inválido                                  │
│   ✅ Log de diagnóstico                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    module.exports = config                       │
│                                                                   │
│   config.server.port          4201                              │
│   config.database.uri         mongodb://...                     │
│   config.auth.jwt.secret      (encriptado)                      │
│   config.cors.origin          [...]                             │
│   ... más configuración                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│              Importar en cualquier archivo                        │
│                                                                   │
│   const config = require('./config');                           │
│   config.server.port              ← Usar en toda la app        │
│   config.database.uri                                            │
│   config.auth.jwt.secret                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Orden de Prioridad

```
┌─────────────────────────────────┐
│   process.env (Sistema)         │  ← MÁS PRIORIDAD
├─────────────────────────────────┤
│   .env.local (Desarrollo)       │
├─────────────────────────────────┤
│   .env (Genérico)               │
├─────────────────────────────────┤
│   Defaults en config/index.js   │  ← MENOR PRIORIDAD
└─────────────────────────────────┘

Ejemplo:
process.env.PORT = 5000 (si pasas: PORT=5000 npm start)
.env.local: PORT=4201
config/index.js: default 4201
Result: 5000 (process.env gana)
```

---

## Estructura de Carpetas

```
Terpel/
├── .env.example               ← Documentación (committearse)
├── .env.local                 ← Tu desarrollo (NO committearse)
├── .env.production            ← Producción (NO committearse)
├── .gitignore                 ← Incluir .env.local y .env.production
├── ENV-GUIDE.md               ← Esta documentación
├── server.js                  ← Carga .env aquí (primer import)
├── app.js                     ← Usa config
├── config/
│   ├── index.js               ← 🔑 CENTRALIZACIÓN DE TODO
│   ├── swagger.js
│   ├── logger.js
│   └── env.js (opcional)
├── middlewares/
│   ├── auth.middleware.js     ← Usa config.auth.jwt.secret
│   └── error.middleware.js    ← Usa config.isDevelopment
├── modules/
│   ├── auth/
│   │   └── auth.service.js    ← Usa config.auth.jwt.secret
│   └── service-order/
└── scripts/
    └── create-admin.js        ← Usa config.database.uri
```

---

## Comparación: ANTES vs DESPUÉS

### ANTES ❌ (Sin centralización)

```javascript
// server.js
const PORT = process.env.PORT || 4201;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://...';

// middlewares/auth.middleware.js
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// modules/auth/auth.service.js
jwt.sign({...}, process.env.JWT_SECRET || 'supersecret', {...});

// services/create-admin.js
const MONGO_URI = process.env.MONGO_URI || 'mongodb://...';

// ❌ PROBLEMAS:
// - Mismo valor definido en múltiples archivos
// - Valida tardíamente (o nunca)
// - Difícil debuguear
// - Inconsistencias entre archivos
// - No hay un lugar centralizado
```

### DESPUÉS ✅ (Con centralización)

```javascript
// config/index.js
const config = {
  server: { port: ... },
  database: { uri: ... },
  auth: { jwt: { secret: ... } },
  // ... TODO centralizado
};

// Validación automática en startup
// Si falta variable obligatoria: FALLA EN STARTUP

// server.js
const config = require('./config');
app.listen(config.server.port, ...);

// middlewares/auth.middleware.js
const config = require('../config');
jwt.verify(token, config.auth.jwt.secret);

// modules/auth/auth.service.js
const config = require('../../config');
jwt.sign({...}, config.auth.jwt.secret, {...});

// ✅ VENTAJAS:
// - Un único punto de verdad
// - Validación en startup (fail-fast)
// - Fácil de mantener y debuguear
// - Consistencia garantizada
// - Fácil agregar nuevas variables
```

---

## Quick Start

### 1️⃣ Copia archivo de configuración
```bash
cp .env.example .env.local
```

### 2️⃣ Edita con tus valores
```bash
nano .env.local
# O en Windows:
# notepad .env.local
```

### 3️⃣ Verifica .gitignore
```bash
cat .gitignore | grep -E "\.env\.(local|production)"
# Si no está, agregar:
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

### 4️⃣ Inicia servidor
```bash
npm start

# Deberías ver:
# ✅ Configuración cargada:
#    Ambiente: development
#    Puerto: 4201
#    BD: mongodb://127.0.0.1...
```

### 5️⃣ Testing de una variable
```bash
# Editar .env.local
PORT=5000

# Reiniciar servidor
npm start

# Debería arrancar en puerto 5000
```

---

## Checklist de Seguridad

- [ ] `.env.local` y `.env.production` en `.gitignore`
- [ ] No hay credenciales en el código fuente
- [ ] `config/index.js` valida variables obligatorias
- [ ] JWT_SECRET ≠ "supersecret" en producción
- [ ] MONGO_URI es legítimo (no default)
- [ ] API KEYS son de producción (no test)
- [ ] CORS restringido en producción
- [ ] LOG_LEVEL es "info" en producción
- [ ] BCRYPT_ROUNDS = 12 en producción
- [ ] Se rotarán secretos regularmente

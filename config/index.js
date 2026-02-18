'use strict';

/**
 * 🔧 ARCHIVO DE CONFIGURACIÓN CENTRALIZADO
 * 
 * Este archivo centraliza TODAS las variables de entorno.
 * Ventajas:
 * ✅ Un solo lugar donde buscar configuración
 * ✅ Validación automática de variables requeridas
 * ✅ Defaults seguros para desarrollo
 * ✅ Fácil agregar nuevas variables
 * ✅ Detección de errores en startup (no en runtime)
 */

require('dotenv').config();

// ========================================
// FUNCIÓN PARA VALIDAR VARIABLES REQUERIDAS
// ========================================
function requireEnv(key, defaultValue = undefined) {
  const value = process.env[key];
  
  if (!value && defaultValue === undefined) {
    throw new Error(
      `❌ Variable de entorno REQUERIDA no encontrada: ${key}\n` +
      `   Asegúrate de definirla en tu archivo .env\n` +
      `   Ver .env.example para ejemplos`
    );
  }
  
  return value || defaultValue;
}

// ========================================
// VALIDAR AMBIENTE VÁLIDO
// ========================================
const NODE_ENV = process.env.NODE_ENV || 'development';
const VALID_ENVS = ['development', 'test', 'production'];

if (!VALID_ENVS.includes(NODE_ENV)) {
  throw new Error(
    `❌ NODE_ENV inválido: ${NODE_ENV}\n` +
    `   Valores permitidos: ${VALID_ENVS.join(', ')}`
  );
}

// ========================================
// 🔐 CONFIGURACIÓN CENTRALIZADA
// ========================================
const config = {
  // 🌍 GENERAL
  env: NODE_ENV,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  isTest: NODE_ENV === 'test',

  // 🔧 SERVIDOR
  server: {
    port: parseInt(process.env.PORT, 10) || 4201,
    host: process.env.HOST || 'localhost',
    url: process.env.SERVER_URL || 'http://localhost:4201'
  },

  // 🗄️  BASE DE DATOS
  database: {
    uri: requireEnv('MONGO_URI', 'mongodb://127.0.0.1:27017/terpel'),
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    
    // Opciones de conexión (Mongoose 7.0+)
    options: {
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    }
  },

  // 🔐 AUTENTICACIÓN
  auth: {
    jwt: {
      secret: requireEnv(
        'JWT_SECRET',
        NODE_ENV === 'production' 
          ? undefined  // En producción es OBLIGATORIO
          : 'supersecret-dev-key-change-in-production'
      ),
      expiration: process.env.JWT_EXPIRATION || '1h',
      refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
    },
    
    // Configuración de cookies (si usas session)
    session: {
      secret: process.env.SESSION_SECRET || 'session-secret',
      cookie: {
        httpOnly: true,
        secure: NODE_ENV === 'production', // HTTPS solo en producción
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      }
    }
  },

  // 🌐 CORS (Control de acceso)
  cors: {
    origin: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },

  // 📧 EMAIL (SMTP)
  email: {
    enabled: process.env.SMTP_HOST ? true : false,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@terpel.com'
  },

  // 🔑 API KEYS (Servicios externos)
  apiKeys: {
    google: process.env.GOOGLE_API_KEY,
    stripe: {
      secret: process.env.STRIPE_API_KEY,
      publishable: process.env.STRIPE_PUBLISHABLE_KEY
    },
    football: process.env.FOOTBALL_DATA_API_KEY
  },

  // 📊 LOGGING
  logging: {
    level: process.env.LOG_LEVEL || (NODE_ENV === 'production' ? 'info' : 'debug'),
    file: process.env.LOG_FILE || './logs/app.log',
    colorize: NODE_ENV !== 'production'
  },

  // 🚀 MONITOREO (Sentry, NewRelic, etc)
  monitoring: {
    sentry: {
      enabled: process.env.SENTRY_DSN ? true : false,
      dsn: process.env.SENTRY_DSN,
      environment: NODE_ENV,
      tracesSampleRate: 1.0
    }
  },

  // 🛡️  SEGURIDAD
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      maxRequests: 100 // máximo 100 requests por ventana
    },
    helmet: {
      enabled: true,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"]
        }
      }
    },
    bcrypt: {
      rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10
    }
  }
};

// ========================================
// VALIDACIÓN EN DESARROLLO
// ========================================
if (NODE_ENV === 'development') {
  console.log('✅ Configuración cargada:');
  console.log(`   Ambiente: ${config.env}`);
  console.log(`   Puerto: ${config.server.port}`);
  console.log(`   BD: ${config.database.uri.split('@')[0]}...` );
  console.log(`   CORS Orígenes: ${config.cors.origin.join(', ')}`);
}

// ========================================
// VALIDACIÓN EN PRODUCCIÓN
// ========================================
if (NODE_ENV === 'production') {
  const requiredVars = [
    'JWT_SECRET',
    'MONGO_URI',
    'STRIPE_API_KEY'
  ];

  requiredVars.forEach(key => {
    if (!process.env[key]) {
      console.error(`⚠️  Variable requerida en PRODUCCIÓN no configurada: ${key}`);
    }
  });

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'supersecret') {
    throw new Error(
      '🚨 SEGURIDAD CRÍTICA: JWT_SECRET no está configurado correctamente en producción!\n' +
      '   Configura una clave segura en tu variable de entorno JWT_SECRET'
    );
  }
}

module.exports = config;

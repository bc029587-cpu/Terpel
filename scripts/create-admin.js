'use strict';

/**
 * SCRIPT: create-admin.js
 * TIPO: Script de inicialización (NO es parte de la API)
 * DESCRIPCIÓn: Crea usuario admin por primera vez en la BD
 * USO: node scripts/create-admin.js (ejecutar una sola vez)
 * FLUJO: Cargar env → Conectar BD → Validar no exista → Hashear contraseña → Guardar → Cerrar conexión
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config'); // 🔑 Usar configuración centralizada

// Ajusta la ruta si cambia tu estructura
const User = require('../modules/users/user.model');

/**
 * FUNCIÓN: createAdmin()
 * DESCRIPCIÓN: Crea usuario administrador en la BD
 * FLUJO COMPLETO:
 *   1. Conecta a MongoDB
 *   2. Verifica que el usuario no exista
 *   3. Hashea la contraseña
 *   4. Crea documento User con role ADMIN
 *   5. Guarda en BD
 *   6. Cierra conexión
 * USUARIO CREADO: admin@terpel.com / 123456 (CAMBIAR DESPUÉS!)
 * EJECUCIÓN: Una sola vez en desarrollo inicial
 */
async function createAdmin() {
  try {
    /**
     * PASO 1: Conectar a MongoDB
     * RECIBE: URI de config.database
     * SALIDA: Conexión establecida o error
     */
    // 1. Conectar a MongoDB
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('✅ MongoDB conectado');

    /**
     * PASO 2: Verificar que el usuario no exista
     * RECIBE: Email 'admin@terpel.com'
     * VALIDA: Si existe, aborta script
     * SALIDA: Error o continuar
     */
    // 2. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@terpel.com' });
    if (existingUser) {
      console.log('⚠️  El usuario admin@terpel.com ya existe');
      process.exit(0);
    }

    /**
     * PASO 3: Hashear la contraseña
     * ENTRADA: '123456' (contraseña en texto plano)
     * PROCESO: bcrypt con 10 rounds (configurado)
     * SALIDA: Hash de +60 caracteres
     * SEGURIDAD: NUNCA guardar password en texto plano
     */
    // 3. Encriptar contraseña
    const passwordHash = await bcrypt.hash('123456', config.security.bcrypt.rounds);

    /**
     * PASO 4: Crear documento User
     * ENTRADA: {name, email, password (hasheado), role: 'ADMIN'}
     * SALIDA: Documento User creado listo para guardar
     */
    // 4. Crear usuario
    const admin = new User({
      name: 'Admin',
      email: 'admin@terpel.com',
      password: passwordHash,
      role: 'ADMIN'  // Rol de administrador
    });

    /**
     * PASO 5: Guardar en BD
     * PROCESO: Validación Mongoose → Inserta en MongoDB
     * SALIDA: Usuario guardado con _id asignado
     */
    // 5. Guardar en BD
    await admin.save();

    /**
     * PASO 6: Mostrar información y avisos de seguridad
     * SALIDA: Credenciales temporales impresas en consola
     * ADVERTENCIA: Usuario debe cambiar contraseña después del primer login
     */
    console.log('✅ Usuario ADMIN creado correctamente');
    console.log('   Email: admin@terpel.com');
    console.log('   Password: 123456');
    console.log('   Role: ADMIN');
    console.log('⚠️  Cambiar la contraseña después del primer login!');
    
    process.exit(0);

  /**
   * MANEJO DE ERRORES
   * Si falla cualquier paso, muestra error y termina proceso
   */
  /**\n   * MANEJO DE ERRORES\n   * Si falla cualquier paso, muestra error y termina proceso\n   */\n  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    process.exit(1);
  }
}

createAdmin();

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config'); // 🔑 Usar configuración centralizada

// Ajusta la ruta si cambia tu estructura
const User = require('../modules/users/user.model');

async function createAdmin() {
  try {
    // 1. Conectar a MongoDB
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('✅ MongoDB conectado');

    // 2. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@terpel.com' });
    if (existingUser) {
      console.log('⚠️  El usuario admin@terpel.com ya existe');
      process.exit(0);
    }

    // 3. Encriptar contraseña
    const passwordHash = await bcrypt.hash('123456', config.security.bcrypt.rounds);

    // 4. Crear usuario
    const admin = new User({
      name: 'Admin',
      email: 'admin@terpel.com',
      password: passwordHash,
      role: 'ADMIN'
    });

    // 5. Guardar en BD
    await admin.save();

    console.log('✅ Usuario ADMIN creado correctamente');
    console.log('   Email: admin@terpel.com');
    console.log('   Password: 123456');
    console.log('   Role: ADMIN');
    console.log('⚠️  Cambiar la contraseña después del primer login!');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario:', error.message);
    process.exit(1);
  }
}

createAdmin();

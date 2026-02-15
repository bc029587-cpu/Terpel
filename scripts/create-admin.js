'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Ajusta la ruta si cambia tu estructura
const User = require('../modules/users/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/terpel';

async function createAdmin() {
  try {
    // 1. Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado');

    // 2. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: 'admin@terpel.com' });
    if (existingUser) {
      console.log('⚠️ El usuario ya existe');
      process.exit(0);
    }

    // 3. Encriptar contraseña
    const passwordHash = await bcrypt.hash('123456', 10);

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
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    process.exit(1);
  }
}

createAdmin();

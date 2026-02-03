const mongoose = require('mongoose');
const logger = require('../utils/logger');

let authConnection = null;

const connectAuthDB = async () => {
  try {
    if (authConnection && authConnection.readyState === 1) {
      logger.info('✅ Auth DB ya conectada');
      return authConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_AUTH_URI || 'mongodb://localhost:27017/my-motiv-auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    authConnection = conn;
    logger.info(`✅ MongoDB Auth conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Auth:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Auth desconectado');
      authConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Auth:', error.message);
    throw error;
  }
};

const getAuthConnection = () => {
  if (!authConnection || authConnection.readyState !== 1) {
    throw new Error('Auth DB no está conectada');
  }
  return authConnection;
};

module.exports = {
  connectAuthDB,
  getAuthConnection
};

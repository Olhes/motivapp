const mongoose = require('mongoose');
const logger = require('../utils/logger');

let contentConnection = null;

const connectContentDB = async () => {
  try {
    if (contentConnection && contentConnection.readyState === 1) {
      logger.info('✅ Content DB ya conectada');
      return contentConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_CONTENT_URI || 'mongodb://localhost:27017/my-motiv-content', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    contentConnection = conn;
    logger.info(`✅ MongoDB Content conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Content:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Content desconectado');
      contentConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Content:', error.message);
    throw error;
  }
};

const getContentConnection = () => {
  if (!contentConnection || contentConnection.readyState !== 1) {
    throw new Error('Content DB no está conectada');
  }
  return contentConnection;
};

module.exports = {
  connectContentDB,
  getContentConnection
};

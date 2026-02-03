const mongoose = require('mongoose');
const logger = require('../utils/logger');

let mediaConnection = null;

const connectMediaDB = async () => {
  try {
    if (mediaConnection && mediaConnection.readyState === 1) {
      logger.info('✅ Media DB ya conectada');
      return mediaConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_MEDIA_URI || 'mongodb://localhost:27017/my-motiv-media', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mediaConnection = conn;
    logger.info(`✅ MongoDB Media conectado: ${conn.host}`);

    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Media:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Media desconectado');
      mediaConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Media:', error.message);
    throw error;
  }
};

const getMediaConnection = () => {
  if (!mediaConnection || mediaConnection.readyState !== 1) {
    throw new Error('Media DB no está conectada');
  }
  return mediaConnection;
};

module.exports = {
  connectMediaDB,
  getMediaConnection
};

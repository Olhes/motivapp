const mongoose = require('mongoose');
const logger = require('../utils/logger');

let themesConnection = null;

const connectThemesDB = async () => {
  try {
    if (themesConnection && themesConnection.readyState === 1) {
      logger.info('✅ Themes DB ya conectada');
      return themesConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_THEMES_URI || 'mongodb://localhost:27017/my-motiv-themes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    themesConnection = conn;
    logger.info(`✅ MongoDB Themes conectado: ${conn.host}`);

    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Themes:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Themes desconectado');
      themesConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Themes:', error.message);
    throw error;
  }
};

const getThemesConnection = () => {
  if (!themesConnection || themesConnection.readyState !== 1) {
    throw new Error('Themes DB no está conectada');
  }
  return themesConnection;
};

module.exports = {
  connectThemesDB,
  getThemesConnection
};

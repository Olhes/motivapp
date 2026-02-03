const mongoose = require('mongoose');
const logger = require('../utils/logger');

let categoriesConnection = null;

const connectCategoriesDB = async () => {
  try {
    if (categoriesConnection && categoriesConnection.readyState === 1) {
      logger.info('✅ Categories DB ya conectada');
      return categoriesConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_CATEGORIES_URI || 'mongodb://localhost:27017/my-motiv-categories', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    categoriesConnection = conn;
    logger.info(`✅ MongoDB Categories conectado: ${conn.host}`);

    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Categories:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Categories desconectado');
      categoriesConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Categories:', error.message);
    throw error;
  }
};

const getCategoriesConnection = () => {
  if (!categoriesConnection || categoriesConnection.readyState !== 1) {
    throw new Error('Categories DB no está conectada');
  }
  return categoriesConnection;
};

module.exports = {
  connectCategoriesDB,
  getCategoriesConnection
};

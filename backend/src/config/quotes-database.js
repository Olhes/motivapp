const mongoose = require('mongoose');
const logger = require('../utils/logger');

let quotesConnection = null;

const connectQuotesDB = async () => {
  try {
    if (quotesConnection && quotesConnection.readyState === 1) {
      logger.info('✅ Quotes DB ya conectada');
      return quotesConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_QUOTES_URI || 'mongodb://localhost:27017/my-motiv-quotes', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    quotesConnection = conn;
    logger.info(`✅ MongoDB Quotes conectado: ${conn.host}`);

    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Quotes:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Quotes desconectado');
      quotesConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Quotes:', error.message);
    throw error;
  }
};

const getQuotesConnection = () => {
  if (!quotesConnection || quotesConnection.readyState !== 1) {
    throw new Error('Quotes DB no está conectada');
  }
  return quotesConnection;
};

module.exports = {
  connectQuotesDB,
  getQuotesConnection
};

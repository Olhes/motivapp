import mongoose from 'mongoose';
import logger from '../utils/logger';

let quotesConnection: mongoose.Connection | null = null;

export const connectQuotesDB = async (): Promise<mongoose.Connection> => {
  try {
    if (quotesConnection && quotesConnection.readyState === 1) {
      logger.info('✅ Quotes DB ya conectada');
      return quotesConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_QUOTES_URI || 'mongodb://localhost:27017/my-motiv-quotes'
    );

    quotesConnection = conn;
    logger.info(`✅ MongoDB Quotes conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Quotes:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Quotes desconectado');
      quotesConnection = null;
    });

    return conn;

  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Quotes:', err.message);
    throw error;
  }
};

export const getQuotesConnection = (): mongoose.Connection => {
  if (!quotesConnection || quotesConnection.readyState !== 1) {
    throw new Error('Quotes DB no está conectada');
  }
  return quotesConnection;
};

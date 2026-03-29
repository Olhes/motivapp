import mongoose from 'mongoose';
import logger from '../utils/logger';

let categoriesConnection: mongoose.Connection | null = null;

export const connectCategoriesDB = async (): Promise<mongoose.Connection> => {
  try {
    if (categoriesConnection && categoriesConnection.readyState === 1) {
      logger.info('✅ Categories DB ya conectada');
      return categoriesConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_CATEGORIES_URI || 'mongodb://localhost:27017/my-motiv-categories'
    );

    categoriesConnection = conn;
    logger.info(`✅ MongoDB Categories conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Categories:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Categories desconectado');
      categoriesConnection = null;
    });

    return conn;

  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Categories:', err.message);
    throw error;
  }
};

export const getCategoriesConnection = (): mongoose.Connection => {
  if (!categoriesConnection || categoriesConnection.readyState !== 1) {
    throw new Error('Categories DB no está conectada');
  }
  return categoriesConnection;
};

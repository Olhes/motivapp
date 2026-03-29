import mongoose from 'mongoose';
import logger from '../utils/logger';

let authConnection: mongoose.Connection | null = null;

export const connectAuthDB = async (): Promise<mongoose.Connection> => {
  try {
    if (authConnection && authConnection.readyState === 1) {
      logger.info('✅ Auth DB ya conectada');
      return authConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_AUTH_URI || 'mongodb://localhost:27017/my-motiv-auth'
    );

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
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Auth:', err.message);
    throw error;
  }
};

export const getAuthConnection = (): mongoose.Connection => {
  if (!authConnection || authConnection.readyState !== 1) {
    throw new Error('Auth DB no está conectada');
  }
  return authConnection;
};

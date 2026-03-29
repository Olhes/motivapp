import mongoose from 'mongoose';
import logger from '../utils/logger';

let themesConnection: mongoose.Connection | null = null;

export const connectThemesDB = async (): Promise<mongoose.Connection> => {
  try {
    if (themesConnection && themesConnection.readyState === 1) {
      logger.info('✅ Themes DB ya conectada');
      return themesConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_THEMES_URI || 'mongodb://localhost:27017/my-motiv-themes'
    );

    themesConnection = conn;
    logger.info(`✅ MongoDB Themes conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Themes:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Themes desconectado');
      themesConnection = null;
    });

    return conn;

  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Themes:', err.message);
    throw error;
  }
};

export const getThemesConnection = (): mongoose.Connection => {
  if (!themesConnection || themesConnection.readyState !== 1) {
    throw new Error('Themes DB no está conectada');
  }
  return themesConnection;
};

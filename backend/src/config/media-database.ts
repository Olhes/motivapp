import mongoose from 'mongoose';
import logger from '../utils/logger';

let mediaConnection: mongoose.Connection | null = null;

export const connectMediaDB = async (): Promise<mongoose.Connection> => {
  try {
    if (mediaConnection && mediaConnection.readyState === 1) {
      logger.info('✅ Media DB ya conectada');
      return mediaConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_MEDIA_URI || 'mongodb://localhost:27017/my-motiv-media'
    );

    mediaConnection = conn;
    logger.info(`✅ MongoDB Media conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Media:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Media desconectado');
      mediaConnection = null;
    });

    return conn;

  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Media:', err.message);
    throw error;
  }
};

export const getMediaConnection = (): mongoose.Connection => {
  if (!mediaConnection || mediaConnection.readyState !== 1) {
    throw new Error('Media DB no está conectada');
  }
  return mediaConnection;
};

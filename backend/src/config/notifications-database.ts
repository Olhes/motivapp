import mongoose from 'mongoose';
import logger from '../utils/logger';

let notificationsConnection: mongoose.Connection | null = null;

export const connectNotificationsDB = async (): Promise<mongoose.Connection> => {
  try {
    if (notificationsConnection && notificationsConnection.readyState === 1) {
      logger.info('✅ Notifications DB ya conectada');
      return notificationsConnection;
    }

    const conn = await mongoose.createConnection(
      process.env.MONGODB_NOTIFICATIONS_URI || 'mongodb://localhost:27017/my-motiv-notifications'
    );

    notificationsConnection = conn;
    logger.info(`✅ MongoDB Notifications conectado: ${conn.host}`);

    // Manejar desconexión
    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Notifications:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Notifications desconectado');
      notificationsConnection = null;
    });

    return conn;

  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a MongoDB Notifications:', err.message);
    throw error;
  }
};

export const getNotificationsConnection = (): mongoose.Connection => {
  if (!notificationsConnection || notificationsConnection.readyState !== 1) {
    throw new Error('Notifications DB no está conectada');
  }
  return notificationsConnection;
};

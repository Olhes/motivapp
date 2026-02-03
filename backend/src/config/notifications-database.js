const mongoose = require('mongoose');
const logger = require('../utils/logger');

let notificationsConnection = null;

const connectNotificationsDB = async () => {
  try {
    if (notificationsConnection && notificationsConnection.readyState === 1) {
      logger.info('✅ Notifications DB ya conectada');
      return notificationsConnection;
    }

    const conn = await mongoose.createConnection(process.env.MONGODB_NOTIFICATIONS_URI || 'mongodb://localhost:27017/my-motiv-notifications', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    notificationsConnection = conn;
    logger.info(`✅ MongoDB Notifications conectado: ${conn.host}`);

    conn.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB Notifications:', err);
    });

    conn.on('disconnected', () => {
      logger.warn('⚠️ MongoDB Notifications desconectado');
      notificationsConnection = null;
    });

    return conn;

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB Notifications:', error.message);
    throw error;
  }
};

const getNotificationsConnection = () => {
  if (!notificationsConnection || notificationsConnection.readyState !== 1) {
    throw new Error('Notifications DB no está conectada');
  }
  return notificationsConnection;
};

module.exports = {
  connectNotificationsDB,
  getNotificationsConnection
};

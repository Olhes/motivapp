const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my-motiv', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB conectado: ${conn.connection.host}`);
    
    // Manejar desconexión
    mongoose.connection.on('error', (err) => {
      logger.error('❌ Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado');
    });

    // Cerrar conexión al terminar el proceso
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('🔌 MongoDB conexión cerrada');
      process.exit(0);
    });

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

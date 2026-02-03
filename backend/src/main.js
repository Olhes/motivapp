const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuraciones
const { connectAuthDB } = require('./config/auth-database');
const { connectCategoriesDB } = require('./config/categories-database');
const { connectQuotesDB } = require('./config/quotes-database');
const { connectMediaDB } = require('./config/media-database');
const { connectThemesDB } = require('./config/themes-database');
const { connectNotificationsDB } = require('./config/notifications-database');
const corsOptions = require('./config/cors');
const logger = require('./utils/logger');

// Importar rutas
const quotesRoutes = require('./modules/quotes/quotes.routes');
const authRoutes = require('./modules/auth/auth.routes');
const mediaRoutes = require('./modules/media/media.routes');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a bases de datos
const initializeDatabases = async () => {
  try {
    await connectAuthDB();
    await connectCategoriesDB();
    await connectQuotesDB();
    await connectMediaDB();
    await connectThemesDB();
    await connectNotificationsDB();
    logger.info('🗄️ Todas las bases de datos (6) conectadas exitosamente');
  } catch (error) {
    logger.error('❌ Error conectando a las bases de datos:', error.message);
    process.exit(1);
  }
};

initializeDatabases();

// Middleware global
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
})); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de 100 requests
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/quotes', quotesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🚀 My Motiv API - Backend Monolítico Modular',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      quotes: '/api/quotes',
      auth: '/api/auth',
      media: '/api/media',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `No se puede encontrar ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  logger.error('Error global:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
  logger.info(`📚 Documentación API: http://localhost:${PORT}/`);
  logger.info(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  logger.info('🔌 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('🔌 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

module.exports = app;

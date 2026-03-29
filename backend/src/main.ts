import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Importar configuraciones
import { connectAuthDB } from './config/auth-database';
import { connectCategoriesDB } from './config/categories-database';
import { connectQuotesDB } from './config/quotes-database';
import { connectMediaDB } from './config/media-database';
import { connectThemesDB } from './config/themes-database';
import { connectNotificationsDB } from './config/notifications-database';
import corsOptions from './config/cors';
import logger from './utils/logger';

// Importar rutas
import authRoutes from './modules/auth/auth.routes';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a bases de datos
const initializeDatabases = async (): Promise<void> => {
  try {
    await connectAuthDB();
    await connectCategoriesDB();
    await connectQuotesDB();
    await connectMediaDB();
    await connectThemesDB();
    await connectNotificationsDB();
    logger.info('🗄️ Todas las bases de datos (6) conectadas exitosamente');
  } catch (error) {
    const err = error as Error;
    logger.error('❌ Error conectando a las bases de datos:', err.message);
    process.exit(1);
  }
};

// Inicializar bases de datos
initializeDatabases();

// Middleware global
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // límite de 100 requests
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas API
app.use('/api/auth', authRoutes);
// app.use('/api/quotes', quotesRoutes);
// app.use('/api/media', mediaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'My Motiv Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      }
    }
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Manejo global de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Error no manejado:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;

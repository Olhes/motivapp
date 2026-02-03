# 📚 My Motiv Backend - Documentación Completa

## 🎯 Visión General

Backend monolítico modular para la aplicación My Motiv, diseñado con arquitectura escalable, múltiples bases de datos MongoDB y un sistema completo de logging y respuestas estandarizadas.

---

## 🏗️ Arquitectura del Sistema

### **Estructura de Directorios**
```
backend/
├── src/
│   ├── config/              # ⚙️ Configuración global
│   │   ├── auth-database.js     # Conexión BD Auth
│   │   ├── quotes-database.js   # Conexión BD Quotes
│   │   ├── categories-database.js # Conexión BD Categories
│   │   ├── media-database.js    # Conexión BD Media
│   │   ├── themes-database.js   # Conexión BD Themes
│   │   ├── notifications-database.js # Conexión BD Notifications
│   │   ├── cors.js              # Configuración CORS
│   │   └── auth.js              # Configuración JWT
│   │
│   ├── modules/             # 📦 Módulos de negocio
│   │   ├── auth/               # 🔐 Autenticación
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   └── quotes/             # 💬 Citas motivacionales
│   │       ├── quotes.controller.js
│   │       ├── quotes.service.js
│   │       ├── quotes.routes.js
│   │       └── quotes.validation.js
│   │
│   ├── models/              # 📊 Modelos de datos
│   │   ├── User.js
│   │   ├── Quote.js
│   │   ├── Category.js
│   │   ├── Media.js
│   │   ├── NotificationSetting.js
│   │   ├── ScheduledNotification.js
│   │   └── UserThemePreference.js
│   │
│   ├── middleware/          # 🛡️ Middleware global
│   │   └── auth.js              # Middleware de autenticación JWT
│   │
│   ├── utils/               # 🛠️ Utilidades compartidas
│   │   ├── logger.js           # Sistema de logging personalizado
│   │   └── response.js         # Utilidades de respuestas HTTP
│   │
│   ├── scripts/             # 📜 Scripts de base de datos
│   │   └── seed.js             # Poblado inicial de datos
│   │
│   └── main.js              # 🚀 Punto de entrada principal
│
├── logs/                   # 📝 Archivos de log
│   ├── app.log              # Todos los logs
│   ├── error.log            # Solo errores
│   └── access.log           # Logs de acceso
│
├── tests/                   # 🧪 Pruebas unitarias
└── package.json            # 📦 Dependencias del proyecto
```

---

## 🔧 Componentes Principales

### **1. Sistema de Multi-Bases de Datos**

**Arquitectura de 6 Bases de Datos MongoDB:**
- **Auth DB**: Usuarios y autenticación
- **Quotes DB**: Citas motivacionales
- **Categories DB**: Categorías de contenido
- **Media DB**: Archivos multimedia
- **Themes DB**: Temas y preferencias visuales
- **Notifications DB**: Sistema de notificaciones

**Ventajas:**
- ✅ Escalabilidad horizontal
- ✅ Aislamiento de datos
- ✅ Performance optimizada
- ✅ Mantenimiento simplificado

### **2. Sistema de Logging Personalizado**

**Archivo**: `src/utils/logger.js`

**Características:**
- **Niveles de log**: ERROR, WARN, INFO, DEBUG
- **Archivos separados**: `app.log`, `error.log`, `access.log`
- **Timestamps ISO 8601**
- **Salida dual**: Consola + Archivo
- **Creación automática de directorios**

**Uso:**
```javascript
const logger = require('../utils/logger');

logger.info('Usuario registrado exitosamente');
logger.error('Error de conexión a base de datos');
logger.warn('Intento de acceso no autorizado');
logger.debug('Variable interna: ', variable);
```

### **3. Sistema de Respuestas Estandarizadas**

**Archivo**: `src/utils/response.js`

**Formato de Respuesta:**
```javascript
// Respuesta exitosa
{
  "success": true,
  "data": { ... },
  "message": "Operación completada",
  "timestamp": "2024-01-01T00:00:00.000Z"
}

// Respuesta de error
{
  "success": false,
  "error": "Error detallado",
  "message": "Mensaje descriptivo",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Métodos Disponibles:**
```javascript
// Respuestas exitosas
successResponse(res, data, message, statusCode)
createdResponse(res, data, message)
noContentResponse(res, message)

// Respuestas de error
errorResponse(res, error, message, statusCode)
badRequestResponse(res, message, error)
unauthorizedResponse(res, message)
forbiddenResponse(res, message)
notFoundResponse(res, message)
conflictResponse(res, message)
```

---

## 🔌 API Endpoints

### **Autenticación (`/api/auth`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/register` | Registro de nuevo usuario | ❌ |
| POST | `/login` | Inicio de sesión | ❌ |
| POST | `/refresh` | Refrescar token JWT | ❌ |
| POST | `/logout` | Cerrar sesión | ✅ |

**Respuestas de Ejemplo:**
```javascript
// POST /api/auth/register
{
  "success": true,
  "data": {
    "user": {
      "id": "64a1b2c3d4e5f6789012345",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario creado exitosamente"
}
```

### **Citas (`/api/quotes`)**

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/` | Obtener todas las citas | ❌ |
| GET | `/random` | Cita aleatoria | ❌ |
| GET | `/:id` | Obtener cita por ID | ❌ |
| GET | `/category/:category` | Citas por categoría | ❌ |
| POST | `/` | Crear nueva cita | ✅ |
| PUT | `/:id` | Actualizar cita | ✅ |
| DELETE | `/:id` | Eliminar cita | ✅ |

**Ejemplos de Uso:**
```javascript
// GET /api/quotes/random
{
  "success": true,
  "data": {
    "id": "64a1b2c3d4e5f6789012345",
    "text": "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "author": "Robert Collier",
    "category": "motivacion",
    "tags": ["éxito", "esfuerzo", "constancia"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}

// GET /api/quotes/category/motivacion
{
  "success": true,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012345",
      "text": "El único modo de hacer un gran trabajo es amar lo que haces.",
      "author": "Steve Jobs",
      "category": "motivacion"
    }
  ],
  "count": 1
}
```

---

## 🗄️ Modelos de Datos

### **User Model**
```javascript
{
  _id: ObjectId,
  email: String (único),
  password: String (hash),
  name: String,
  profilePicture: String,
  preferences: {
    notifications: Boolean,
    theme: String,
    language: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **Quote Model**
```javascript
{
  _id: ObjectId,
  text: String (requerido),
  author: String (requerido),
  category: String (requerido),
  tags: [String],
  isPublic: Boolean,
  createdBy: ObjectId (ref: User),
  likes: Number,
  shares: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### **Category Model**
```javascript
{
  _id: ObjectId,
  name: String (único),
  description: String,
  color: String,
  icon: String,
  isActive: Boolean,
  createdAt: Date
}
```

---

## 🔐 Seguridad

### **Implementación de Seguridad**

**1. Autenticación JWT:**
- Access tokens (15 minutos)
- Refresh tokens (7 días)
- Almacenamiento seguro de tokens

**2. Middleware de Seguridad:**
```javascript
// Helmet - Headers de seguridad
app.use(helmet());

// CORS - Control de orígenes
app.use(cors(corsOptions));

// Rate Limiting - Prevención de abusos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por ventana
});
```

**3. Validación de Entrada:**
- Schema validation con Joi
- Sanitización de datos
- Prevención de inyección SQL

**4. Manejo de Errores:**
- Error handling global
- Logs detallados de errores
- Respuestas consistentes

---

## 🚀 Configuración y Despliegue

### **Variables de Entorno**

```bash
# Servidor
NODE_ENV=development
PORT=3000

# Base de Datos
MONGODB_AUTH_URI=mongodb://localhost:27017/my-motiv-auth
MONGODB_QUOTES_URI=mongodb://localhost:27017/my-motiv-quotes
MONGODB_CATEGORIES_URI=mongodb://localhost:27017/my-motiv-categories
MONGODB_MEDIA_URI=mongodb://localhost:27017/my-motiv-media
MONGODB_THEMES_URI=mongodb://localhost:27017/my-motiv-themes
MONGODB_NOTIFICATIONS_URI=mongodb://localhost:27017/my-motiv-notifications

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### **Scripts Disponibles**

```bash
# Desarrollo
npm run dev          # Iniciar con nodemon
npm start           # Iniciar en producción

# Testing
npm test            # Ejecutar tests
npm run test:coverage # Tests con cobertura

# Base de Datos
npm run seed        # Poblar datos iniciales
```

### **Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

---

## 📊 Monitoreo y Logs

### **Health Check**
```bash
GET /health
```

**Respuesta:**
```javascript
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "memory": {
    "rss": 50331648,
    "heapTotal": 20971520,
    "heapUsed": 15728640,
    "external": 1048576
  }
}
```

### **Sistema de Logs**

**Ubicación:** `logs/`

**Formato:**
```
[2024-01-01T12:00:00.000Z] INFO: MongoDB Auth conectado: localhost
[2024-01-01T12:00:01.000Z] ERROR: Error de conexión MongoDB Quotes: Connection refused
[2024-01-01T12:00:02.000Z] WARN: Intento de acceso no autorizado desde IP 192.168.1.100
```

**Rotación de Logs:**
- Configurar logrotate para producción
- Políticas de retención (30 días)
- Compresión de archivos antiguos

---

## 🧪 Testing

### **Estructura de Tests**
```
tests/
├── unit/                   # Tests unitarios
│   ├── models/
│   ├── services/
│   └── utils/
├── integration/            # Tests de integración
│   ├── auth/
│   └── quotes/
└── e2e/                   # Tests end-to-end
    └── api/
```

### **Ejemplo de Test**
```javascript
// tests/unit/services/auth.service.test.js
const authService = require('../../../src/modules/auth/auth.service');

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const result = await authService.register(userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe(userData.email);
    });
  });
});
```

---

## 🔮 Roadmap y Mejoras Futuras

### **Corto Plazo (1-2 meses)**
- [ ] Implementar OpenTelemetry para observabilidad
- [ ] Agregar sistema de caché con Redis
- [ ] Implementar WebSockets para notificaciones en tiempo real
- [ ] Agregar tests de carga y performance

### **Mediano Plazo (3-6 meses)**
- [ ] Migrar a microservicios
- [ ] Implementar GraphQL API
- [ ] Agregar sistema de archivos distribuido (S3)
- [ ] Implementar CI/CD pipeline

### **Largo Plazo (6+ meses)**
- [ ] Sistema de recomendación con ML
- [ ] Analytics y business intelligence
- [ ] Multi-tenancy para empresas
- [ ] Sistema de backup y recuperación

---

## 🤝 Contribución

### **Guía de Estilo**

**1. Convenciones de Código:**
- Usar camelCase para variables y funciones
- Usar PascalCase para clases y constructores
- Nombres descriptivos en español
- Comentarios en español

**2. Estructura de Archivos:**
- Importaciones al principio
- Funciones principales primero
- Exportaciones al final
- Máximo 100 líneas por función

**3. Mensajes de Commit:**
```
feat: agregar nueva funcionalidad de registro
fix: corregir error de validación de email
docs: actualizar documentación de API
refactor: optimizar consultas a base de datos
```

### **Proceso de Pull Request**

1. **Fork** del repositorio
2. **Crear branch** feature/nombre-funcionalidad
3. **Desarrollar** con tests incluidos
4. **Ejecutar** todos los tests
5. **Hacer commit** con mensajes claros
6. **Crear Pull Request** con descripción detallada
7. **Revisión** de código por equipo
8. **Merge** a main

---

## 📞 Soporte y Contacto

**Equipo de Desarrollo:**
- **Backend Lead**: [Nombre] - [email]
- **DevOps**: [Nombre] - [email]
- **QA**: [Nombre] - [email]

**Canales de Comunicación:**
- **Slack**: #my-motiv-backend
- **Jira**: Proyecto MYM-BACKEND
- **Documentation**: Confluence space

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para detalles completos.

---

**🚀 My Motiv Backend - Construyendo motivación, una API a la vez!**

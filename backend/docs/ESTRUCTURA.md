# 🏗️ Estructura Backend - My Motiv

## 📁 Estructura Completa

```
backend/
├── 📋 Archivos de configuración
│   ├── package.json              # 📦 Dependencias y scripts
│   ├── .env                     # 🔐 Variables de entorno
│   ├── .env.example              # 📋 Ejemplo de variables
│   ├── .gitignore                # 🚫 Archivos ignorados
│   ├── README.md                 # 📖 Documentación
│   └── ESTRUCTURA.md            # 📁 Este archivo
│
├── 📦 src/                      # Código fuente
│   ├── main.js                  # 🚀 Punto de entrada
│   │
│   ├── ⚙️ config/               # Configuración global
│   │   ├── database.js           # 🗄️ Conexión MongoDB
│   │   ├── auth.js               # 🔐 Config JWT
│   │   └── cors.js               # 🌐 Config CORS
│   │
│   ├── 📦 modules/              # Módulos independientes
│   │   ├── 💬 quotes/           # Módulo de citas
│   │   │   ├── quotes.controller.js
│   │   │   ├── quotes.service.js
│   │   │   ├── quotes.routes.js
│   │   │   └── quotes.validation.js
│   │   │
│   │   └── 🔐 auth/              # Módulo de autenticación
│   │       ├── auth.controller.js
│   │       ├── auth.service.js
│   │       ├── auth.routes.js
│   │       └── auth.validation.js
│   │
│   ├── 🛡️ middleware/            # Middleware global
│   │   └── auth.js               # 🔐 JWT middleware
│   │
│   ├── 📋 models/                # Modelos de datos
│   │   └── Quote.js              # 💬 Modelo de cita
│   │
│   ├── 🛠️ utils/                 # Utilidades compartidas
│   │   ├── logger.js              # 📝 Sistema de logs
│   │   └── response.js            # 📤 Formato de respuestas
│   │
│   ├── 📜 scripts/               # Scripts de base de datos
│   │   └── seed.js                # 🌱 Datos iniciales
│   │
│   └── 🧪 tests/                 # Testing (vacío por ahora)
│
├── 📚 docs/                    # Documentación (vacío por ahora)
├── 📝 logs/                    # Logs de la aplicación
├── 📁 uploads/                 # Archivos subidos
│   ├── .gitkeep                # Mantener carpeta en git
│   ├── images/                 # 🖼️ Imágenes
│   ├── videos/                 # 🎥 Videos
│   └── documents/              # 📄 Documentos
│
└── 📁 routes/                  # Rutas antiguas (migradas a modules)
    └── quotes.js               # 🔄 Migrado a modules/quotes
```

## 🎯 Principios de Arquitectura

### ✅ **Monolito Modular**
- Cada módulo es **independiente** y **autocontenido**
- **Separación de responsabilidades**: Controller → Service → Model
- **Configuración centralizada** en `src/config/`
- **Utilidades compartidas** en `src/utils/`

### 📦 **Estructura de Módulos**
Cada módulo contiene:
```
module/
├── controller.js    # 🎮 Lógica de la API
├── service.js       # ⚙️ Lógica de negocio
├── routes.js        # 🛣️ Rutas HTTP
├── model.js         # 📋 Modelo de datos
└── validation.js    # ✅ Validación de datos
```

## 🔌 Endpoints API

### 📝 **Citas (Quotes)**
```
GET    /api/quotes              # Todas las citas (paginado)
GET    /api/quotes/random         # Cita aleatoria
GET    /api/quotes/search         # Buscar citas
GET    /api/quotes/category/:cat # Citas por categoría
GET    /api/quotes/:id           # Cita por ID
POST   /api/quotes               # Crear cita (requiere auth)
PUT    /api/quotes/:id           # Actualizar cita (requiere auth)
DELETE /api/quotes/:id           # Eliminar cita (requiere auth)
```

### 🔐 **Autenticación (Auth)**
```
POST   /api/auth/register         # Registro de usuario
POST   /api/auth/login            # Inicio de sesión
POST   /api/auth/refresh          # Refrescar token
POST   /api/auth/logout           # Cerrar sesión
GET    /api/auth/profile          # Obtener perfil (requiere auth)
```

### 🏥 **Health Check**
```
GET    /                       # Información del API
GET    /health                  # Estado del servidor
```

## 🚀 **Scripts Disponibles**

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar tests
npm run seed        # Poblar base de datos
```

## 🔧 **Variables de Entorno**

```env
PORT=3000
MONGODB_AUTH_URI=mongodb://localhost:27017/my-motiv-auth
MONGODB_CATEGORIES_URI=mongodb://localhost:27017/my-motiv-categories
MONGODB_QUOTES_URI=mongodb://localhost:27017/my-motiv-quotes
MONGODB_MEDIA_URI=mongodb://localhost:27017/my-motiv-media
MONGODB_THEMES_URI=mongodb://localhost:27017/my-motiv-themes
MONGODB_NOTIFICATIONS_URI=mongodb://localhost:27017/my-motiv-notifications
JWT_SECRET=my-motiv-secret-key-2024
JWT_EXPIRE=7d
NODE_ENV=development
```

## 📊 **Flujo de Datos**

```
Request → Middleware → Routes → Controller → Service → Model → Database
   ↓           ↓          ↓          ↓         ↓         ↓
Validation  Auth      Business   Data     MongoDB
   ↓           ↓          ↓          ↓         ↓
Error      Token     Logic     Schema   Response
```

## 🎯 **Próximos Módulos a Implementar**

1. **👥 Users Module**
   - Gestión de perfiles
   - Configuración de usuario
   - Preferencias

2. **🔔 Notifications Module**
   - Notificaciones push
   - Recordatorios
   - Mensajes del sistema

3. **🖼️ Media Module**
   - Subida de imágenes
   - Gestión de archivos
   - CDN integration

## 🚀 **Para Empezar**

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar MongoDB
mongod

# 4. Poblar base de datos
npm run seed

# 5. Iniciar servidor
npm run dev
```

## 📱 **Conexión con Frontend**

El frontend (Flutter) se conectará a:
```
http://localhost:3000/api/quotes
http://localhost:3000/api/auth
```

## 🔮 **Escalabilidad**

Esta estructura permite:
- ✅ **Añadir nuevos módulos** fácilmente
- ✅ **Testing independiente** por módulo
- ✅ **Desarrollo paralelo** de features
- ✅ **Migración a microservicios** cuando sea necesario

---

**🚀 ¡Backend monolítico modular listo para desarrollar!**

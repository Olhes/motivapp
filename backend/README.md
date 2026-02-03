# 🚀 My Motiv Backend

Backend monolítico modular para la aplicación My Motiv.

## 🏗️ Arquitectura

```
src/
├── config/           # ⚙️ Configuración global
├── modules/          # 📦 Módulos independientes
│   ├── auth/         # 🔐 Autenticación
│   ├── quotes/       # 💬 Citas
│   ├── users/        # 👥 Usuarios
│   ├── notifications/ # 🔔 Notificaciones
│   └── media/        # 🖼️ Medios
├── middleware/       # 🛡️ Middleware global
├── utils/           # 🛠️ Utilidades compartidas
├── scripts/         # 📜 Scripts de base de datos
└── tests/           # 🧪 Testing
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 16+
- MongoDB 4.4+
- npm o yarn

### Instalación
```bash
# 1. Clonar repositorio
git clone <repositorio>
cd my_motiv_workspace/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Iniciar MongoDB
mongod

# 5. Poblar base de datos
npm run seed

# 6. Iniciar servidor
npm run dev
```

## 📋 Scripts Disponibles

```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo con nodemon
npm test           # Ejecutar tests
npm run seed        # Poblar base de datos con datos iniciales
```

## 🔌 Endpoints API

### Autenticación
```
POST /api/auth/register     # Registro de usuario
POST /api/auth/login        # Inicio de sesión
POST /api/auth/refresh     # Refrescar token
POST /api/auth/logout       # Cerrar sesión
```

### Citas
```
GET    /api/quotes           # Obtener todas las citas
GET    /api/quotes/random      # Cita aleatoria
GET    /api/quotes/:id        # Obtener cita por ID
POST   /api/quotes           # Crear nueva cita
PUT    /api/quotes/:id        # Actualizar cita
DELETE /api/quotes/:id        # Eliminar cita
GET    /api/quotes/category/:category # Citas por categoría
```

### Usuarios
```
GET    /api/users/profile     # Obtener perfil
PUT    /api/users/profile     # Actualizar perfil
DELETE /api/users/account     # Eliminar cuenta
```

### Notificaciones
```
GET    /api/notifications     # Obtener notificaciones
POST   /api/notifications     # Crear notificación
PUT    /api/notifications/:id # Marcar como leída
DELETE /api/notifications/:id # Eliminar notificación
```

## 🗄️ Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema(no_Existe_admin)
- **Quote**: Citas motivacionales
- **Notification**: Notificaciones de usuario
- **Media**: Archivos multimedia

### Relaciones
- User → Quotes (muchas a muchas)
- User → Notifications (uno a muchos)
- Quote → Media (uno a muchos)

## 🔐 Autenticación

- **JWT Tokens** para autenticación
- **Refresh Tokens** para mantener sesión
- **Password hashing** con bcrypt
- **Rate limiting** para prevenir ataques

## 🛡️ Seguridad

- **Helmet** para headers de seguridad
- **CORS** configurado para orígenes específicos
- **Rate limiting** para prevenir abusos
- **Input validation** con Joi
- **SQL Injection prevention** con Mongoose

## 📝 Logs

Los logs se guardan en la carpeta `logs/`:
- `app.log` - Todos los logs
- `error.log` - Solo errores
- `access.log` - Logs de acceso

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Variables de Entorno Producción
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://servidor-produccion:27017/my-motiv
JWT_SECRET=secreto-muy-seguro-produccion
```

### Docker
```bash
# Construir imagen
docker build -t my-motiv-backend .

# Ejecutar contenedor
docker run -p 3000:3000 my-motiv-backend
```

## 📊 Monitoreo

- **Health check**: `GET /health`
- **Metrics**: `GET /metrics`
- **Logs**: Ver carpeta `logs/`

## 🔧 Desarrollo

### Estructura de Módulos
Cada módulo contiene:
- `controller.js` - Lógica de la API
- `service.js` - Lógica de negocio
- `model.js` - Modelo de datos
- `routes.js` - Rutas HTTP
- `validation.js` - Validación de datos

### Agregar Nuevo Módulo
1. Crear carpeta en `src/modules/`
2. Crear archivos del módulo
3. Agregar rutas en `src/main.js`
4. Agregar tests en `src/tests/`

## 📝 Contribución

1. Fork del repositorio
2. Crear feature branch
3. Seguir convenciones de código
4. Agregar tests
5. Enviar Pull Request

## 📄 Licencia

MIT License - Ver archivo LICENSE

---

**🚀 ¡Listo para desarrollar!**

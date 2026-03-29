# 📱 Media API Documentation

## 🎯 Overview

API completa para gestión de archivos multimedia con sistema de favoritos, basada en los diagramas ER proporcionados.

---

## 🔌 Endpoints

### **📁 Rutas Públicas**

#### **Obtener Media Públicos**
```http
GET /api/media/public
```

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Resultados por página (default: 20, max: 100)
- `type` (string): Filtrar por tipo (image, video, audio, document)
- `sortBy` (string): Ordenar por (createdAt, favoritesCount, size, originalName)
- `sortOrder` (string): Dirección (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "media": [
      {
        "_id": "64a1b2c3d4e5f6789012345",
        "userId": {
          "_id": "64a1b2c3d4e5f6789012346",
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "originalName": "sunset.jpg",
        "filename": "unique_filename.jpg",
        "path": "/uploads/images/unique_filename.jpg",
        "mimeType": "image/jpeg",
        "size": 1234567,
        "type": "image",
        "isPublic": true,
        "isActive": true,
        "favoritesCount": 25,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### **Obtener Media Populares**
```http
GET /api/media/popular
```

**Query Parameters:**
- `page` (number): Página actual (default: 1)
- `limit` (number): Resultados por página (default: 20)
- `type` (string): Filtrar por tipo
- `minFavorites` (number): Mínimo de favoritos (default: 1)

#### **Obtener Media por ID**
```http
GET /api/media/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": {
      "_id": "64a1b2c3d4e5f6789012346",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    },
    "originalName": "sunset.jpg",
    "filename": "unique_filename.jpg",
    "path": "/uploads/images/unique_filename.jpg",
    "mimeType": "image/jpeg",
    "size": 1234567,
    "type": "image",
    "isPublic": true,
    "isActive": true,
    "favoritesCount": 25,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### **🔒 Rutas Protegidas (Requieren JWT)**

#### **Subir Media**
```http
POST /api/media
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "originalName": "sunset.jpg",
  "filename": "unique_filename.jpg",
  "path": "/uploads/images/unique_filename.jpg",
  "mimeType": "image/jpeg",
  "size": 1234567,
  "type": "image",
  "isPublic": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "userId": "64a1b2c3d4e5f6789012346",
    "originalName": "sunset.jpg",
    "filename": "unique_filename.jpg",
    "path": "/uploads/images/unique_filename.jpg",
    "mimeType": "image/jpeg",
    "size": 1234567,
    "type": "image",
    "isPublic": false,
    "isActive": true,
    "favoritesCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Media subido exitosamente"
}
```

#### **Obtener Mis Media**
```http
GET /api/media/my/media
Authorization: Bearer <token>
```

**Query Parameters:** Mismos que `/api/media/public`

#### **Eliminar Media**
```http
DELETE /api/media/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true
  },
  "message": "Media eliminado exitosamente"
}
```

---

### **❤️ Sistema de Favoritos**

#### **Marcar/Desmarcar Favorito**
```http
POST /api/media/:id/favorite
Authorization: Bearer <token>
```

**Response (Agregar):**
```json
{
  "success": true,
  "data": {
    "favorited": true
  },
  "message": "Agregado a favoritos"
}
```

**Response (Quitar):**
```json
{
  "success": true,
  "data": {
    "favorited": false
  },
  "message": "Eliminado de favoritos"
}
```

#### **Obtener Mis Favoritos**
```http
GET /api/media/my/favorites
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number): Página actual
- `limit` (number): Resultados por página
- `contentType` (string): Filtrar por tipo (quote, image, video, audio, document)

**Response:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "_id": "64a1b2c3d4e5f6789012347",
        "userId": "64a1b2c3d4e5f6789012346",
        "mediaId": {
          "_id": "64a1b2c3d4e5f6789012345",
          "originalName": "sunset.jpg",
          "path": "/uploads/images/unique_filename.jpg",
          "type": "image",
          "favoritesCount": 25,
          "userId": {
            "username": "john_doe",
            "firstName": "John"
          }
        },
        "contentType": "image",
        "isActive": true,
        "favoritedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### **Verificar si es Favorito**
```http
GET /api/media/:id/favorite/check
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorite": true
  }
}
```

---

## 🗄️ Estructura de Base de Datos

### **Media Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Referencia a User
  originalName: String,        // Nombre original del archivo
  filename: String,           // Nombre guardado
  path: String,               // Ruta del archivo
  mimeType: String,           // MIME type
  size: Number,               // Tamaño en bytes
  type: String,               // image, video, audio, document
  isPublic: Boolean,          // Visibilidad
  isActive: Boolean,          // Estado
  favoritesCount: Number,     // Contador denormalizado
  createdAt: Date,
  updatedAt: Date
}
```

### **Favorites Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // Usuario que marca favorito
  mediaId: ObjectId,          // Media marcado
  contentType: String,        // Tipo de contenido
  isActive: Boolean,          // Estado del favorito
  favoritedAt: Date,         // Cuándo se marcó
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔧 Validaciones

### **Tipos de Media Permitidos**
- `image`: Imágenes (jpg, png, gif, webp)
- `video`: Videos (mp4, avi, mov)
- `audio`: Audio (mp3, wav, ogg)
- `document`: Documentos (pdf, doc, txt)

### **Límites**
- Tamaño máximo: 10MB por archivo
- Límite de resultados: 100 por página
- Nombres: Máximo 255 caracteres

---

## 🚀 Ejemplos de Uso

### **JavaScript/Node.js**
```javascript
// Subir media
const uploadMedia = async (formData, token) => {
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  return response.json();
};

// Marcar favorito
const toggleFavorite = async (mediaId, token) => {
  const response = await fetch(`/api/media/${mediaId}/favorite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### **Flutter/Dart**
```dart
// Obtener media públicos
Future<List<Media>> getPublicMedia({int page = 1}) async {
  final response = await http.get(
    Uri.parse('https://api.example.com/api/media/public?page=$page'),
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return List<Media>.from(data['data']['media'].map((x) => Media.fromJson(x)));
  } else {
    throw Exception('Failed to load media');
  }
}

// Marcar favorito
Future<bool> toggleFavorite(String mediaId, String token) async {
  final response = await http.post(
    Uri.parse('https://api.example.com/api/media/$mediaId/favorite'),
    headers: {
      'Authorization': 'Bearer $token',
    },
  );
  
  if (response.statusCode == 200) {
    final data = json.decode(response.body);
    return data['data']['favorited'];
  } else {
    throw Exception('Failed to toggle favorite');
  }
}
```

---

## 📊 Métricas y Analytics

### **Endpoints Disponibles**
- Contador de favoritos por media
- Media más populares
- Estadísticas por usuario
- Tipos de media más comunes

### **Índices Optimizados**
- `userId + mediaId` (únicos para favoritos)
- `mediaId + isActive` (para conteos)
- `favoritesCount` (para populares)
- `type + isActive` (para filtrado)

---

## 🔒 Consideraciones de Seguridad

1. **Autenticación JWT** requerida para acciones privadas
2. **Validación de IDs** MongoDB ObjectId
3. **Sanitización de inputs** con Joi
4. **Rate limiting** aplicado globalmente
5. **Soft deletes** (isActive flag) en lugar de eliminación física

---

## 🚀 Próximas Mejoras

1. **Upload de archivos** con multer
2. **Resizing automático** de imágenes
3. **CDN integration** para media
4. **Streaming** para videos grandes
5. **Caching** con Redis
6. **WebSockets** para actualizaciones en tiempo real

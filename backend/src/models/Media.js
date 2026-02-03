const { connectMediaDB } = require('../config/media-database');

let mediaConnection = null;
let MediaModel = null;

const getMediaModel = async () => {
  if (!MediaModel) {
    mediaConnection = await connectMediaDB();
    
    const mediaSchema = new mediaConnection.Schema({
      userId: {
        type: mediaConnection.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      originalName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
      },
      filename: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
      },
      path: {
        type: String,
        required: true,
        trim: true
      },
      mimeType: {
        type: String,
        required: true,
        trim: true
      },
      size: {
        type: Number,
        required: true,
        min: 0
      },
      type: {
        type: String,
        enum: ['image', 'video', 'audio', 'document'],
        required: true
      },
      isPublic: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: true
      },
      // Contador de favoritos (denormalizado para mejor rendimiento)
      favoritesCount: {
        type: Number,
        default: 0,
        min: 0
      }
    }, {
      timestamps: true
    });

    // Índices
    mediaSchema.index({ userId: 1 });
    mediaSchema.index({ type: 1 });
    mediaSchema.index({ isActive: 1 });
    mediaSchema.index({ createdAt: -1 });
    mediaSchema.index({ mimeType: 1 });
    mediaSchema.index({ favoritesCount: -1 }); // Para ordenar por populares

    MediaModel = mediaConnection.model('Media', mediaSchema);
  }
  
  return MediaModel;
};

module.exports = getMediaModel;

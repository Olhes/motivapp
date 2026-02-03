const { connectMediaDB } = require('../config/media-database');

let mediaConnection = null;
let FavoriteModel = null;

const getFavoriteModel = async () => {
  if (!FavoriteModel) {
    mediaConnection = await connectMediaDB();
    
    const favoriteSchema = new mediaConnection.Schema({
      userId: {
        type: mediaConnection.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      mediaId: {
        type: mediaConnection.Schema.Types.ObjectId,
        ref: 'Media',
        required: true
      },
      contentType: {
        type: String,
        enum: ['quote', 'image', 'video', 'audio', 'document'],
        required: true,
        default: 'media'
      },
      isActive: {
        type: Boolean,
        default: true
      },
      // Para tracking de cuando se marcó como favorito
      favoritedAt: {
        type: Date,
        default: Date.now
      }
    }, {
      timestamps: true
    });

    // Índices compuestos para mejor rendimiento
    favoriteSchema.index({ userId: 1, mediaId: 1 }, { unique: true }); // Evita favoritos duplicados
    favoriteSchema.index({ userId: 1, isActive: 1 });
    favoriteSchema.index({ mediaId: 1, isActive: 1 });
    favoriteSchema.index({ contentType: 1, isActive: 1 });
    favoriteSchema.index({ favoritedAt: -1 });

    FavoriteModel = mediaConnection.model('Favorite', favoriteSchema);
  }
  
  return FavoriteModel;
};

module.exports = getFavoriteModel;

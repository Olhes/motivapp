const getMediaModel = require('../../models/Media');
const getFavoriteModel = require('../../models/Favorite');
const { successResponse, errorResponse, notFoundResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

class MediaService {
  // Subir nuevo media
  async uploadMedia(userId, mediaData) {
    try {
      const Media = await getMediaModel();
      
      const newMedia = new Media({
        userId,
        ...mediaData
      });

      await newMedia.save();
      
      logger.info(`Media uploaded successfully: ${newMedia._id} by user ${userId}`);
      return newMedia;
    } catch (error) {
      logger.error('Error uploading media:', error);
      throw error;
    }
  }

  // Obtener media por ID
  async getMediaById(mediaId, userId = null) {
    try {
      const Media = await getMediaModel();
      const media = await Media.findById(mediaId)
        .populate('userId', 'username firstName lastName avatar')
        .lean();

      if (!media) {
        throw new Error('Media not found');
      }

      // Si no es público, verificar permisos
      if (!media.isPublic && media.userId._id.toString() !== userId) {
        throw new Error('Access denied');
      }

      return media;
    } catch (error) {
      logger.error('Error getting media by ID:', error);
      throw error;
    }
  }

  // Obtener media de un usuario
  async getUserMedia(userId, options = {}) {
    try {
      const Media = await getMediaModel();
      const {
        page = 1,
        limit = 20,
        type = null,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query = { 
        userId,
        isActive: true 
      };

      if (type) {
        query.type = type;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const media = await Media.find(query)
        .populate('userId', 'username firstName lastName avatar')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Media.countDocuments(query);

      return {
        media,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting user media:', error);
      throw error;
    }
  }

  // Obtener media públicos
  async getPublicMedia(options = {}) {
    try {
      const Media = await getMediaModel();
      const {
        page = 1,
        limit = 20,
        type = null,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const query = { 
        isPublic: true,
        isActive: true 
      };

      if (type) {
        query.type = type;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const media = await Media.find(query)
        .populate('userId', 'username firstName lastName avatar')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Media.countDocuments(query);

      return {
        media,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting public media:', error);
      throw error;
    }
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(userId, mediaId) {
    try {
      const Media = await getMediaModel();
      const Favorite = await getFavoriteModel();

      // Verificar que el media existe
      const media = await Media.findById(mediaId);
      if (!media || !media.isActive) {
        throw new Error('Media not found or inactive');
      }

      // Buscar si ya existe el favorito
      const existingFavorite = await Favorite.findOne({
        userId,
        mediaId,
        isActive: true
      });

      if (existingFavorite) {
        // Desmarcar como favorito
        existingFavorite.isActive = false;
        await existingFavorite.save();

        // Decrementar contador
        await Media.findByIdAndUpdate(mediaId, {
          $inc: { favoritesCount: -1 }
        });

        logger.info(`User ${userId} unfavorited media ${mediaId}`);
        return { favorited: false };
      } else {
        // Marcar como favorito
        const favorite = new Favorite({
          userId,
          mediaId,
          contentType: media.type
        });
        await favorite.save();

        // Incrementar contador
        await Media.findByIdAndUpdate(mediaId, {
          $inc: { favoritesCount: 1 }
        });

        logger.info(`User ${userId} favorited media ${mediaId}`);
        return { favorited: true };
      }
    } catch (error) {
      logger.error('Error toggling favorite:', error);
      throw error;
    }
  }

  // Obtener favoritos de un usuario
  async getUserFavorites(userId, options = {}) {
    try {
      const Favorite = await getFavoriteModel();
      const {
        page = 1,
        limit = 20,
        contentType = null
      } = options;

      const query = { 
        userId,
        isActive: true 
      };

      if (contentType) {
        query.contentType = contentType;
      }

      const favorites = await Favorite.find(query)
        .populate({
          path: 'mediaId',
          match: { isActive: true },
          populate: {
            path: 'userId',
            select: 'username firstName lastName avatar'
          }
        })
        .sort({ favoritedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      // Filtrar media que no existen o están inactivos
      const validFavorites = favorites.filter(fav => fav.mediaId);

      const total = await Favorite.countDocuments(query);

      return {
        favorites: validFavorites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting user favorites:', error);
      throw error;
    }
  }

  // Verificar si un media es favorito
  async isFavorite(userId, mediaId) {
    try {
      const Favorite = await getFavoriteModel();
      const favorite = await Favorite.findOne({
        userId,
        mediaId,
        isActive: true
      }).lean();

      return !!favorite;
    } catch (error) {
      logger.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Eliminar media
  async deleteMedia(userId, mediaId) {
    try {
      const Media = await getMediaModel();
      const Favorite = await getFavoriteModel();

      const media = await Media.findOne({ _id: mediaId, userId });
      if (!media) {
        throw new Error('Media not found or access denied');
      }

      // Marcar como inactivo en lugar de eliminar
      media.isActive = false;
      await media.save();

      // Desactivar todos los favoritos relacionados
      await Favorite.updateMany(
        { mediaId, isActive: true },
        { isActive: false }
      );

      logger.info(`Media ${mediaId} deleted by user ${userId}`);
      return { deleted: true };
    } catch (error) {
      logger.error('Error deleting media:', error);
      throw error;
    }
  }

  // Obtener media populares
  async getPopularMedia(options = {}) {
    try {
      const Media = await getMediaModel();
      const {
        page = 1,
        limit = 20,
        type = null,
        minFavorites = 1
      } = options;

      const query = { 
        isPublic: true,
        isActive: true,
        favoritesCount: { $gte: minFavorites }
      };

      if (type) {
        query.type = type;
      }

      const media = await Media.find(query)
        .populate('userId', 'username firstName lastName avatar')
        .sort({ favoritesCount: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Media.countDocuments(query);

      return {
        media,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting popular media:', error);
      throw error;
    }
  }
}

module.exports = new MediaService();

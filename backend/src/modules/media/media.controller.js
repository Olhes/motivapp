const mediaService = require('./media.service');
const { successResponse, createdResponse, notFoundResponse, badRequestResponse, unauthorizedResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

class MediaController {
  // Subir nuevo media
  async uploadMedia(req, res) {
    try {
      const userId = req.user.id;
      const mediaData = req.body;

      // Validaciones básicas
      if (!mediaData.originalName || !mediaData.path || !mediaData.type) {
        return badRequestResponse(res, 'Faltan campos requeridos: originalName, path, type');
      }

      const media = await mediaService.uploadMedia(userId, mediaData);
      return createdResponse(res, media, 'Media subido exitosamente');
    } catch (error) {
      logger.error('Error en uploadMedia controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Obtener media por ID
  async getMediaById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;

      const media = await mediaService.getMediaById(id, userId);
      return successResponse(res, media);
    } catch (error) {
      if (error.message === 'Media not found') {
        return notFoundResponse(res, 'Media no encontrado');
      }
      if (error.message === 'Access denied') {
        return unauthorizedResponse(res, 'No tienes permiso para ver este media');
      }
      logger.error('Error en getMediaById controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Obtener media del usuario autenticado
  async getMyMedia(req, res) {
    try {
      const userId = req.user.id;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        type: req.query.type || null,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await mediaService.getUserMedia(userId, options);
      return successResponse(res, result);
    } catch (error) {
      logger.error('Error en getMyMedia controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Obtener media públicos
  async getPublicMedia(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        type: req.query.type || null,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await mediaService.getPublicMedia(options);
      return successResponse(res, result);
    } catch (error) {
      logger.error('Error en getPublicMedia controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Marcar/desmarcar como favorito
  async toggleFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await mediaService.toggleFavorite(userId, id);
      return successResponse(res, result, result.favorited ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (error) {
      if (error.message === 'Media not found or inactive') {
        return notFoundResponse(res, 'Media no encontrado o inactivo');
      }
      logger.error('Error en toggleFavorite controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Obtener favoritos del usuario
  async getMyFavorites(req, res) {
    try {
      const userId = req.user.id;
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        contentType: req.query.contentType || null
      };

      const result = await mediaService.getUserFavorites(userId, options);
      return successResponse(res, result);
    } catch (error) {
      logger.error('Error en getMyFavorites controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Verificar si es favorito
  async checkFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const isFavorite = await mediaService.isFavorite(userId, id);
      return successResponse(res, { isFavorite });
    } catch (error) {
      logger.error('Error en checkFavorite controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Eliminar media
  async deleteMedia(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await mediaService.deleteMedia(userId, id);
      return successResponse(res, result, 'Media eliminado exitosamente');
    } catch (error) {
      if (error.message === 'Media not found or access denied') {
        return notFoundResponse(res, 'Media no encontrado o no tienes permiso para eliminarlo');
      }
      logger.error('Error en deleteMedia controller:', error);
      return badRequestResponse(res, error.message);
    }
  }

  // Obtener media populares
  async getPopularMedia(req, res) {
    try {
      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        type: req.query.type || null,
        minFavorites: parseInt(req.query.minFavorites) || 1
      };

      const result = await mediaService.getPopularMedia(options);
      return successResponse(res, result);
    } catch (error) {
      logger.error('Error en getPopularMedia controller:', error);
      return badRequestResponse(res, error.message);
    }
  }
}

module.exports = new MediaController();

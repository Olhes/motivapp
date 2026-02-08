const express = require('express');
const mediaController = require('./media.controller');
const { authMiddleware } = require('../../middleware/auth');
const { validateUploadMedia, validateQuery, validateObjectId } = require('./media.validation');

const router = express.Router();

// Rutas públicas
router.get('/public', validateQuery, mediaController.getPublicMedia);
router.get('/popular', validateQuery, mediaController.getPopularMedia);
router.get('/:id', validateObjectId, mediaController.getMediaById);

// Rutas protegidas (requieren autenticación)
router.use(authMiddleware); // Todas las rutas de aquí hacia abajo requieren auth

// Media del usuario
router.get('/my/media', validateQuery, mediaController.getMyMedia);
router.post('/', validateUploadMedia, mediaController.uploadMedia);
router.delete('/:id', validateObjectId, mediaController.deleteMedia);

// Favoritos
router.post('/:id/favorite', validateObjectId, mediaController.toggleFavorite);
router.get('/my/favorites', validateQuery, mediaController.getMyFavorites);
router.get('/:id/favorite/check', validateObjectId, mediaController.checkFavorite);

module.exports = router;

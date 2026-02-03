const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');

// Rutas públicas
router.post('/register', 
  authValidation.validateRegister, 
  authController.register
);

router.post('/login', 
  authValidation.validateLogin, 
  authController.login
);

router.post('/refresh', 
  authValidation.validateRefreshToken, 
  authController.refreshToken
);

// Rutas protegidas
router.post('/logout', 
  authValidation.validateLogout, 
  authController.logout
);

router.get('/profile', 
  require('../../middleware/auth').authMiddleware, 
  authController.getProfile
);

module.exports = router;

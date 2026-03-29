import { Router, Request, Response, NextFunction } from 'express';
import authController from './auth.controller';
import authValidation from './auth.validation';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

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
  authMiddleware, 
  authController.getProfile
);

export default router;

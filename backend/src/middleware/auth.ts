import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token no proporcionado'
    });
    return;
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const err = error as Error;
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: err.message
    });
  }
};

const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      // Si el token es inválido, continuamos sin usuario
      next();
    }
  } else {
    next();
  }
};

export {
  authMiddleware,
  optionalAuth
};

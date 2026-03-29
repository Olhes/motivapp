import { Request, Response } from 'express';
import authService from './auth.service.mongodb';
import { successResponse, createdResponse, unauthorizedResponse, badRequestResponse, errorResponse } from '../../utils/response';
import logger from '../../utils/logger';

// Registro de usuario
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      badRequestResponse(res, 'Usuario, email y contraseña son requeridos');
      return;
    }
    
    const result = await authService.register({ username, email, password });
    
    if ('error' in result) {
      badRequestResponse(res, result.error);
      return;
    }
    
    createdResponse(res, result.user, 'Usuario registrado exitosamente');
  } catch (error) {
    const err = error as Error;
    logger.error('Error en registro:', err.message);
    errorResponse(res, err.message, 'Error en registro');
  }
};

// Inicio de sesión
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      badRequestResponse(res, 'Email y contraseña son requeridos');
      return;
    }
    
    const result = await authService.login(email, password);
    
    if ('error' in result) {
      unauthorizedResponse(res, result.error);
      return;
    }
    
    successResponse(res, result, 'Inicio de sesión exitoso');
  } catch (error) {
    const err = error as Error;
    logger.error('Error en login:', err.message);
    errorResponse(res, err.message, 'Error en inicio de sesión');
  }
};

// Refrescar token
const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      badRequestResponse(res, 'Refresh token es requerido');
      return;
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    if ('error' in result) {
      unauthorizedResponse(res, result.error);
      return;
    }
    
    successResponse(res, result, 'Token refrescado exitosamente');
  } catch (error) {
    const err = error as Error;
    logger.error('Error refrescando token:', err.message);
    errorResponse(res, err.message, 'Error refrescando token');
  }
};

// Cerrar sesión
const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      badRequestResponse(res, 'Refresh token es requerido');
      return;
    }
    
    await authService.logout(refreshToken);
    
    successResponse(res, null, 'Sesión cerrada exitosamente');
  } catch (error) {
    const err = error as Error;
    logger.error('Error en logout:', err.message);
    errorResponse(res, err.message, 'Error cerrando sesión');
  }
};

// Obtener perfil de usuario
const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      unauthorizedResponse(res, 'Usuario no encontrado');
      return;
    }
    
    const user = await authService.getProfile(userId);
    
    if (!user) {
      unauthorizedResponse(res, 'Usuario no encontrado');
      return;
    }
    
    successResponse(res, user, 'Perfil obtenido exitosamente');
  } catch (error) {
    const err = error as Error;
    logger.error('Error obteniendo perfil:', err.message);
    errorResponse(res, err.message, 'Error obteniendo perfil');
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};

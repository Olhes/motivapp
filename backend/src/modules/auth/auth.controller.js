const authService = require('./auth.service');
const { successResponse, createdResponse, unauthorizedResponse, badRequestResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// Registro de usuario
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return badRequestResponse(res, 'Usuario, email y contraseña son requeridos');
    }
    
    const result = await authService.register({ username, email, password });
    
    if (result.error) {
      return badRequestResponse(res, result.error);
    }
    
    createdResponse(res, result.user, 'Usuario registrado exitosamente');
  } catch (error) {
    logger.error('Error en registro:', error.message);
    errorResponse(res, error.message, 'Error en registro');
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return badRequestResponse(res, 'Email y contraseña son requeridos');
    }
    
    const result = await authService.login(email, password);
    
    if (result.error) {
      return unauthorizedResponse(res, result.error);
    }
    
    successResponse(res, result, 'Inicio de sesión exitoso');
  } catch (error) {
    logger.error('Error en login:', error.message);
    errorResponse(res, error.message, 'Error en inicio de sesión');
  }
};

// Refrescar token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return badRequestResponse(res, 'Refresh token es requerido');
    }
    
    const result = await authService.refreshToken(refreshToken);
    
    if (result.error) {
      return unauthorizedResponse(res, result.error);
    }
    
    successResponse(res, result, 'Token refrescado exitosamente');
  } catch (error) {
    logger.error('Error refrescando token:', error.message);
    errorResponse(res, error.message, 'Error refrescando token');
  }
};

// Cerrar sesión
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return badRequestResponse(res, 'Refresh token es requerido');
    }
    
    await authService.logout(refreshToken);
    
    successResponse(res, null, 'Sesión cerrada exitosamente');
  } catch (error) {
    logger.error('Error en logout:', error.message);
    errorResponse(res, error.message, 'Error cerrando sesión');
  }
};

// Obtener perfil de usuario
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    
    if (!user) {
      return unauthorizedResponse(res, 'Usuario no encontrado');
    }
    
    successResponse(res, user, 'Perfil obtenido exitosamente');
  } catch (error) {
    logger.error('Error obteniendo perfil:', error.message);
    errorResponse(res, error.message, 'Error obteniendo perfil');
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};

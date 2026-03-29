import bcrypt from 'bcryptjs';
import { generateToken, verifyToken, JWTPayload } from '../../config/auth';
import logger from '../../utils/logger';
import { getUserModel } from '../../models/User';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface LoginResponse {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: UserWithoutPassword;
}

export interface ErrorResponse {
  error: string;
}

// Refresh tokens en memoria (en producción usar Redis)
let refreshTokens: string[] = [];

// Registro de usuario con MongoDB
export const register = async (userData: { username: string; email: string; password: string }): Promise<RegisterResponse | ErrorResponse> => {
  try {
    const UserModel = await getUserModel();
    
    // Verificar si el usuario ya existe en MongoDB
    const existingUser = await UserModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    });
    
    if (existingUser) {
      return { error: 'El usuario o email ya existe' };
    }

    // Crear nuevo usuario en MongoDB
    const newUser = new UserModel({
      username: userData.username,
      email: userData.email,
      password: userData.password, // Se encriptará automáticamente con el pre-save hook
    });

    await newUser.save();
    logger.info(`Usuario registrado en MongoDB: ${userData.email}`);

    // Retornar usuario sin contraseña
    const userWithoutPassword = newUser.toPublicJSON();
    return { user: userWithoutPassword };
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en register service (MongoDB):', err.message);
    throw new Error('Error registrando usuario');
  }
};

// Login de usuario con MongoDB
export const login = async (email: string, password: string): Promise<LoginResponse | ErrorResponse> => {
  try {
    const UserModel = await getUserModel();
    
    // Buscar usuario por email en MongoDB
    const user = await UserModel.findOne({ email });
    if (!user) {
      return { error: 'Credenciales inválidas' };
    }

    // Verificar contraseña
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return { error: 'Credenciales inválidas' };
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar tokens
    const payload: JWTPayload = {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateToken({ ...payload, type: 'refresh' });

    // Guardar refresh token
    refreshTokens.push(refreshToken);

    logger.info(`Usuario login (MongoDB): ${email}`);

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en login service (MongoDB):', err.message);
    throw new Error('Error en inicio de sesión');
  }
};

// Refrescar token
export const refreshToken = async (refreshTokenString: string): Promise<{ accessToken: string } | ErrorResponse> => {
  try {
    // Verificar si el refresh token existe
    const tokenExists = refreshTokens.includes(refreshTokenString);
    if (!tokenExists) {
      return { error: 'Refresh token inválido' };
    }

    // Verificar token
    const decoded = verifyToken(refreshTokenString);
    if (decoded.type !== 'refresh') {
      return { error: 'Token inválido' };
    }

    // Generar nuevo access token
    const payload: JWTPayload = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    const newAccessToken = generateToken(payload);

    return { accessToken: newAccessToken };
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en refreshToken service:', err.message);
    return { error: 'Refresh token inválido' };
  }
};

// Logout
export const logout = async (refreshTokenString: string): Promise<void> => {
  try {
    // Eliminar refresh token
    refreshTokens = refreshTokens.filter(token => token !== refreshTokenString);
    logger.info('Usuario logout');
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en logout service:', err.message);
    throw new Error('Error cerrando sesión');
  }
};

// Obtener perfil de usuario con MongoDB
export const getProfile = async (userId: string): Promise<UserWithoutPassword | null> => {
  try {
    const UserModel = await getUserModel();
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return null;
    }

    // Retornar usuario sin contraseña
    const userWithoutPassword = user.toPublicJSON();
    return userWithoutPassword;
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en getProfile service (MongoDB):', err.message);
    throw new Error('Error obteniendo perfil');
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};

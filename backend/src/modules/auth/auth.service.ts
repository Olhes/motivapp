import bcrypt from 'bcryptjs';
import { generateToken, verifyToken, JWTPayload } from '../../config/auth';
import logger from '../../utils/logger';

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

// Usuarios mock (en producción usar base de datos)
let users: User[] = [];
let refreshTokens: string[] = [];

// Simular base de datos de usuarios
const initializeUsers = (): void => {
  // Usuario de prueba
  const hashedPassword = bcrypt.hashSync('Admin123', 10);
  users.push({
    id: '1',
    username: 'admin',
    email: 'admin@mymotiv.com',
    password: hashedPassword,
    createdAt: new Date()
  });
};

// Inicializar si no hay usuarios
if (users.length === 0) {
  initializeUsers();
}

// Registro de usuario
export const register = async (userData: { username: string; email: string; password: string }): Promise<RegisterResponse | ErrorResponse> => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      return { error: 'El usuario o email ya existe' };
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Crear nuevo usuario
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);
    logger.info(`Usuario registrado: ${userData.email}`);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en register service:', err.message);
    throw new Error('Error registrando usuario');
  }
};

// Login de usuario
export const login = async (email: string, password: string): Promise<LoginResponse | ErrorResponse> => {
  try {
    // Buscar usuario por email
    const user = users.find(u => u.email === email);
    if (!user) {
      return { error: 'Credenciales inválidas' };
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Credenciales inválidas' };
    }

    // Generar tokens
    const payload: JWTPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    const accessToken = generateToken(payload);
    const refreshToken = generateToken({ ...payload, type: 'refresh' });

    // Guardar refresh token
    refreshTokens.push(refreshToken);

    logger.info(`Usuario login: ${email}`);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      accessToken,
      refreshToken
    };
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en login service:', err.message);
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

// Obtener perfil de usuario
export const getProfile = async (userId: string): Promise<UserWithoutPassword | null> => {
  try {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return null;
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
    
  } catch (error) {
    const err = error as Error;
    logger.error('Error en getProfile service:', err.message);
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

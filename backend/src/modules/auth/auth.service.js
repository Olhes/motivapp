const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../../config/auth');
const logger = require('../../utils/logger');

// Usuarios mock (en producción usar base de datos)
let users = [];
let refreshTokens = [];

// Simular base de datos de usuarios
const initializeUsers = () => {
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
const register = async ({ username, email, password }) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return { error: 'El usuario o email ya existe' };
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);
    logger.info(`Usuario registrado: ${email}`);

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword };
    
  } catch (error) {
    logger.error('Error en register service:', error.message);
    throw new Error('Error registrando usuario');
  }
};

// Login de usuario
const login = async (email, password) => {
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
    const payload = {
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
        email: user.email
      },
      accessToken,
      refreshToken
    };
    
  } catch (error) {
    logger.error('Error en login service:', error.message);
    throw new Error('Error en inicio de sesión');
  }
};

// Refrescar token
const refreshToken = async (refreshToken) => {
  try {
    // Verificar si el refresh token existe
    const tokenExists = refreshTokens.includes(refreshToken);
    if (!tokenExists) {
      return { error: 'Refresh token inválido' };
    }

    // Verificar token
    const decoded = verifyToken(refreshToken);
    if (decoded.type !== 'refresh') {
      return { error: 'Token inválido' };
    }

    // Generar nuevo access token
    const payload = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };

    const newAccessToken = generateToken(payload);

    return { accessToken: newAccessToken };
    
  } catch (error) {
    logger.error('Error en refreshToken service:', error.message);
    return { error: 'Refresh token inválido' };
  }
};

// Logout
const logout = async (refreshToken) => {
  try {
    // Eliminar refresh token
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    logger.info('Usuario logout');
    
  } catch (error) {
    logger.error('Error en logout service:', error.message);
    throw new Error('Error cerrando sesión');
  }
};

// Obtener perfil de usuario
const getProfile = async (userId) => {
  try {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return null;
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
    
  } catch (error) {
    logger.error('Error en getProfile service:', error.message);
    throw new Error('Error obteniendo perfil');
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
};

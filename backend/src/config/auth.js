const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'my-motiv-secret-key-2024';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generar token JWT
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

// Verificar token JWT
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

// Decodificar token sin verificar (para información básica)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  JWT_SECRET,
  JWT_EXPIRE,
};

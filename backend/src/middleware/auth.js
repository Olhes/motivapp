const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  const token = req.header('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token no proporcionado'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-motiv-secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido',
      message: error.message
    });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.header('authorization')?.replace('Bearer ', '');
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my-motiv-secret');
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

module.exports = {
  authMiddleware,
  optionalAuth
};

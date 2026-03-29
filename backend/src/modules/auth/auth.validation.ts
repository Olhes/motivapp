import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { badRequestResponse } from '../../utils/response';

// Validación para registro
const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'El usuario solo puede contener letras y números',
        'string.min': 'El usuario debe tener al menos 3 caracteres',
        'string.max': 'El usuario no puede exceder 30 caracteres',
        'any.required': 'El usuario es requerido'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es requerido'
      }),
    
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede exceder 128 caracteres',
        'any.required': 'La contraseña es requerida'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    badRequestResponse(res, errorMessage);
    return;
  }
  
  next();
};

// Validación para login
const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El email debe ser válido',
        'any.required': 'El email es requerido'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es requerida'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    badRequestResponse(res, errorMessage);
    return;
  }
  
  next();
};

// Validación para refresh token
const validateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'El refresh token es requerido'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    badRequestResponse(res, errorMessage);
    return;
  }
  
  next();
};

// Validación para logout
const validateLogout = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'El refresh token es requerido'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    badRequestResponse(res, errorMessage);
    return;
  }
  
  next();
};

export default {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateLogout,
};

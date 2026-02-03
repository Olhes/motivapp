const Joi = require('joi');
const { badRequestResponse } = require('../../utils/response');

// Validación para crear cita
const validateCreateQuote = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        'string.min': 'El texto debe tener al menos 10 caracteres',
        'string.max': 'El texto no puede exceder 500 caracteres',
        'any.required': 'El texto es requerido'
      }),
    
    author: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El autor debe tener al menos 2 caracteres',
        'string.max': 'El autor no puede exceder 100 caracteres',
        'any.required': 'El autor es requerido'
      }),
    
    category: Joi.string()
      .valid('Éxito', 'Motivación', 'Trabajo', 'Sueños', 'Futuro', 'General')
      .default('General')
      .messages({
        'any.only': 'La categoría debe ser una de: Éxito, Motivación, Trabajo, Sueños, Futuro, General'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    return badRequestResponse(res, errorMessage);
  }
  
  next();
};

// Validación para actualizar cita
const validateUpdateQuote = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string()
      .min(10)
      .max(500)
      .optional()
      .messages({
        'string.min': 'El texto debe tener al menos 10 caracteres',
        'string.max': 'El texto no puede exceder 500 caracteres'
      }),
    
    author: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .messages({
        'string.min': 'El autor debe tener al menos 2 caracteres',
        'string.max': 'El autor no puede exceder 100 caracteres'
      }),
    
    category: Joi.string()
      .valid('Éxito', 'Motivación', 'Trabajo', 'Sueños', 'Futuro', 'General')
      .optional()
      .messages({
        'any.only': 'La categoría debe ser una de: Éxito, Motivación, Trabajo, Sueños, Futuro, General'
      }),
    
    isFavorite: Joi.boolean()
      .optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details[0].message;
    return badRequestResponse(res, errorMessage);
  }
  
  next();
};

// Validación de parámetros de consulta
const validateQueryParams = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'La página debe ser un número',
        'number.integer': 'La página debe ser un entero',
        'number.min': 'La página debe ser mayor a 0'
      }),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
      .messages({
        'number.base': 'El límite debe ser un número',
        'number.integer': 'El límite debe ser un entero',
        'number.min': 'El límite debe ser mayor a 0',
        'number.max': 'El límite no puede exceder 100'
      }),
    
    category: Joi.string()
      .optional()
      .messages({
        'string.base': 'La categoría debe ser un texto'
      })
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    const errorMessage = error.details[0].message;
    return badRequestResponse(res, errorMessage);
  }
  
  req.query = value;
  next();
};

module.exports = {
  validateCreateQuote,
  validateUpdateQuote,
  validateQueryParams,
};

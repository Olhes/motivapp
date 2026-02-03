const Joi = require('joi');

// Validación para subir media
const uploadMediaSchema = Joi.object({
  originalName: Joi.string().required().max(255).messages({
    'string.empty': 'El nombre original es requerido',
    'string.max': 'El nombre original no puede exceder 255 caracteres',
    'any.required': 'El nombre original es requerido'
  }),
  
  filename: Joi.string().required().max(255).messages({
    'string.empty': 'El filename es requerido',
    'string.max': 'El filename no puede exceder 255 caracteres',
    'any.required': 'El filename es requerido'
  }),
  
  path: Joi.string().required().messages({
    'string.empty': 'La ruta es requerida',
    'any.required': 'La ruta es requerida'
  }),
  
  mimeType: Joi.string().required().messages({
    'string.empty': 'El MIME type es requerido',
    'any.required': 'El MIME type es requerido'
  }),
  
  size: Joi.number().required().min(0).messages({
    'number.base': 'El tamaño debe ser un número',
    'number.min': 'El tamaño no puede ser negativo',
    'any.required': 'El tamaño es requerido'
  }),
  
  type: Joi.string().valid('image', 'video', 'audio', 'document').required().messages({
    'any.only': 'El tipo debe ser: image, video, audio o document',
    'any.required': 'El tipo es requerido'
  }),
  
  isPublic: Joi.boolean().default(false).messages({
    'boolean.base': 'isPublic debe ser un booleano'
  })
});

// Validación para parámetros de query
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page debe ser un número',
    'number.integer': 'Page debe ser un entero',
    'number.min': 'Page debe ser mayor a 0'
  }),
  
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    'number.base': 'Limit debe ser un número',
    'number.integer': 'Limit debe ser un entero',
    'number.min': 'Limit debe ser mayor a 0',
    'number.max': 'Limit no puede exceder 100'
  }),
  
  type: Joi.string().valid('image', 'video', 'audio', 'document').messages({
    'any.only': 'El tipo debe ser: image, video, audio o document'
  }),
  
  sortBy: Joi.string().valid('createdAt', 'favoritesCount', 'size', 'originalName').default('createdAt').messages({
    'any.only': 'sortBy debe ser: createdAt, favoritesCount, size u originalName'
  }),
  
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
    'any.only': 'sortOrder debe ser: asc o desc'
  }),
  
  contentType: Joi.string().valid('quote', 'image', 'video', 'audio', 'document').messages({
    'any.only': 'contentType debe ser: quote, image, video, audio o document'
  }),
  
  minFavorites: Joi.number().integer().min(0).default(1).messages({
    'number.base': 'minFavorites debe ser un número',
    'number.integer': 'minFavorites debe ser un entero',
    'number.min': 'minFavorites no puede ser negativo'
  })
});

// Validación para ID de MongoDB
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
  'string.pattern.base': 'ID inválido'
});

// Middleware de validación
const validateUploadMedia = (req, res, next) => {
  const { error } = uploadMediaSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

const validateQuery = (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message,
      timestamp: new Date().toISOString()
    });
  }
  next();
};

const validateObjectId = (req, res, next) => {
  const { error } = objectIdSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'ID de media inválido',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

module.exports = {
  validateUploadMedia,
  validateQuery,
  validateObjectId,
  uploadMediaSchema,
  querySchema,
  objectIdSchema
};

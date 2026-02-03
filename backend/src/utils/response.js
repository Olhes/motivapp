// Formato estándar de respuestas API
const createResponse = (success, data = null, message = '', statusCode = 200, error = null) => {
  const response = {
    success,
    timestamp: new Date().toISOString(),
  };

  if (success) {
    response.data = data;
    if (message) response.message = message;
  } else {
    response.error = error || message;
    response.message = message;
  }

  return response;
};

// Respuestas exitosas
const successResponse = (res, data, message = '', statusCode = 200) => {
  return res.status(statusCode).json(createResponse(true, data, message, statusCode));
};

const createdResponse = (res, data, message = 'Recurso creado exitosamente') => {
  return res.status(201).json(createResponse(true, data, message, 201));
};

const noContentResponse = (res, message = 'Operación exitosa') => {
  return res.status(204).json(createResponse(true, null, message, 204));
};

// Respuestas de error
const errorResponse = (res, error, message = 'Error interno del servidor', statusCode = 500) => {
  return res.status(statusCode).json(createResponse(false, null, message, statusCode, error));
};

const badRequestResponse = (res, message = 'Solicitud inválida', error = null) => {
  return res.status(400).json(createResponse(false, null, message, 400, error));
};

const unauthorizedResponse = (res, message = 'No autorizado') => {
  return res.status(401).json(createResponse(false, null, message, 401));
};

const forbiddenResponse = (res, message = 'Acceso prohibido') => {
  return res.status(403).json(createResponse(false, null, message, 403));
};

const notFoundResponse = (res, message = 'Recurso no encontrado') => {
  return res.status(404).json(createResponse(false, null, message, 404));
};

const conflictResponse = (res, message = 'Conflicto de datos') => {
  return res.status(409).json(createResponse(false, null, message, 409));
};

module.exports = {
  createResponse,
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
};

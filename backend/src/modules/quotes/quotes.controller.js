const quotesService = require('./quotes.service');
const { successResponse, createdResponse, notFoundResponse, badRequestResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// Obtener todas las citas
const getAllQuotes = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const quotes = await quotesService.getAllQuotes(page, limit, category);
    
    successResponse(res, quotes, 'Citas obtenidas exitosamente');
  } catch (error) {
    logger.error('Error obteniendo citas:', error.message);
    errorResponse(res, error.message, 'Error obteniendo citas');
  }
};

// Obtener cita aleatoria
const getRandomQuote = async (req, res) => {
  try {
    const quote = await quotesService.getRandomQuote();
    
    if (!quote) {
      return notFoundResponse(res, 'No se encontraron citas');
    }
    
    successResponse(res, quote, 'Cita aleatoria obtenida');
  } catch (error) {
    logger.error('Error obteniendo cita aleatoria:', error.message);
    errorResponse(res, error.message, 'Error obteniendo cita aleatoria');
  }
};

// Obtener cita por ID
const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await quotesService.getQuoteById(id);
    
    if (!quote) {
      return notFoundResponse(res, 'Cita no encontrada');
    }
    
    successResponse(res, quote, 'Cita obtenida exitosamente');
  } catch (error) {
    logger.error('Error obteniendo cita:', error.message);
    errorResponse(res, error.message, 'Error obteniendo cita');
  }
};

// Crear nueva cita
const createQuote = async (req, res) => {
  try {
    const { text, author, category } = req.body;
    
    if (!text || !author) {
      return badRequestResponse(res, 'Texto y autor son requeridos');
    }
    
    const quote = await quotesService.createQuote({ text, author, category });
    createdResponse(res, quote, 'Cita creada exitosamente');
  } catch (error) {
    logger.error('Error creando cita:', error.message);
    errorResponse(res, error.message, 'Error creando cita');
  }
};

// Actualizar cita
const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const quote = await quotesService.updateQuote(id, updateData);
    
    if (!quote) {
      return notFoundResponse(res, 'Cita no encontrada');
    }
    
    successResponse(res, quote, 'Cita actualizada exitosamente');
  } catch (error) {
    logger.error('Error actualizando cita:', error.message);
    errorResponse(res, error.message, 'Error actualizando cita');
  }
};

// Eliminar cita
const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await quotesService.deleteQuote(id);
    
    if (!deleted) {
      return notFoundResponse(res, 'Cita no encontrada');
    }
    
    successResponse(res, null, 'Cita eliminada exitosamente');
  } catch (error) {
    logger.error('Error eliminando cita:', error.message);
    errorResponse(res, error.message, 'Error eliminando cita');
  }
};

// Obtener citas por categoría
const getQuotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const quotes = await quotesService.getQuotesByCategory(category, page, limit);
    
    successResponse(res, quotes, `Citas de categoría "${category}" obtenidas`);
  } catch (error) {
    logger.error('Error obteniendo citas por categoría:', error.message);
    errorResponse(res, error.message, 'Error obteniendo citas por categoría');
  }
};

// Buscar citas
const searchQuotes = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return badRequestResponse(res, 'Término de búsqueda es requerido');
    }
    
    const quotes = await quotesService.searchQuotes(q, page, limit);
    
    successResponse(res, quotes, `Resultados para "${q}"`);
  } catch (error) {
    logger.error('Error buscando citas:', error.message);
    errorResponse(res, error.message, 'Error buscando citas');
  }
};

module.exports = {
  getAllQuotes,
  getRandomQuote,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuotesByCategory,
  searchQuotes,
};

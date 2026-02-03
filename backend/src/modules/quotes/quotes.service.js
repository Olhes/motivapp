const Quote = require('../../models/Quote');
const logger = require('../../utils/logger');

// Obtener todas las citas con paginación
const getAllQuotes = async (page = 1, limit = 20, category = null) => {
  try {
    const skip = (page - 1) * limit;
    const query = category ? { category } : {};
    
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Quote.countDocuments(query);
    
    return {
      data: quotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error en getAllQuotes service:', error.message);
    throw new Error('Error obteniendo citas');
  }
};

// Obtener cita aleatoria
const getRandomQuote = async () => {
  try {
    const count = await Quote.countDocuments();
    
    if (count === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(randomIndex).lean();
    
    return quote;
  } catch (error) {
    logger.error('Error en getRandomQuote service:', error.message);
    throw new Error('Error obteniendo cita aleatoria');
  }
};

// Obtener cita por ID
const getQuoteById = async (id) => {
  try {
    const quote = await Quote.findById(id).lean();
    return quote;
  } catch (error) {
    logger.error('Error en getQuoteById service:', error.message);
    throw new Error('Error obteniendo cita por ID');
  }
};

// Crear nueva cita
const createQuote = async (quoteData) => {
  try {
    const quote = new Quote(quoteData);
    await quote.save();
    return quote.toObject();
  } catch (error) {
    logger.error('Error en createQuote service:', error.message);
    throw new Error('Error creando cita');
  }
};

// Actualizar cita
const updateQuote = async (id, updateData) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).lean();
    
    return quote;
  } catch (error) {
    logger.error('Error en updateQuote service:', error.message);
    throw new Error('Error actualizando cita');
  }
};

// Eliminar cita
const deleteQuote = async (id) => {
  try {
    const result = await Quote.findByIdAndDelete(id);
    return result !== null;
  } catch (error) {
    logger.error('Error en deleteQuote service:', error.message);
    throw new Error('Error eliminando cita');
  }
};

// Obtener citas por categoría
const getQuotesByCategory = async (category, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    
    const quotes = await Quote.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Quote.countDocuments({ category });
    
    return {
      data: quotes,
      category,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error en getQuotesByCategory service:', error.message);
    throw new Error('Error obteniendo citas por categoría');
  }
};

// Buscar citas por texto
const searchQuotes = async (searchTerm, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const regex = new RegExp(searchTerm, 'i');
    
    const quotes = await Quote.find({
      $or: [
        { text: { $regex: regex } },
        { author: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Quote.countDocuments({
      $or: [
        { text: { $regex: regex } },
        { author: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    });
    
    return {
      data: quotes,
      searchTerm,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error en searchQuotes service:', error.message);
    throw new Error('Error buscando citas');
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

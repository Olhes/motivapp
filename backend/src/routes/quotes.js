const express = require('express');
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');

const router = express.Router();

// GET todas las citas
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: quotes,
      total: quotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo citas',
      message: error.message
    });
  }
});

// GET cita aleatoria
router.get('/random', async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    
    const quote = await Quote.findOne({ _id: random });
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'No se encontraron citas'
      });
    }
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo cita aleatoria',
      message: error.message
    });
  }
});

// GET citas por categoría
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const quotes = await Quote.find({ category })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: quotes,
      category,
      total: quotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error obteniendo citas por categoría',
      message: error.message
    });
  }
});

// POST nueva cita
router.post('/', auth, async (req, res) => {
  try {
    const { text, author, category } = req.body;
    
    if (!text || !author) {
      return res.status(400).json({
        success: false,
        error: 'Texto y autor son requeridos'
      });
    }
    
    const quote = new Quote({
      text,
      author,
      category: category || 'General'
    });
    
    await quote.save();
    
    res.status(201).json({
      success: true,
      data: quote,
      message: 'Cita creada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error creando cita',
      message: error.message
    });
  }
});

// PUT actualizar cita
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author, category } = req.body;
    
    const quote = await Quote.findById(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }
    
    if (text) quote.text = text;
    if (author) quote.author = author;
    if (category) quote.category = category;
    
    await quote.save();
    
    res.json({
      success: true,
      data: quote,
      message: 'Cita actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error actualizando cita',
      message: error.message
    });
  }
});

// DELETE cita
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const quote = await Quote.findByIdAndDelete(id);
    
    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error eliminando cita',
      message: error.message
    });
  }
});

module.exports = router;

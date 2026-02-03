const express = require('express');
const router = express.Router();
const quotesController = require('./quotes.controller');
const authMiddleware = require('../../middleware/auth');
const quotesValidation = require('./quotes.validation');

// Rutas públicas
router.get('/', quotesController.getAllQuotes);
router.get('/random', quotesController.getRandomQuote);
router.get('/search', quotesController.searchQuotes);
router.get('/category/:category', quotesController.getQuotesByCategory);
router.get('/:id', quotesController.getQuoteById);

// Rutas protegidas (requieren autenticación)
router.post('/', 
  authMiddleware.authMiddleware, 
  quotesValidation.validateCreateQuote, 
  quotesController.createQuote
);

router.put('/:id', 
  authMiddleware.authMiddleware, 
  quotesValidation.validateUpdateQuote, 
  quotesController.updateQuote
);

router.delete('/:id', 
  authMiddleware.authMiddleware, 
  quotesController.deleteQuote
);

module.exports = router;

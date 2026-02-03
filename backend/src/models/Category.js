const { connectCategoriesDB } = require('../config/categories-database');

let categoriesConnection = null;
let CategoryModel = null;

const getCategoryModel = async () => {
  if (!CategoryModel) {
    categoriesConnection = await connectCategoriesDB();
    
    const categorySchema = new categoriesConnection.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  color: {
    type: String,
    required: true,
    match: /^#[0-9A-F]{6}$/i, // Formato hexadecimal de color
    default: '#6366f1'
  },
  icon: {
    type: String,
    trim: true,
    maxlength: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  quoteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Método para incrementar contador de frases
categorySchema.methods.incrementQuoteCount = function() {
  this.quoteCount += 1;
  return this.save();
};

// Método para decrementar contador de frases
categorySchema.methods.decrementQuoteCount = function() {
  if (this.quoteCount > 0) {
    this.quoteCount -= 1;
  }
  return this.save();
};

// Índices
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

    CategoryModel = categoriesConnection.model('Category', categorySchema);
  }
  
  return CategoryModel;
};

module.exports = getCategoryModel;

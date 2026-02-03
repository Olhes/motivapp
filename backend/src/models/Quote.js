const { connectQuotesDB } = require('../config/quotes-database');

let quotesConnection = null;
let QuoteModel = null;

const getQuoteModel = async () => {
  if (!QuoteModel) {
    quotesConnection = await connectQuotesDB();
    
    const quoteSchema = new quotesConnection.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  author: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: quotesConnection.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: quotesConnection.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  mediaId: {
    type: quotesConnection.Schema.Types.ObjectId,
    ref: 'Media',
    default: null
  },
  contentType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio'],
    default: 'text'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  views: {
    type: Number,
    default: 0
  },
  favoritesCount: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: quotesConnection.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Método para incrementar vistas
quoteSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Método para agregar/quitar like
quoteSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  } else {
    this.likes.push({ user: userId });
  }
  
  return this.save();
};

// Índices
quoteSchema.index({ category: 1 });
quoteSchema.index({ user: 1 });
quoteSchema.index({ isPublic: 1 });
quoteSchema.index({ isActive: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ author: 1 });
quoteSchema.index({ tags: 1 });

    QuoteModel = quotesConnection.model('Quote', quoteSchema);
  }
  
  return QuoteModel;
};

module.exports = getQuoteModel;

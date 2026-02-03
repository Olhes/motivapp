const bcrypt = require('bcryptjs');
const { connectAuthDB } = require('../config/auth-database');

let authConnection = null;
let UserModel = null;

const getUserModel = async () => {
  if (!UserModel) {
    authConnection = await connectAuthDB();
    
    const userSchema = new authConnection.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      firstName: {
        type: String,
        trim: true,
        maxlength: 50
      },
      lastName: {
        type: String,
        trim: true,
        maxlength: 50
      },
      avatar: {
        type: String,
        default: null
      },
      preferences: {
        favoriteCategories: [{
          type: authConnection.Schema.Types.ObjectId,
          ref: 'Category'
        }],
        dailyReminder: {
          enabled: { type: Boolean, default: false },
          time: { type: String, default: '09:00' }
        },
        theme: {
          type: String,
          enum: ['light', 'dark', 'auto'],
          default: 'auto'
        }
      },
      stats: {
        quotesRead: { type: Number, default: 0 },
        quotesFavorited: { type: Number, default: 0 },
        streak: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now }
      },
      isActive: {
        type: Boolean,
        default: true
      },
      lastLogin: {
        type: Date,
        default: null
      }
    }, {
      timestamps: true
    });

    // Encriptar password antes de guardar
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      } catch (error) {
        next(error);
      }
    });

    // Método para comparar passwords
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };

    // Método para obtener información pública del usuario
    userSchema.methods.toPublicJSON = function() {
      const user = this.toObject();
      delete user.password;
      return user;
    };

    // Índices
    userSchema.index({ email: 1 });
    userSchema.index({ username: 1 });
    userSchema.index({ createdAt: -1 });

    UserModel = authConnection.model('User', userSchema);
  }
  
  return UserModel;
};

module.exports = getUserModel;

const { connectThemesDB } = require('../config/themes-database');

let themesConnection = null;
let UserThemePreferenceModel = null;

const getUserThemePreferenceModel = async () => {
  if (!UserThemePreferenceModel) {
    themesConnection = await connectThemesDB();
    
    const userThemePreferenceSchema = new themesConnection.Schema({
      userId: {
        type: themesConnection.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
      },
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      customSettings: {
        primaryColor: {
          type: String,
          default: '#6366f1'
        },
        secondaryColor: {
          type: String,
          default: '#8b5cf6'
        },
        backgroundColor: {
          type: String,
          default: '#ffffff'
        },
        textColor: {
          type: String,
          default: '#000000'
        },
        fontSize: {
          type: String,
          enum: ['small', 'medium', 'large'],
          default: 'medium'
        }
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }, {
      timestamps: true
    });

    // Índices
    userThemePreferenceSchema.index({ userId: 1 });
    userThemePreferenceSchema.index({ theme: 1 });
    userThemePreferenceSchema.index({ isActive: 1 });

    UserThemePreferenceModel = themesConnection.model('UserThemePreference', userThemePreferenceSchema);
  }
  
  return UserThemePreferenceModel;
};

module.exports = getUserThemePreferenceModel;

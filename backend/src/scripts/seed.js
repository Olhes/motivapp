const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Importar conexiones modulares
const { connectAuthDB, getAuthConnection } = require('../config/auth-database');
const { connectCategoriesDB, getCategoriesConnection } = require('../config/categories-database');
const { connectQuotesDB, getQuotesConnection } = require('../config/quotes-database');
const { connectMediaDB, getMediaConnection } = require('../config/media-database');
const { connectThemesDB, getThemesConnection } = require('../config/themes-database');
const { connectNotificationsDB, getNotificationsConnection } = require('../config/notifications-database');

// Importar modelos
const Quote = require('../models/Quote');

// Datos iniciales de citas
const initialQuotes = [
  {
    text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    author: 'Robert Collier',
    category: 'Éxito',
    isFavorite: false
  },
  {
    text: 'No cuentes los días, haz que los días cuenten.',
    author: 'Muhammad Ali',
    category: 'Motivación',
    isFavorite: false
  },
  {
    text: 'El único modo de hacer un gran trabajo es amar lo que haces.',
    author: 'Steve Jobs',
    category: 'Trabajo',
    isFavorite: false
  },
  {
    text: 'Si puedes soñarlo, puedes lograrlo.',
    author: 'Walt Disney',
    category: 'Sueños',
    isFavorite: false
  },
  {
    text: 'La mejor manera de predecir el futuro es crearlo.',
    author: 'Peter Drucker',
    category: 'Futuro',
    isFavorite: false
  },
  {
    text: 'El fracaso es la oportunidad de comenzar de nuevo, pero con más experiencia.',
    author: 'Henry Ford',
    category: 'Éxito',
    isFavorite: false
  },
  {
    text: 'La única limitación que tienes es la que te pones tú mismo.',
    author: 'Anónimo',
    category: 'Motivación',
    isFavorite: false
  },
  {
    text: 'El trabajo duro supera al talento cuando el talento no trabaja duro.',
    author: 'Tim Notke',
    category: 'Trabajo',
    isFavorite: false
  },
  {
    text: 'Todos tus sueños pueden hacerse realidad si tienes el coraje de perseguirlos.',
    author: 'Walt Disney',
    category: 'Sueños',
    isFavorite: false
  },
  {
    text: 'El futuro pertenece a quienes creen en la belleza de sus sueños.',
    author: 'Eleanor Roosevelt',
    category: 'Futuro',
    isFavorite: false
  }
];

// Función para poblar la base de datos
const seedDatabase = async () => {
  try {
    // Conectar a todas las bases de datos modulares
    await connectAuthDB();
    await connectCategoriesDB();
    await connectQuotesDB();
    await connectMediaDB();
    await connectThemesDB();
    await connectNotificationsDB();
    
    logger.info('🗄️ Todas las bases de datos conectadas');
    
    // Limpiar colección de quotes
    await Quote.deleteMany({});
    logger.info('🗑️ Colección de quotes limpiada');
    
    // Insertar citas iniciales
    const insertedQuotes = await Quote.insertMany(initialQuotes);
    logger.info(`🌱 ${insertedQuotes.length} citas insertadas exitosamente`);
    
    // Mostrar algunas citas insertadas
    logger.info('📝 Ejemplos de citas insertadas:');
    insertedQuotes.slice(0, 3).forEach((quote, index) => {
      logger.info(`${index + 1}. "${quote.text}" - ${quote.author}`);
    });
    
    logger.info('✅ Base de datos poblada exitosamente');
    process.exit(0);
    
  } catch (error) {
    logger.error('❌ Error poblando la base de datos:', error.message);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

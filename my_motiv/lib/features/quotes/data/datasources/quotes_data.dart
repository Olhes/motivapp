import '../../domain/entities/quote.dart';

class QuotesRepository {
  // Lista de frases motivacionales
  final List<Quote> _quotes = [
    Quote(
      id: '1',
      text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
      author: 'Robert Collier',
      category: 'Éxito',
    ),
    Quote(
      id: '2',
      text: 'No cuentes los días, haz que los días cuenten.',
      author: 'Muhammad Ali',
      category: 'Motivación',
    ),
    Quote(
      id: '3',
      text: 'El único modo de hacer un gran trabajo es amar lo que haces.',
      author: 'Steve Jobs',
      category: 'Trabajo',
    ),
    Quote(
      id: '4',
      text: 'Si puedes soñarlo, puedes lograrlo.',
      author: 'Walt Disney',
      category: 'Sueños',
    ),
    Quote(
      id: '5',
      text: 'La mejor manera de predecir el futuro es crearlo.',
      author: 'Peter Drucker',
      category: 'Futuro',
    ),
    Quote(
      id: '6',
      text:
          'El fracaso es la oportunidad de comenzar de nuevo, pero con más experiencia.',
      author: 'Henry Ford',
      category: 'Superación',
    ),
    Quote(
      id: '7',
      text: 'No esperes. El momento nunca será el adecuado.',
      author: 'Napoleon Hill',
      category: 'Acción',
    ),
    Quote(
      id: '8',
      text:
          'La vida es lo que pasa mientras estás ocupado haciendo otros planes.',
      author: 'John Lennon',
      category: 'Vida',
    ),
    Quote(
      id: '9',
      text: 'El conocimiento es poder.',
      author: 'Francis Bacon',
      category: 'Conocimiento',
    ),
    Quote(
      id: '10',
      text: 'La mejor venganza es un éxito masivo.',
      author: 'Frank Sinatra',
      category: 'Éxito',
    ),
  ];

  // Obtener una cita aleatoria (optimizado)
  Quote getRandomQuote() {
    return _quotes[DateTime.now().millisecondsSinceEpoch % _quotes.length];
  }

  // Obtener todas las citas
  List<Quote> getAllQuotes() {
    return List.from(_quotes);
  }

  // Obtener citas favoritas
  List<Quote> getFavoriteQuotes() {
    return _quotes.where((quote) => quote.isFavorite).toList();
  }

  // Marcar una cita como favorita
  void toggleFavorite(Quote quote, bool isFavorite) {
    final index = _quotes.indexWhere(
      (q) => q.text == quote.text && q.author == quote.author,
    );
    if (index != -1) {
      _quotes[index] = _quotes[index].copyWith(isFavorite: isFavorite);
    }
  }

  // Buscar citas por categoría
  List<Quote> getQuotesByCategory(String category) {
    return _quotes.where((quote) => quote.category == category).toList();
  }

  // Obtener todas las categorías únicas
  List<String> getAllCategories() {
    final categories = _quotes.map((quote) => quote.category).toSet().toList();
    categories.sort();
    return categories;
  }
}

// Instancia global del repositorio para facilitar el acceso
final quotesRepository = QuotesRepository();

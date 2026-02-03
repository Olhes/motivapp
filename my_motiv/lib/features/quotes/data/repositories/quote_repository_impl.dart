import 'dart:math';
import '../../domain/entities/quote.dart';
import '../../domain/repositories/quote_repository.dart';
import '../../../../core/storage/local_storage.dart';
import '../../../../core/errors/app_exceptions.dart';

class QuoteRepositoryImpl implements QuoteRepository {
  final LocalStorage _localStorage;
  final List<Quote> _defaultQuotes = [
    Quote(
      id: '1',
      text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
      author: 'Robert Collier',
    ),
    Quote(
      id: '2',
      text: 'El único modo de hacer un gran trabajo es amar lo que haces.',
      author: 'Steve Jobs',
    ),
    Quote(
      id: '3',
      text: 'No esperes. El momento nunca será perfecto.',
      author: 'Napoleon Hill',
    ),
    Quote(
      id: '4',
      text: 'El futuro pertenece a quienes creen en la belleza de sus sueños.',
      author: 'Eleanor Roosevelt',
    ),
    Quote(
      id: '5',
      text:
          'La única limitación en nuestra vida es la que nosotros mismos imponemos.',
      author: 'Brian Tracy',
    ),
  ];

  QuoteRepositoryImpl(this._localStorage);

  @override
  Future<List<Quote>> getAllQuotes() async {
    try {
      final savedQuotes = await _localStorage.getObject('quotes');
      if (savedQuotes != null) {
        return (savedQuotes['quotes'] as List)
            .map(
              (json) => Quote(
                id: json['id'],
                text: json['text'],
                author: json['author'],
                isFavorite: json['isFavorite'] ?? false,
              ),
            )
            .cast<Quote>()
            .toList();
      }
      return _defaultQuotes;
    } catch (e) {
      throw StorageException(
        'Error obteniendo todas las citas: ${e.toString()}',
      );
    }
  }

  @override
  Future<Quote> getRandomQuote() async {
    try {
      final quotes = await getAllQuotes();
      if (quotes.isEmpty) {
        throw StorageException('No hay citas disponibles');
      }

      final random = Random();
      return quotes[random.nextInt(quotes.length)];
    } catch (e) {
      throw StorageException(
        'Error obteniendo cita aleatoria: ${e.toString()}',
      );
    }
  }

  @override
  Future<List<Quote>> getFavoriteQuotes() async {
    try {
      final quotes = await getAllQuotes();
      return quotes.where((quote) => quote.isFavorite).toList();
    } catch (e) {
      throw StorageException(
        'Error obteniendo citas favoritas: ${e.toString()}',
      );
    }
  }

  @override
  Future<void> toggleFavorite(String quoteId, bool isFavorite) async {
    try {
      final quotes = await getAllQuotes();
      final updatedQuotes = quotes.map((quote) {
        if (quote.id == quoteId) {
          return quote.copyWith(isFavorite: isFavorite);
        }
        return quote;
      }).toList();

      await _saveQuotes(updatedQuotes);
    } catch (e) {
      throw StorageException('Error cambiando favorito: ${e.toString()}');
    }
  }

  @override
  Future<void> addQuote(Quote quote) async {
    try {
      final quotes = await getAllQuotes();
      quotes.add(quote);
      await _saveQuotes(quotes);
    } catch (e) {
      throw StorageException('Error agregando cita: ${e.toString()}');
    }
  }

  @override
  Future<void> removeQuote(String quoteId) async {
    try {
      final quotes = await getAllQuotes();
      quotes.removeWhere((quote) => quote.id == quoteId);
      await _saveQuotes(quotes);
    } catch (e) {
      throw StorageException('Error eliminando cita: ${e.toString()}');
    }
  }

  Future<void> _saveQuotes(List<Quote> quotes) async {
    final quotesJson = {
      'quotes': quotes
          .map(
            (quote) => {
              'id': quote.id,
              'text': quote.text,
              'author': quote.author,
              'isFavorite': quote.isFavorite,
            },
          )
          .toList(),
    };
    await _localStorage.saveObject('quotes', quotesJson);
  }
}

import '../entities/quote.dart';

abstract class QuoteRepository {
  Future<List<Quote>> getAllQuotes();
  Future<Quote> getRandomQuote();
  Future<List<Quote>> getFavoriteQuotes();
  Future<void> toggleFavorite(String quoteId, bool isFavorite);
  Future<void> addQuote(Quote quote);
  Future<void> removeQuote(String quoteId);
}

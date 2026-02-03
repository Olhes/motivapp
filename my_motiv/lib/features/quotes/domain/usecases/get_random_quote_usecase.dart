import '../entities/quote.dart';
import '../repositories/quote_repository.dart';

class GetRandomQuoteUseCase {
  final QuoteRepository _repository;

  GetRandomQuoteUseCase(this._repository);

  Future<Quote> execute() {
    return _repository.getRandomQuote();
  }
}

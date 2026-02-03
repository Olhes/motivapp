import 'package:flutter/foundation.dart';
import '../../domain/entities/quote.dart';
import '../../domain/usecases/get_random_quote_usecase.dart';
import '../../domain/repositories/quote_repository.dart';
import '../../data/repositories/quote_repository_impl.dart';
import '../../../../core/storage/local_storage.dart';

class QuoteProvider extends ChangeNotifier {
  Quote? _currentQuote;
  bool _isLoading = false;
  String? _error;
  List<Quote> _favoriteQuotes = [];

  late final GetRandomQuoteUseCase _getRandomQuoteUseCase;
  late final QuoteRepository _repository;

  QuoteProvider() {
    _initializeDependencies();
  }

  Future<void> _initializeDependencies() async {
    try {
      final localStorage = await LocalStorage.getInstance();
      _repository = QuoteRepositoryImpl(localStorage);
      _getRandomQuoteUseCase = GetRandomQuoteUseCase(_repository);
      await _loadRandomQuote();
      await _loadFavoriteQuotes();
    } catch (e) {
      _setError(e.toString());
    }
  }

  // Getters
  Quote? get currentQuote => _currentQuote;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Quote> get favoriteQuotes => _favoriteQuotes;
  bool get hasError => _error != null;

  // Methods
  Future<void> _loadRandomQuote() async {
    _setLoading(true);
    _clearError();

    try {
      _currentQuote = await _getRandomQuoteUseCase.execute();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    } finally {
      _setLoading(false);
    }
  }

  Future<void> loadNewQuote() async {
    await _loadRandomQuote();
  }

  Future<void> toggleFavorite() async {
    if (_currentQuote == null) return;

    try {
      final newFavoriteStatus = !_currentQuote!.isFavorite;
      await _repository.toggleFavorite(_currentQuote!.id, newFavoriteStatus);

      _currentQuote = _currentQuote!.copyWith(isFavorite: newFavoriteStatus);

      if (newFavoriteStatus) {
        if (!_favoriteQuotes.any((q) => q.id == _currentQuote!.id)) {
          _favoriteQuotes.add(_currentQuote!);
        }
      } else {
        _favoriteQuotes.removeWhere((q) => q.id == _currentQuote!.id);
      }

      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  Future<void> _loadFavoriteQuotes() async {
    try {
      _favoriteQuotes = await _repository.getFavoriteQuotes();
      notifyListeners();
    } catch (e) {
      _setError(e.toString());
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
    notifyListeners();
  }

  void retry() {
    _clearError();
    _initializeDependencies();
  }
}

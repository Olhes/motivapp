import 'package:provider/provider.dart';
import '../storage/local_storage.dart';
import '../../features/quotes/data/repositories/quote_repository_impl.dart';
import '../../features/quotes/domain/repositories/quote_repository.dart';
import '../../features/quotes/domain/usecases/get_random_quote_usecase.dart';
import '../../features/quotes/presentation/providers/quote_provider.dart';

class DependencyInjection {
  static Future<List<ChangeNotifierProvider>> getProviders() async {
    final localStorage = await LocalStorage.getInstance();

    // Core dependencies
    final quoteRepository = QuoteRepositoryImpl(localStorage);
    final getRandomQuoteUseCase = GetRandomQuoteUseCase(quoteRepository);

    // Providers
    return [ChangeNotifierProvider(create: (_) => QuoteProvider())];
  }

  // Para acceso directo a las dependencias si es necesario
  static Future<T> getDependency<T>() async {
    final localStorage = await LocalStorage.getInstance();

    switch (T) {
      case QuoteRepository:
        return QuoteRepositoryImpl(localStorage) as T;
      case GetRandomQuoteUseCase:
        final repository = QuoteRepositoryImpl(localStorage);
        return GetRandomQuoteUseCase(repository) as T;
      default:
        throw Exception('Dependency not found for type $T');
    }
  }
}

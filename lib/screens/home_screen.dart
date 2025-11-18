import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:my_motiv/data/quotes_data.dart';
import 'package:my_motiv/models/quote.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  late Quote _currentQuote;
  bool _isFavorite = false;
  late AnimationController _animationController;
  bool _isAnimating = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _loadNewQuote();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _loadNewQuote() {
    setState(() {
      _isAnimating = true;
    });

    // Pequeño retraso para permitir que la animación se complete
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _currentQuote = quotesRepository.getRandomQuote();
          _isFavorite = _currentQuote.isFavorite;
          _isAnimating = false;
        });
      }
    });
  }

  void _toggleFavorite() {
    setState(() {
      _isFavorite = !_isFavorite;
      quotesRepository.toggleFavorite(_currentQuote, _isFavorite);

      // Mostrar un mensaje de confirmación
      final message = _isFavorite
          ? 'Añadido a favoritos'
          : 'Eliminado de favoritos';

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), duration: const Duration(seconds: 1)),
      );
    });
  }

  void _shareQuote() {
    final text = '"${_currentQuote.text}" - ${_currentQuote.author}';
    Share.share(text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Motivación Diaria'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Theme.of(context).colorScheme.primary,
              Theme.of(context).colorScheme.secondary,
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Tarjeta con la cita
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 500),
                  child: _isAnimating
                      ? const SizedBox.shrink()
                      : Card(
                          elevation: 8,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16.0),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Column(
                              children: [
                                // Icono de comillas
                                Icon(
                                  Icons.format_quote_rounded,
                                  size: 40,
                                  color: Theme.of(
                                    context,
                                  ).colorScheme.primary.withOpacity(0.3),
                                ),
                                const SizedBox(height: 16),
                                // Texto de la cita
                                Text(
                                      _currentQuote.text,
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontStyle: FontStyle.italic,
                                        height: 1.5,
                                      ),
                                      textAlign: TextAlign.center,
                                    )
                                    .animate()
                                    .fadeIn(duration: 300.ms)
                                    .slideY(begin: 0.1, end: 0),
                                const SizedBox(height: 24),
                                // Autor de la cita
                                Text(
                                      '- ${_currentQuote.author}',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.secondary,
                                      ),
                                    )
                                    .animate()
                                    .fadeIn(delay: 200.ms)
                                    .slideX(begin: 0.1, end: 0),
                                // Categoría
                                if (_currentQuote.category.isNotEmpty) ...[
                                  const SizedBox(height: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Theme.of(
                                        context,
                                      ).colorScheme.primary.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      _currentQuote.category,
                                      style: TextStyle(
                                        color: Theme.of(
                                          context,
                                        ).colorScheme.primary,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ).animate().fadeIn(delay: 300.ms),
                                ],
                              ],
                            ),
                          ),
                        ).animate().scale(
                          delay: 200.ms,
                          begin: const Offset(0.95, 0.95),
                        ),
                ),

                const SizedBox(height: 40),

                // Botones de acción
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // Botón de favorito
                    FloatingActionButton(
                      heroTag: 'favorite',
                      onPressed: _toggleFavorite,
                      backgroundColor: Colors.white,
                      child: Icon(
                        _isFavorite ? Icons.favorite : Icons.favorite_border,
                        color: Colors.red,
                        size: 28,
                      ),
                    ),

                    // Botón principal para nueva cita
                    ElevatedButton.icon(
                      onPressed: _loadNewQuote,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 4,
                      ),
                      icon: const Icon(Icons.autorenew, size: 24),
                      label: const Text(
                        'Nueva Frase',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),

                    // Botón de compartir
                    FloatingActionButton(
                      heroTag: 'share',
                      onPressed: _shareQuote,
                      backgroundColor: Colors.white,
                      child: const Icon(
                        Icons.share,
                        color: Colors.blue,
                        size: 24,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 20),

                // Texto de ayuda
                const Text(
                  'Toca el botón para una nueva dosis de motivación',
                  style: TextStyle(
                    color: Colors.white70,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

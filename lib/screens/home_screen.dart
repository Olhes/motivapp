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

class _HomeScreenState extends State<HomeScreen> {
  late Quote _currentQuote;
  bool _isAnimating = false;

  @override
  void initState() {
    super.initState();
    _currentQuote = quotesRepository.getRandomQuote();
  }

  void _loadNewQuote() {
    setState(() => _isAnimating = true);
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _currentQuote = quotesRepository.getRandomQuote();
          _isAnimating = false;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      // 1. Extraído a widget independiente para que no se reconstruya
      appBar: const CustomAppBar(),
      body: Stack(
        children: [
          // 2. Imagen con caché de tamaño para no saturar la RAM
          Image.asset(
            'assets/images/background1.avif',
            fit: BoxFit.cover,
            height: double.infinity,
            width: double.infinity,
            cacheHeight: MediaQuery.of(context).size.height.toInt(),
          ),

          SafeArea(
            child: Column(
              children: [
                const TopMenu(), // 3. Widget Const: Reconstrucción CERO
                const Spacer(),
                // 4. Solo este widget se ve afectado por el cambio de frase
                QuoteCard(quote: _currentQuote, isAnimating: _isAnimating),
                const Spacer(),
                BottomActions(
                  isFavorite: _currentQuote.isFavorite,
                  onFavorite: () {
                    setState(() {
                      quotesRepository.toggleFavorite(
                        _currentQuote,
                        !_currentQuote.isFavorite,
                      );
                    });
                  },
                  onRefresh: _loadNewQuote,
                  onShare: () => Share.share(
                    '"${_currentQuote.text}" - ${_currentQuote.author}',
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: const ModernBottomNav(), // 5. Widget Const
    );
  }
}

// --- WIDGETS OPTIMIZADOS (FUERA DE LA CLASE PRINCIPAL) ---

class TopMenu extends StatelessWidget {
  const TopMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          MenuButton("Phrases", active: true),
          MenuButton("Video"),
          MenuButton("Images"),
        ],
      ),
    );
  }
}

class MenuButton extends StatelessWidget {
  final String text;
  final bool active;
  const MenuButton(this.text, {super.key, this.active = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        // SOLUCIÓN: Usamos Color con opacidad HEX (0x4D = 30%)
        color: active ? const Color(0x4DFFFFFF) : Colors.transparent,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0x4DFFFFFF)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class QuoteCard extends StatelessWidget {
  final Quote quote;
  final bool isAnimating;

  const QuoteCard({super.key, required this.quote, required this.isAnimating});

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 500),
      child: isAnimating
          ? const SizedBox(height: 200)
          : Container(
              key: ValueKey(quote.text),
              margin: const EdgeInsets.symmetric(horizontal: 30),
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                // SOLUCIÓN: Color directo sin .withOpacity()
                color: const Color(0xD9FFFFFF),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: const Color(0x4DFFFFFF)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    quote.text,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 22,
                      height: 1.4,
                      color: Colors.black87,
                      fontStyle: FontStyle.italic,
                    ),
                  ).animate().fadeIn(duration: 300.ms),
                  const SizedBox(height: 20),
                  Text(
                    "— ${quote.author}",
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black54,
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class ModernBottomNav extends StatelessWidget {
  const ModernBottomNav({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(20),
      height: 70,
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(35),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          const Icon(Icons.home_outlined, color: Colors.white70),
          const Icon(Icons.nightlight_round_outlined, color: Colors.white70),
          const Icon(Icons.access_time, color: Colors.white70),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Colors.orange,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_none, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      centerTitle: true, // Centra el logo
      title: Container(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Image.asset(
          'assets/images/logo.png',
          width: 70,
          height: 70,
          fit: BoxFit.contain,
          cacheWidth: 140,
          cacheHeight: 140,
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class BottomActions extends StatelessWidget {
  final bool isFavorite;
  final VoidCallback onFavorite;
  final VoidCallback onRefresh;
  final VoidCallback onShare;

  const BottomActions({
    super.key,
    required this.isFavorite,
    required this.onFavorite,
    required this.onRefresh,
    required this.onShare,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: Icon(isFavorite ? Icons.favorite : Icons.favorite_border),
            color: isFavorite ? Colors.red : Colors.white,
            iconSize: 35,
            onPressed: onFavorite,
          ),
          GestureDetector(
            onTap: onRefresh,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Colors.orange,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.autorenew, color: Colors.white, size: 30),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.share_outlined),
            color: Colors.white,
            iconSize: 35,
            onPressed: onShare,
          ),
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:my_motiv/data/quotes_data.dart';
import 'package:my_motiv/models/quote.dart';
import 'package:my_motiv/screens/login_screen.dart';
import 'package:my_motiv/screens/favorites_screen.dart';
import 'package:my_motiv/screens/upload_screen.dart';
import 'package:my_motiv/screens/themes_screen.dart';
import 'package:my_motiv/screens/notifications_screen.dart';
import 'package:my_motiv/screens/settings_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Quote _currentQuote;
  bool _isAnimating = false;
  bool _isDarkMode = false;
  int _selectedBottomIndex = 0; // Home por defecto

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

  Widget _buildCustomDrawer() {
    return Drawer(
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              const Color(0xFF2C3E50), // Azul grisáceo oscuro
              const Color(0xFF34495E), // Azul grisáceo medio
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.transparent),
              child: Text(
                'Menu',
                style: TextStyle(color: Colors.white, fontSize: 24),
              ),
            ),
            _buildDrawerItem(
              Icons.person,
              'Profile',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
            ),
            _buildDrawerItem(
              Icons.cloud_upload,
              'Upload',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const UploadScreen()),
                );
              },
            ),
            _buildDrawerItem(
              Icons.share,
              'Share',
              onTap: () {
                _shareApp();
              },
            ),

            const Divider(color: Colors.white54), // Primer Divisor
            _buildDrawerItem(
              Icons.palette,
              'Themes',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ThemesScreen()),
                );
              },
            ),

            _buildDrawerItem(
              Icons.favorite,
              'Favorites',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const FavoritesScreen(),
                  ),
                );
              },
            ),
            _buildDrawerItem(
              Icons.wb_sunny,
              'Mode',
              onTap: () {
                setState(() {
                  _isDarkMode = !_isDarkMode;
                });
              },
              trailing: Switch(
                value: _isDarkMode,
                activeColor: Colors.black, // Color cuando está encendido
                onChanged: (bool value) {
                  setState(() {
                    _isDarkMode = value;
                  });
                },
              ),
            ),
            const Divider(color: Colors.white54),
            _buildDrawerItem(
              Icons.notifications,
              'Notifications',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const NotificationsScreen(),
                  ),
                );
              },
            ),
            _buildDrawerItem(
              Icons.settings,
              'Settings',
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SettingsScreen(),
                  ),
                );
              },
            ),
            _buildDrawerItem(Icons.logout, 'Logout'),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawerItem(
    IconData icon,
    String title, {
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.white),
      title: Text(
        title,
        style: const TextStyle(color: Colors.white, fontSize: 16),
      ),
      trailing: trailing, // Esto coloca el widget al final (derecha)
      onTap: onTap,
    );
  }

  Widget _buildModernBottomNav() {
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
          _buildBottomNavItem(Icons.home_outlined, 'Home', 0),
          _buildBottomNavItem(Icons.favorite_border, 'Favorites', 1),
          _buildBottomNavItem(Icons.palette_outlined, 'Themes', 2),
          _buildBottomNavItem(Icons.notifications_none, 'Notifications', 3),
        ],
      ),
    );
  }

  Widget _buildBottomNavItem(IconData icon, String label, int index) {
    final isSelected = _selectedBottomIndex == index;

    return GestureDetector(
      onTap: () => _onBottomNavTap(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? Colors.orange : Colors.transparent,
          borderRadius: BorderRadius.circular(25),
        ),
        child: Icon(
          isSelected ? _getSelectedIcon(icon) : icon,
          color: isSelected ? Colors.white : Colors.white70,
          size: 25,
        ),
      ),
    );
  }

  IconData _getSelectedIcon(IconData icon) {
    switch (icon) {
      case Icons.home_outlined:
        return Icons.home;
      case Icons.favorite_border:
        return Icons.favorite;
      case Icons.palette_outlined:
        return Icons.palette;
      case Icons.notifications_none:
        return Icons.notifications;
      default:
        return icon;
    }
  }

  void _onBottomNavTap(int index) {
    setState(() {
      _selectedBottomIndex = index;
    });

    switch (index) {
      case 0: // Home
        // Ya estamos en home
        break;
      case 1: // Favorites
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const FavoritesScreen()),
        );
        break;
      case 2: // Themes
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const ThemesScreen()),
        );
        break;
      case 3: // Notifications
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const NotificationsScreen()),
        );
        break;
    }
  }

  void _shareApp() {
    Share.share(
      '¡Descarga esta increíble app de motivación! 🌟\n\n'
      'Frases inspiradoras todos los días para mantenerte motivado.\n'
      'Descárgala ahora: https://play.google.com/store',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const CustomAppBar(),
      drawer: _buildCustomDrawer(),
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

          // Overlay para modo oscuro
          if (_isDarkMode)
            Container(
              decoration: BoxDecoration(color: Colors.black.withOpacity(0.3)),
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
      bottomNavigationBar: _buildModernBottomNav(), // 5. Widget Const
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
      centerTitle: true,
      leading: Builder(
        builder: (context) => IconButton(
          icon: const Icon(Icons.menu, color: Colors.white, size: 30),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
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

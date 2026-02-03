import 'package:flutter/material.dart';

class ThemesScreen extends StatefulWidget {
  const ThemesScreen({super.key});

  @override
  State<ThemesScreen> createState() => _ThemesScreenState();
}

class _ThemesScreenState extends State<ThemesScreen> {
  int _selectedThemeIndex = 0;

  // Temas de ejemplo
  final List<Map<String, String>> _themes = [
    {
      'name': 'Montaña Nevada',
      'path': 'assets/images/background1.avif',
      'type': 'default',
    },
    {
      'name': 'Océano Profundo',
      'path': 'assets/images/background1.avif',
      'type': 'default',
    },
    {
      'name': 'Bosque Místico',
      'path': 'assets/images/background1.avif',
      'type': 'default',
    },
    {
      'name': 'Ciudad Nocturna',
      'path': 'assets/images/background1.avif',
      'type': 'default',
    },
    {
      'name': 'Atardecer Tropical',
      'path': 'assets/images/background1.avif',
      'type': 'default',
    },
    {
      'name': 'Mi Tema 1',
      'path': 'assets/images/background1.avif',
      'type': 'user',
    },
    {
      'name': 'Mi Tema 2',
      'path': 'assets/images/background1.avif',
      'type': 'user',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Themes',
          style: TextStyle(color: Colors.white, fontSize: 20),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.add, color: Colors.white),
            onPressed: () {
              Navigator.pushNamed(context, '/upload');
            },
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.indigo.shade400, Colors.blue.shade600],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 20),

              // Tabs
              _buildTabs(),

              const SizedBox(height: 20),

              // Carrusel de temas
              Expanded(child: _buildThemesCarousel()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTabs() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(25),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedThemeIndex = 0),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _selectedThemeIndex == 0
                      ? Colors.orange
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: const Text(
                  'Ofrecidos',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedThemeIndex = 1),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: _selectedThemeIndex == 1
                      ? Colors.orange
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: const Text(
                  'Mis Temas',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThemesCarousel() {
    final filteredThemes = _selectedThemeIndex == 0
        ? _themes.where((t) => t['type'] == 'default').toList()
        : _themes.where((t) => t['type'] == 'user').toList();

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: filteredThemes.length,
      itemBuilder: (context, index) {
        final theme = filteredThemes[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 20),
          child: _buildThemeCard(theme, index),
        );
      },
    );
  }

  Widget _buildThemeCard(Map<String, String> theme, int index) {
    return Container(
      height: 200,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            // Imagen del tema
            Image.asset(
              theme['path']!,
              width: double.infinity,
              height: double.infinity,
              fit: BoxFit.cover,
            ),

            // Overlay con información
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.transparent, Colors.black.withOpacity(0.7)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      theme['name']!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 5),
                    Row(
                      children: [
                        Icon(
                          theme['type'] == 'user' ? Icons.person : Icons.star,
                          color: Colors.orange,
                          size: 16,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          theme['type'] == 'user' ? 'Personal' : 'Premium',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Botón de aplicar
            Positioned(
              top: 15,
              right: 15,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.orange,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: IconButton(
                  icon: const Icon(Icons.check, color: Colors.white),
                  onPressed: () => _applyTheme(theme),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _applyTheme(Map<String, String> theme) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Tema "${theme['name']}" aplicado'),
        backgroundColor: Colors.green,
      ),
    );

    // Aquí iría la lógica para cambiar el fondo
    Navigator.pop(context);
  }
}

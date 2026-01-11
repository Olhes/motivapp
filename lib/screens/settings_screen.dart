import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notificationsEnabled = true;
  bool _dailyReminders = true;
  bool _soundEffects = true;
  bool _vibration = true;
  String _language = 'Español';
  String _theme = 'Auto';

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
          'Settings',
          style: TextStyle(color: Colors.white, fontSize: 20),
        ),
        centerTitle: true,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.grey.shade700, Colors.grey.shade900],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Perfil
              _buildProfileSection(),

              const SizedBox(height: 30),

              // Notificaciones
              _buildSectionTitle('Notificaciones'),
              _buildSwitchTile(
                'Notificaciones Push',
                'Recibir notificaciones de la app',
                Icons.notifications,
                _notificationsEnabled,
                (value) => setState(() => _notificationsEnabled = value),
              ),
              _buildSwitchTile(
                'Recordatorios Diarios',
                'Recordatorio de frase del día',
                Icons.alarm,
                _dailyReminders,
                (value) => setState(() => _dailyReminders = value),
              ),

              const SizedBox(height: 30),

              // Preferencias
              _buildSectionTitle('Preferencias'),
              _buildChoiceTile(
                'Idioma',
                'Seleccionar idioma de la app',
                Icons.language,
                _language,
                ['Español', 'English', 'Português'],
                (value) => setState(() => _language = value),
              ),
              _buildChoiceTile(
                'Tema',
                'Apariencia de la app',
                Icons.palette,
                _theme,
                ['Auto', 'Claro', 'Oscuro'],
                (value) => setState(() => _theme = value),
              ),

              const SizedBox(height: 30),

              // Sonido y vibración
              _buildSectionTitle('Sonido y Vibración'),
              _buildSwitchTile(
                'Efectos de Sonido',
                'Sonidos al interactuar',
                Icons.volume_up,
                _soundEffects,
                (value) => setState(() => _soundEffects = value),
              ),
              _buildSwitchTile(
                'Vibración',
                'Vibrar al tocar',
                Icons.vibration,
                _vibration,
                (value) => setState(() => _vibration = value),
              ),

              const SizedBox(height: 30),

              // Almacenamiento
              _buildSectionTitle('Almacenamiento'),
              _buildActionTile(
                'Limpiar Cache',
                'Liberar espacio temporal',
                Icons.delete_sweep,
                _clearCache,
              ),
              _buildActionTile(
                'Descargar Frases Offline',
                'Guardar frases para usar sin internet',
                Icons.download,
                _downloadOffline,
              ),

              const SizedBox(height: 30),

              // Acerca de
              _buildSectionTitle('Acerca de'),
              _buildInfoTile('Versión', '1.0.0', Icons.info),
              _buildActionTile(
                'Términos y Condiciones',
                'Leer términos de uso',
                Icons.description,
                _openTerms,
              ),
              _buildActionTile(
                'Política de Privacidad',
                'Leer política de privacidad',
                Icons.security,
                _openPrivacy,
              ),
              _buildActionTile(
                'Contáctanos',
                'Enviar feedback o reportar problemas',
                Icons.email,
                _contactUs,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: Colors.white.withOpacity(0.2),
            child: const Icon(Icons.person, size: 30, color: Colors.white),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'John Doe',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'john.doe@example.com',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.7),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.white),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    IconData icon,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
        ),
        trailing: Switch(
          value: value,
          activeColor: Colors.orange,
          onChanged: onChanged,
        ),
      ),
    );
  }

  Widget _buildChoiceTile(
    String title,
    String subtitle,
    IconData icon,
    String currentValue,
    List<String> options,
    ValueChanged<String> onChanged,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
        ),
        trailing: DropdownButton<String>(
          value: currentValue,
          dropdownColor: Colors.grey.shade800,
          style: const TextStyle(color: Colors.white),
          items: options.map((option) {
            return DropdownMenuItem(value: option, child: Text(option));
          }).toList(),
          onChanged: (value) {
            if (value != null) onChanged(value);
          },
        ),
      ),
    );
  }

  Widget _buildActionTile(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, color: Colors.white70),
        onTap: onTap,
      ),
    );
  }

  Widget _buildInfoTile(String title, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.white),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontSize: 16),
        ),
        trailing: Text(
          value,
          style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 14),
        ),
      ),
    );
  }

  void _clearCache() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Cache limpiada exitosamente'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _downloadOffline() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Descargando frases para uso offline...'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _openTerms() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Abriendo términos y condiciones...'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _openPrivacy() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Abriendo política de privacidad...'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _contactUs() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Abriendo formulario de contacto...'),
        backgroundColor: Colors.orange,
      ),
    );
  }
}

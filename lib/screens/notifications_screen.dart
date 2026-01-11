import 'package:flutter/material.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<Map<String, dynamic>> _notifications = [
    {
      'title': 'Nueva frase disponible',
      'message': 'Descubre nuestra frase motivacional del día',
      'time': '2h',
      'type': 'new',
      'read': false,
    },
    {
      'title': 'Actualización de la app',
      'message': 'Nuevos temas y mejoras de rendimiento',
      'time': '1d',
      'type': 'update',
      'read': false,
    },
    {
      'title': 'Logro desbloqueado',
      'message:': 'Has leído 100 frases motivadoras',
      'time': '2d',
      'type': 'achievement',
      'read': true,
    },
    {
      'title': 'Recordatorio diario',
      'message': 'No olvides leer tu frase de hoy',
      'time': '3d',
      'type': 'reminder',
      'read': true,
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
          'Notifications',
          style: TextStyle(color: Colors.white, fontSize: 20),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.done_all, color: Colors.white),
            onPressed: _markAllAsRead,
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.green.shade400, Colors.teal.shade600],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 20),

              // Header
              _buildHeader(),

              const SizedBox(height: 20),

              // Lista de notificaciones
              Expanded(child: _buildNotificationsList()),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    final unreadCount = _notifications.where((n) => !n['read']).length;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Notificaciones',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 5),
              Text(
                '$unreadCount no leídas',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.7),
                  fontSize: 14,
                ),
              ),
            ],
          ),
          if (unreadCount > 0)
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: Colors.orange,
                borderRadius: BorderRadius.circular(15),
              ),
              child: Center(
                child: Text(
                  '$unreadCount',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNotificationsList() {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: _notifications.length,
      itemBuilder: (context, index) {
        final notification = _notifications[index];
        return Padding(
          padding: const EdgeInsets.only(bottom: 15),
          child: _buildNotificationCard(notification, index),
        );
      },
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification, int index) {
    return Container(
      decoration: BoxDecoration(
        color: notification['read']
            ? Colors.white.withOpacity(0.1)
            : Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: notification['read']
              ? Colors.white.withOpacity(0.2)
              : Colors.orange.withOpacity(0.5),
          width: notification['read'] ? 1 : 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            // Icono de notificación
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: _getNotificationColor(notification['type']),
                borderRadius: BorderRadius.circular(25),
              ),
              child: Icon(
                _getNotificationIcon(notification['type']),
                color: Colors.white,
                size: 25,
              ),
            ),

            const SizedBox(width: 15),

            // Contenido
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    notification['title'],
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: notification['read']
                          ? FontWeight.normal
                          : FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    notification['message'],
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.7),
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    notification['time'],
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.5),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),

            // Indicador de no leído
            if (!notification['read'])
              Container(
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: Colors.orange,
                  borderRadius: BorderRadius.circular(5),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'new':
        return Colors.blue;
      case 'update':
        return Colors.purple;
      case 'achievement':
        return Colors.amber;
      case 'reminder':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type) {
      case 'new':
        return Icons.new_releases;
      case 'update':
        return Icons.system_update;
      case 'achievement':
        return Icons.emoji_events;
      case 'reminder':
        return Icons.notifications_active;
      default:
        return Icons.notifications;
    }
  }

  void _markAllAsRead() {
    setState(() {
      for (var notification in _notifications) {
        notification['read'] = true;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Todas las notificaciones marcadas como leídas'),
        backgroundColor: Colors.green,
      ),
    );
  }
}

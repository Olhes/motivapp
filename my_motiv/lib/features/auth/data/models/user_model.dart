class UserModel {
  final String id;
  final String username;
  final String email;
  final String? avatar;
  final UserPreferences preferences;
  final UserStats stats;
  final bool isActive;
  final DateTime? lastLogin;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserModel({
    required this.id,
    required this.username,
    required this.email,
    this.avatar,
    required this.preferences,
    required this.stats,
    required this.isActive,
    this.lastLogin,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      username: json['username'] as String,
      email: json['email'] as String,
      avatar: json['avatar'] as String?,
      preferences: UserPreferences.fromJson(json['preferences'] as Map<String, dynamic>),
      stats: UserStats.fromJson(json['stats'] as Map<String, dynamic>),
      isActive: json['isActive'] as bool,
      lastLogin: json['lastLogin'] != null ? DateTime.parse(json['lastLogin'] as String) : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'avatar': avatar,
      'preferences': preferences.toJson(),
      'stats': stats.toJson(),
      'isActive': isActive,
      'lastLogin': lastLogin?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  UserModel copyWith({
    String? id,
    String? username,
    String? email,
    String? avatar,
    UserPreferences? preferences,
    UserStats? stats,
    bool? isActive,
    DateTime? lastLogin,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      avatar: avatar ?? this.avatar,
      preferences: preferences ?? this.preferences,
      stats: stats ?? this.stats,
      isActive: isActive ?? this.isActive,
      lastLogin: lastLogin ?? this.lastLogin,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserModel &&
        other.id == id &&
        other.username == username &&
        other.email == email;
  }

  @override
  int get hashCode {
    return id.hashCode ^ username.hashCode ^ email.hashCode;
  }
}

class UserPreferences {
  final DailyReminder dailyReminder;
  final List<String> favoriteCategories;
  final String theme;

  const UserPreferences({
    required this.dailyReminder,
    required this.favoriteCategories,
    required this.theme,
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) {
    return UserPreferences(
      dailyReminder: DailyReminder.fromJson(json['dailyReminder'] as Map<String, dynamic>),
      favoriteCategories: List<String>.from(json['favoriteCategories'] as List),
      theme: json['theme'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dailyReminder': dailyReminder.toJson(),
      'favoriteCategories': favoriteCategories,
      'theme': theme,
    };
  }
}

class DailyReminder {
  final bool enabled;
  final String time;

  const DailyReminder({
    required this.enabled,
    required this.time,
  });

  factory DailyReminder.fromJson(Map<String, dynamic> json) {
    return DailyReminder(
      enabled: json['enabled'] as bool,
      time: json['time'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'enabled': enabled,
      'time': time,
    };
  }
}

class UserStats {
  final int quotesRead;
  final int quotesFavorited;
  final int streak;
  final DateTime lastActive;

  const UserStats({
    required this.quotesRead,
    required this.quotesFavorited,
    required this.streak,
    required this.lastActive,
  });

  factory UserStats.fromJson(Map<String, dynamic> json) {
    return UserStats(
      quotesRead: json['quotesRead'] as int,
      quotesFavorited: json['quotesFavorited'] as int,
      streak: json['streak'] as int,
      lastActive: DateTime.parse(json['lastActive'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'quotesRead': quotesRead,
      'quotesFavorited': quotesFavorited,
      'streak': streak,
      'lastActive': lastActive.toIso8601String(),
    };
  }
}

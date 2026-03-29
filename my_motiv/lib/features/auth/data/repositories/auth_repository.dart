import '../../../../core/network/api_client.dart';
import '../models/user_model.dart';

class AuthRepository {
  final ApiClient _apiClient;

  AuthRepository(this._apiClient);

  Future<UserModel> register({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        '/api/auth/register',
        data: {'username': username, 'email': email, 'password': password},
      );

      if (response.statusCode == 201) {
        return UserModel.fromJson(response.data['data']);
      } else {
        throw Exception(response.data['message'] ?? 'Registration failed');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  Future<AuthResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiClient.post(
        '/api/auth/login',
        data: {'email': email, 'password': password},
      );

      if (response.statusCode == 200) {
        final data = response.data['data'];
        return AuthResponse(
          user: UserModel.fromJson(data['user']),
          accessToken: data['accessToken'],
          refreshToken: data['refreshToken'],
        );
      } else {
        throw Exception(response.data['message'] ?? 'Login failed');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  Future<UserModel> getProfile() async {
    try {
      final response = await _apiClient.get('/api/auth/profile');

      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['data']);
      } else {
        throw Exception(response.data['message'] ?? 'Failed to get profile');
      }
    } catch (e) {
      throw Exception('Profile error: $e');
    }
  }

  Future<void> logout({required String refreshToken}) async {
    try {
      await _apiClient.post(
        '/api/auth/logout',
        data: {'refreshToken': refreshToken},
      );
    } catch (e) {
      // Even if logout fails on server, clear local tokens
      throw Exception('Logout error: $e');
    }
  }

  Future<String> refreshToken({required String refreshToken}) async {
    try {
      final response = await _apiClient.post(
        '/api/auth/refresh',
        data: {'refreshToken': refreshToken},
      );

      if (response.statusCode == 200) {
        return response.data['data']['accessToken'];
      } else {
        throw Exception(response.data['message'] ?? 'Token refresh failed');
      }
    } catch (e) {
      throw Exception('Token refresh error: $e');
    }
  }
}

class AuthResponse {
  final UserModel user;
  final String accessToken;
  final String refreshToken;

  AuthResponse({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });
}

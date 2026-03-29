import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/network/api_client.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  final AuthRepository _authRepository;
  final ApiClient _apiClient;

  AuthProvider(this._authRepository, this._apiClient);

  // State
  UserModel? _user;
  bool _isLoading = false;
  bool _isAuthenticated = false;
  String? _errorMessage;

  // Getters
  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;
  String? get errorMessage => _errorMessage;

  // Initialize auth state
  Future<void> init() async {
    await _checkAuthStatus();
  }

  // Check if user is authenticated
  Future<void> _checkAuthStatus() async {
    try {
      _setLoading(true);

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('access_token');

      if (token != null) {
        // Verify token by getting user profile
        final user = await _authRepository.getProfile();
        _user = user;
        _isAuthenticated = true;
      }
    } catch (e) {
      // Token is invalid, clear it
      await _clearTokens();
      _isAuthenticated = false;
      _user = null;
    } finally {
      _setLoading(false);
    }
  }

  // Register user
  Future<bool> register({
    required String username,
    required String email,
    required String password,
  }) async {
    try {
      _setLoading(true);
      _clearError();

      final user = await _authRepository.register(
        username: username,
        email: email,
        password: password,
      );

      _user = user;
      _isAuthenticated = true;
      notifyListeners();

      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Login user
  Future<bool> login({required String email, required String password}) async {
    try {
      _setLoading(true);
      _clearError();

      final response = await _authRepository.login(
        email: email,
        password: password,
      );

      // Save tokens
      await _saveTokens(
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      );

      _user = response.user;
      _isAuthenticated = true;
      notifyListeners();

      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Logout user
  Future<void> logout() async {
    try {
      _setLoading(true);

      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refresh_token');

      if (refreshToken != null) {
        await _authRepository.logout(refreshToken: refreshToken);
      }
    } catch (e) {
      // Continue with local logout even if server logout fails
      debugPrint('Logout error: $e');
    } finally {
      await _clearTokens();
      _user = null;
      _isAuthenticated = false;
      _setLoading(false);
      notifyListeners();
    }
  }

  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final refreshToken = prefs.getString('refresh_token');

      if (refreshToken == null) {
        return false;
      }

      final newAccessToken = await _authRepository.refreshToken(
        refreshToken: refreshToken,
      );

      await prefs.setString('access_token', newAccessToken);
      return true;
    } catch (e) {
      // Refresh failed, clear tokens
      await _clearTokens();
      _user = null;
      _isAuthenticated = false;
      notifyListeners();
      return false;
    }
  }

  // Update user profile
  Future<void> updateProfile(UserModel updatedUser) async {
    _user = updatedUser;
    notifyListeners();
  }

  // Private methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> _saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('access_token', accessToken);
    await prefs.setString('refresh_token', refreshToken);
  }

  Future<void> _clearTokens() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    await prefs.remove('refresh_token');
  }
}

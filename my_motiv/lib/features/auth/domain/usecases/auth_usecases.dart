import '../../data/repositories/auth_repository.dart';
import '../../data/models/user_model.dart';

class RegisterUseCase {
  final AuthRepository _repository;

  RegisterUseCase(this._repository);

  Future<UserModel> execute({
    required String username,
    required String email,
    required String password,
  }) async {
    // Validate input
    if (username.isEmpty) {
      throw ArgumentError('Username is required');
    }
    if (email.isEmpty) {
      throw ArgumentError('Email is required');
    }
    if (password.isEmpty) {
      throw ArgumentError('Password is required');
    }
    if (password.length < 6) {
      throw ArgumentError('Password must be at least 6 characters');
    }
    if (!email.contains('@')) {
      throw ArgumentError('Invalid email format');
    }

    return await _repository.register(
      username: username,
      email: email,
      password: password,
    );
  }
}

class LoginUseCase {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  Future<AuthResponse> execute({
    required String email,
    required String password,
  }) async {
    // Validate input
    if (email.isEmpty) {
      throw ArgumentError('Email is required');
    }
    if (password.isEmpty) {
      throw ArgumentError('Password is required');
    }

    return await _repository.login(email: email, password: password);
  }
}

class GetProfileUseCase {
  final AuthRepository _repository;

  GetProfileUseCase(this._repository);

  Future<UserModel> execute() async {
    return await _repository.getProfile();
  }
}

class LogoutUseCase {
  final AuthRepository _repository;

  LogoutUseCase(this._repository);

  Future<void> execute({required String refreshToken}) async {
    return await _repository.logout(refreshToken: refreshToken);
  }
}

class RefreshTokenUseCase {
  final AuthRepository _repository;

  RefreshTokenUseCase(this._repository);

  Future<String> execute({required String refreshToken}) async {
    return await _repository.refreshToken(refreshToken: refreshToken);
  }
}

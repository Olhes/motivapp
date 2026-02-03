import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../errors/app_exceptions.dart';

class HttpClient {
  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse(
        '${AppConstants.baseUrl}$path',
      ).replace(queryParameters: queryParameters);
      final response = await http.get(uri).timeout(AppConstants.apiTimeout);

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> post(String path, {dynamic data}) async {
    try {
      final uri = Uri.parse('${AppConstants.baseUrl}$path');
      final response = await http
          .post(
            uri,
            body: data != null ? json.encode(data) : null,
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(AppConstants.apiTimeout);

      return _handleResponse(response);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return json.decode(response.body);
    } else {
      throw NetworkException(
        'Error ${response.statusCode}: ${response.reasonPhrase}',
        code: response.statusCode.toString(),
      );
    }
  }

  AppException _handleError(dynamic error) {
    if (error is AppException) return error;

    if (error is http.ClientException) {
      return NetworkException('Error de conexión: ${error.message}');
    }

    return NetworkException('Error desconocido: ${error.toString()}');
  }
}

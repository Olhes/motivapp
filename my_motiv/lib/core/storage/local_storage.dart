import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/app_constants.dart';
import '../errors/app_exceptions.dart';

class LocalStorage {
  static LocalStorage? _instance;
  static SharedPreferences? _prefs;

  LocalStorage._();

  static Future<LocalStorage> getInstance() async {
    _instance ??= LocalStorage._();
    _prefs ??= await SharedPreferences.getInstance();
    return _instance!;
  }

  Future<void> saveString(String key, String value) async {
    try {
      await _prefs?.setString(key, value);
    } catch (e) {
      throw StorageException('Error guardando datos: ${e.toString()}');
    }
  }

  Future<String?> getString(String key) async {
    try {
      return _prefs?.getString(key);
    } catch (e) {
      throw StorageException('Error obteniendo datos: ${e.toString()}');
    }
  }

  Future<void> saveObject(String key, Map<String, dynamic> value) async {
    try {
      await saveString(key, json.encode(value));
    } catch (e) {
      throw StorageException('Error guardando objeto: ${e.toString()}');
    }
  }

  Future<Map<String, dynamic>?> getObject(String key) async {
    try {
      final value = await getString(key);
      return value != null ? json.decode(value) : null;
    } catch (e) {
      throw StorageException('Error obteniendo objeto: ${e.toString()}');
    }
  }

  Future<void> remove(String key) async {
    try {
      await _prefs?.remove(key);
    } catch (e) {
      throw StorageException('Error eliminando datos: ${e.toString()}');
    }
  }

  Future<void> clear() async {
    try {
      await _prefs?.clear();
    } catch (e) {
      throw StorageException('Error limpiando datos: ${e.toString()}');
    }
  }
}

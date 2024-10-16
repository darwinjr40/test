import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:public/environment.dart';

abstract class MigrateServiceInterface {
  Future<((bool, bool, bool, bool, bool), String)> getStatus();
  Future<(bool, String)> migrateUsers();
  Future<(bool, String)> migrateShifts();
  Future<(bool, String)> migrateCalendarShifts();
  Future<(bool, String)> migrateFriends();
  Future<(bool, String)> migrateSchedules();
}

class MigrateService implements MigrateServiceInterface {
  final Dio dio;

  MigrateService()
      : dio = Dio(BaseOptions(
          baseUrl: Environment.baseUrl,
          validateStatus: (status) {
            return true;
          },
        ));

  @override
  Future<((bool, bool, bool, bool, bool), String)> getStatus() async {
    try {
      final resp = await dio.get('/migration-status');
      final (bool, bool, bool, bool, bool) data = (
        resp.data['users'] ?? false,
        resp.data['shifts'] ?? false,
        resp.data['calendar_shifts'] ?? false,
        resp.data['friends'] ?? false,
        resp.data['schedules'] ?? false,
      );
      return (data, 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return ((false, false, false, false, false), 'Ocurrio un error: $e');
    }
  }

  @override
  Future<(bool, String)> migrateCalendarShifts() async {
    try {
      final resp = await dio.get('/calendar-shifts');
      if (resp.statusCode != 200) {
        final message = resp.data['message'] as String?;
        return (false, message ?? 'Ocurrio un error:');
      }
      return (true, 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (false, 'Ocurrio un error: $e');
    }
  }

  @override
  Future<(bool, String)> migrateFriends() async {
    try {
      final resp = await dio.get('/friends');
      if (resp.statusCode != 200) {
        final message = resp.data['message'] as String?;
        return (false, message ?? 'Ocurrio un error:');
      }
      return (true, 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (false, 'Ocurrio un error: $e');
    }
  }

  @override
  Future<(bool, String)> migrateSchedules() async {
    try {
      final resp = await dio.get('/schedules');
      if (resp.statusCode != 200) {
        final message = resp.data['message'] as String?;
        return (false, message ?? 'Ocurrio un error:');
      }
      return (true, 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (false, 'Ocurrio un error: $e');
    }
  }

  @override
  Future<(bool, String)> migrateShifts() async {
    try {
      final resp = await dio.get('/shifts');
      if (resp.statusCode != 200) {
        final message = resp.data['message'] as String?;
        return (false, message ?? 'Ocurrio un error:');
      }
      return (true, 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (false, 'Ocurrio un error: $e');
    }
  }

  @override
  Future<(bool, String)> migrateUsers() async {
    try {
      final resp = await dio.get('/app-users');
      final message = resp.data['message'] as String?;
      if (resp.statusCode != 200) {
        return (false, message ?? 'Ocurrio un error:');
      }
      return (true, message ?? 'Data obtenida correctamente');
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (false, 'Ocurrio un error: $e');
    }
  }
}

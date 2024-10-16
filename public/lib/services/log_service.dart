import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:public/environment.dart';
import 'package:public/models/models.dart';

abstract class LogServiceInterface {
  Future<(List<Log>, String?)> getLogs();
}

class LogService implements LogServiceInterface {
  final Dio dio;

  LogService()
      : dio = Dio(BaseOptions(
          baseUrl: Environment.baseUrl,
          validateStatus: (status) {
            return true;
          },
        ));

  @override
  Future<(List<Log>, String?)> getLogs() async {
    try {
      final resp = await dio.get('/logs');
      final message = resp.data['message'] as String?;
      if (resp.statusCode != 200) {
        return (List<Log>.from([]), message);
      }
      final logs =
          List<Log>.from(resp.data['data'].map((log) => Log.fromMap(log)));
      logs.sort((a, b) => b.endAt.compareTo(a.endAt));
      return (logs, null);
    } catch (e) {
      debugPrint('**************************************');
      debugPrint('Error => $e');
      debugPrint('**************************************');
      return (List<Log>.from([]), e.toString());
    }
  }
}

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:public/models/models.dart';
import 'package:public/services/services.dart';

part 'log_cubit_state.dart';

class LogCubit extends Cubit<LogState> {
  final logService = LogService();
  LogCubit() : super(const LogState()) {
    loadData();
  }

  void loadData() async {
    if (state.isLoading) return;
    emit(state.copyWith(isLoading: true));
    final (logs, _) = await logService.getLogs();
    emit(state.copyWith(
      isLoading: false,
      logs: logs,
    ));
  }
}

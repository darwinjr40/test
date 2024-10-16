import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:public/services/services.dart';

part 'migrate_state.dart';

class MigrateCubit extends Cubit<MigrateState> {
  final MigrateService migrateService = MigrateService();

  MigrateCubit() : super(const MigrateState()) {
    loadData();
  }

  Future<(bool, String)> loadData() async {
    try {
      if (state.isLoading) return (false, 'Migration in progress ....');
      emit(state.copyWith(isLoading: true));
      final result = await migrateService.getStatus();
      emit(state.copyWith(
        isLoading: false,
        checkUsers: result.$1.$1,
        checkShifts: result.$1.$2,
        checkCalendarShifts: result.$1.$3,
        checkFriends: result.$1.$4,
        checkSchedule: result.$1.$5,
      ));
      return (true, 'Migration completed');
    } catch (e) {
      emit(state.copyWith(isLoading: false));
      return (false, e.toString());
    }
  }

  Future<(bool, String)> migrateUsers() async {
    try {
      if (state.isSaving) return (false, 'Migration in progress ....');
      emit(state.copyWith(isSaving: true));
      final result = await migrateService.migrateUsers();
      emit(state.copyWith(isSaving: false));
      if (result.$1) emit(state.copyWith(checkUsers: true));      
      return result;
    } catch (e) {
      emit(state.copyWith(isSaving: false));
      return (false, e.toString());
    }
  }

  Future<(bool, String)> migrateShifts() async {
    try {
      if (state.isSaving) return (false, 'Migration in progress ....');
      emit(state.copyWith(isSaving: true));
      final result = await migrateService.migrateShifts();
      emit(state.copyWith(isSaving: false));
      if (result.$1) emit(state.copyWith(checkShifts: true));
      return result;
    } catch (e) {
      emit(state.copyWith(isSaving: false));
      return (false, e.toString());
    }
  }

  Future<(bool, String)> migrateCalendarShifts() async {
    try {
      if (state.isSaving) return (false, 'Migration in progress ....');
      emit(state.copyWith(isSaving: true));
      final result = await migrateService.migrateCalendarShifts();
      emit(state.copyWith(isSaving: false));
      if (result.$1) emit(state.copyWith(checkCalendarShifts: true));
      return result;
    } catch (e) {
      emit(state.copyWith(isSaving: false));
      return (false, e.toString());
    }
  }

  Future<(bool, String)> migrateFriends() async {
    try {
      if (state.isSaving) return (false, 'Migration in progress ....');
      emit(state.copyWith(isSaving: true));
      final result = await migrateService.migrateFriends();
      emit(state.copyWith(isSaving: false));
      if (result.$1) emit(state.copyWith(checkFriends: true));
      return result;
    } catch (e) {
      emit(state.copyWith(isSaving: false));
      return (false, e.toString());
    }
  }

  Future<(bool, String)> migrateSchedules() async {
    try {
      if (state.isSaving) return (false, 'Migration in progress ....');
      emit(state.copyWith(isSaving: true));
      final result = await migrateService.migrateSchedules();
      emit(state.copyWith(isSaving: false));
      if (result.$1) emit(state.copyWith(checkSchedule: true));
      return result;
    } catch (e) {
      emit(state.copyWith(isSaving: false));
      return (false, e.toString());
    }
  }
}

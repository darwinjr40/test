part of 'migrate_cubit.dart';

class MigrateState extends Equatable {
  final bool isLoading;
  final bool isSaving;
  
  final bool checkUsers;
  final bool checkShifts;
  final bool checkCalendarShifts;
  final bool checkFriends;
  final bool checkSchedule;

  const MigrateState({
    this.isLoading = false,
    this.isSaving = false,
    this.checkUsers = false,
    this.checkShifts = false,
    this.checkCalendarShifts = false,
    this.checkFriends = false,
    this.checkSchedule = false,
  });
  MigrateState copyWith({
    bool? isLoading,
    bool? isSaving,
    bool? checkUsers,
    bool? checkShifts,
    bool? checkCalendarShifts,
    bool? checkFriends,
    bool? checkSchedule,
  }) =>
      MigrateState(
        isLoading: isLoading ?? this.isLoading,
        isSaving: isSaving ?? this.isSaving,
        checkUsers: checkUsers ?? this.checkUsers,
        checkShifts: checkShifts ?? this.checkShifts,
        checkCalendarShifts: checkCalendarShifts ?? this.checkCalendarShifts,
        checkFriends: checkFriends ?? this.checkFriends,
        checkSchedule: checkSchedule ?? this.checkSchedule,
      );

  @override
  List<Object?> get props => [
        isLoading,
        isSaving,
        checkUsers,
        checkShifts,
        checkCalendarShifts,
        checkFriends,
        checkSchedule,
      ];
}

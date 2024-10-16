part of 'log_cubit.dart';

class LogState extends Equatable {
  final bool isSaving;
  final bool isLoading;
  final List<Log> logs;

  const LogState({
    this.isSaving = false,
    this.isLoading = false,
    this.logs = const [],
  });
  copyWith({
    bool? isSaving,
    bool? isLoading,
    List<Log>? logs,
  }) =>
      LogState(
        isSaving: isSaving ?? this.isSaving,
        isLoading: isLoading ?? this.isLoading,
        logs: logs ?? this.logs,
      );

  @override
  List<Object?> get props => [
        isSaving,
        isLoading,
        logs,
      ];
}

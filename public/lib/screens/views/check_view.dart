import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:public/blocs/blocs.dart';
import 'package:public/commons/helpers/herlpers.dart';
import 'package:public/commons/utils/color_resources.dart';
import 'package:public/commons/utils/dimensions.dart';
import 'package:public/services/notifications_service.dart';
import 'package:public/widgets/widgets.dart';

class CheckView extends StatelessWidget {
  const CheckView({super.key});

  Future<void> openDialog(BuildContext context) async {
    await showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const AlertDialog(
        title: Text('移行中です....'),
        content: FullScreenLoader(height: 200),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final migrateCubit = context.read<MigrateCubit>();
    return BlocConsumer<MigrateCubit, MigrateState>(
      listenWhen: (previous, current) => previous.isSaving && !current.isSaving,
      listener: (context, state) {
        context.read<LogCubit>().loadData();
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('一連のステップを実行する'),
            backgroundColor: Colors.grey,
          ),
          body: state.isLoading
              ? const FullScreenLoader()
              : Container(
                  color: ColorResources.borderDataGrid,
                  padding: const EdgeInsets.all(Dimensions.paddingSizeSmall),
                  child: Column(
                    children: <Widget>[
                      const SizedBox(height: Dimensions.paddingSizeDefault),
                      CardContainer(
                        vertical: 0,
                        horizontal: 0,
                        padding: const EdgeInsets.all(
                            Dimensions.paddingSizeExtraSmall),
                        child: ListTile(
                          trailing: StepCustom(value: state.checkUsers),
                          title: const Text('1. ユーザーを移行する'),
                          onTap: () async {
                            final confirm =
                                await PoPups.confirmAction(context: context);
                            if (!confirm) return;
                            if (context.mounted) openDialog(context);
                            final (resp, message) =
                                await migrateCubit.migrateUsers();
                            if (context.mounted) {
                              final currentScreen =
                                  (ModalRoute.of(context)?.isCurrent ?? false);
                              if (!currentScreen) Navigator.of(context).pop();
                            }
                            if (resp) {
                              NotificationsService.showSnackbarSuccess(message);
                            } else {
                              NotificationsService.showSnackbarDanger(message);
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: Dimensions.paddingSizeDefault),
                      CardContainer(
                        vertical: 0,
                        horizontal: 0,
                        padding: const EdgeInsets.all(
                            Dimensions.paddingSizeExtraSmall),
                        child: ListTile(
                          trailing: StepCustom(value: state.checkShifts),
                          title: const Text('2. シフトを移行する'),
                          onTap: () async {
                            final confirm =
                                await PoPups.confirmAction(context: context);
                            if (!confirm) return;
                            if (context.mounted) openDialog(context);
                            final (resp, message) =
                                await migrateCubit.migrateShifts();
                            if (context.mounted) {
                              final currentScreen =
                                  (ModalRoute.of(context)?.isCurrent ?? false);
                              if (!currentScreen) Navigator.of(context).pop();
                            }
                            if (resp) {
                              NotificationsService.showSnackbarSuccess(message);
                            } else {
                              NotificationsService.showSnackbarDanger(message);
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: Dimensions.paddingSizeDefault),
                      CardContainer(
                        vertical: 0,
                        horizontal: 0,
                        padding: const EdgeInsets.all(
                            Dimensions.paddingSizeExtraSmall),
                        child: ListTile(
                          trailing:
                              StepCustom(value: state.checkCalendarShifts),
                          title: const Text('3. カレンダーの変更を移行する'),
                          onTap: () async {
                            final confirm =
                                await PoPups.confirmAction(context: context);
                            if (!confirm) return;
                            if (context.mounted) openDialog(context);
                            final (resp, message) =
                                await migrateCubit.migrateCalendarShifts();
                            if (context.mounted) {
                              final currentScreen =
                                  (ModalRoute.of(context)?.isCurrent ?? false);
                              if (!currentScreen) Navigator.of(context).pop();
                            }
                            if (resp) {
                              NotificationsService.showSnackbarSuccess(message);
                            } else {
                              NotificationsService.showSnackbarDanger(message);
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: Dimensions.paddingSizeDefault),
                      CardContainer(
                        vertical: 0,
                        horizontal: 0,
                        padding: const EdgeInsets.all(
                            Dimensions.paddingSizeExtraSmall),
                        child: ListTile(
                          trailing: StepCustom(value: state.checkFriends),
                          title: const Text('4. 友達を移行する'),
                          onTap: () async {
                            final confirm =
                                await PoPups.confirmAction(context: context);
                            if (!confirm) return;
                            if (context.mounted) openDialog(context);
                            final (resp, message) =
                                await migrateCubit.migrateFriends();
                            if (context.mounted) {
                              final currentScreen =
                                  (ModalRoute.of(context)?.isCurrent ?? false);
                              if (!currentScreen) Navigator.of(context).pop();
                            }
                            if (resp) {
                              NotificationsService.showSnackbarSuccess(message);
                            } else {
                              NotificationsService.showSnackbarDanger(message);
                            }
                          },
                        ),
                      ),
                      const SizedBox(height: Dimensions.paddingSizeDefault),
                      CardContainer(
                        vertical: 0,
                        horizontal: 0,
                        padding: const EdgeInsets.all(
                            Dimensions.paddingSizeExtraSmall),
                        child: ListTile(
                          trailing: StepCustom(value: state.checkSchedule),
                          title: const Text('5. スケジュールを移行する'),
                          onTap: () async {
                            final confirm =
                                await PoPups.confirmAction(context: context);
                            if (!confirm) return;
                            if (context.mounted) openDialog(context);
                            final (resp, message) =
                                await migrateCubit.migrateSchedules();
                            if (context.mounted) {
                              final currentScreen =
                                  (ModalRoute.of(context)?.isCurrent ?? false);
                              if (!currentScreen) Navigator.of(context).pop();
                            }
                            if (resp) {
                              NotificationsService.showSnackbarSuccess(message);
                            } else {
                              NotificationsService.showSnackbarDanger(message);
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
        );
      },
    );
  }
}

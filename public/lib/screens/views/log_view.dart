import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:public/blocs/log_cubit/log_cubit.dart';
import 'package:public/models/models.dart';
import 'package:public/widgets/widgets.dart';

class LogView extends StatelessWidget {
  const LogView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LogCubit, LogState>(
      builder: (context, state) {
        return Scaffold(
          body: Column(
            children: [
              AppBar(
                title: const Text('登録履歴'),
                backgroundColor: Colors.grey,
              ),
              Expanded(
                child: SingleChildScrollView(
                  child: GenericDataTable(
                    columns: Log.dataColumns(state.logs),
                    rows: Log.dataRow(state.logs),
                    scrollController: ScrollController(),
                  ),
                ),
              )
            ],
          ),
        );
      },
    );
  }
}

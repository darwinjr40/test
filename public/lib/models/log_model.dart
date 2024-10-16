import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:public/commons/extensions/date_time_extension.dart';
import 'package:public/commons/utils/color_resources.dart';

class Log {
  final String status;
  final String mapping;
  final int _startAt;
  final int _endAt;
  final String detail;

  Log({
    required this.status,
    required this.mapping,
    required int startAt,
    required int endAt,
    required this.detail,
  })  : _startAt = (startAt),
        _endAt = (endAt);

  DateTime get startAt => DateTime.fromMillisecondsSinceEpoch(_startAt);
  DateTime get endAt => DateTime.fromMillisecondsSinceEpoch(_endAt);

  int get statusColor {
    switch (status) {
      case 'sucess':
        return 0xFF4CAF50;
      case 'error':
        return 0xFFF44336;

      case 'processing':
        return 0xFF2196F3;

      case 'starting':
        return 0xFF2196F3;
      default:
        return 0xFF9E9E9E;
    }
  }
  String get status2 {
    switch (status) {
      case 'sucess':
        return '完了';
        // return 'せいこう';
      case 'error':
        return 'エラー発生';

      case 'processing':
        return '進行中';

      case 'starting':
        return '実行中';
        // return '始める';
      default:
        return '見知らぬ人';
    }
  }

  Log copyWith({
    String? status,
    String? mapping,
    int? startAt,
    int? endAt,
    String? detail,
  }) =>
      Log(
        status: status ?? this.status,
        mapping: mapping ?? this.mapping,
        startAt: startAt ?? _startAt,
        endAt: endAt ?? _startAt,
        detail: detail ?? this.detail,
      );

  factory Log.fromJson(String str) => Log.fromMap(json.decode(str));

  String toJson() => json.encode(toMap());

  factory Log.fromMap(Map<String, dynamic> json) => Log(
        status: json["status"],
        mapping: json["mapping"],
        startAt: (json["startAt"]),
        endAt: (json["endAt"]),
        detail: json["detail2"],
      );
  static List<Log> generateLogs() {
    return List<Log>.generate(20, (index) {
      return Log(
        status: '${200 + index}',
        mapping: 'mapping_$index',
        startAt: index,
        endAt: index,
        detail: 'Detalle del log número $index',
      );
    });
  }

  Map<String, dynamic> toMap() => {
        "status": status,
        "mapping": mapping,
        "startAt": _startAt,
        "endAt": _endAt,
        "detail": detail,
      };

  Map<String, DataCell> toMapTable() => {
        // "status": DataCell(
        "状態 ": DataCell(
          Container(
            width: double.infinity,
            height: double.infinity,
            alignment: Alignment.center,
            margin: const EdgeInsets.all(5),
            decoration: BoxDecoration(
              color: Color(statusColor).withOpacity(0.1),
              borderRadius: BorderRadius.circular(15),
            ),
            child: Text(status2, style: TextStyle(color: Color(statusColor))),
            // child: Text(status.formatDatetime()),
          ),
        ),
        // "mapping": DataCell(
        "コレクション": DataCell(
          Align(
            alignment: Alignment.centerLeft,
            child: Text(mapping),
          ),
        ),
        // "Execution date and time": DataCell(
        "実行日時": DataCell(
          Align(
            alignment: Alignment.center,
            child: Text(endAt.formatDatetime()),
          ),
        ),
        // "実行終了日時": DataCell(
        //   Align(
        //     alignment: Alignment.center,
        //     child: Text(endAt.formatDatetime()),
        //     // child: SelectableText(endAt.formatDatetime()),
        //   ),
        // ),
        "詳細 ": DataCell(
          Align(
            alignment: Alignment.centerLeft,
            child: Text(detail),
          ),
        ),
      };

  static List<DataColumn> dataColumns(List<Log> list) {
    if (list.isEmpty) return List<DataColumn>.empty();
    final keys = list.first.toMapTable().keys;
    return keys
        .map(
          (x) => DataColumn(
            label: Expanded(
              child: Text(
                x,
                textAlign: TextAlign.center,
                style: const TextStyle(color: ColorResources.title),
              ),
            ),
          ),
        )
        .toList();
  }

  static List<DataRow> dataRow(
    List<Log> list,
  ) {
    return list
        .map((x) => DataRow(
              // color: WidgetStateProperty.resolveWith<Color?>(
              //   (_) {
              //     // if (x.tipo == ClientTransactionFilter.debt) {
              //     //   return Colors.red.withOpacity(0.3);
              //     // }
              //     // if (x.tipo == ClientTransactionFilter.pay) {
              //     //   return Colors.green.withOpacity(0.3);
              //     // }
              //     return Colors.grey.withOpacity(0.3);
              //   },
              // ),
              cells: x.toMapTable().values.toList(),
            ))
        .toList();
  }
}

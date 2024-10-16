import 'dart:ui';

import 'package:flutter/material.dart';
// import 'package:public/app_theme.dart';
// import 'package:public/commons/utils/color_resources.dart';

import 'empty_search_result.dart';

class GenericDataTable extends StatelessWidget {
  const GenericDataTable({
    super.key,
    required this.columns,
    required this.rows,
    this.sortColumnIndex,
    this.isAscending = true,
    this.showCheckboxColumn = false,
    this.dataRowMinHeight = 25,
    this.dataRowMaxHeight = 30,
    this.columnSpacing = 15,
    this.headingRowHeight = 30,
    this.horizontalMargin = 10,
    this.scrollController,
  });

  final List<DataColumn> columns;
  final List<DataRow> rows;
  final int? sortColumnIndex;
  final bool isAscending;
  final bool showCheckboxColumn;
  final double dataRowMinHeight;
  final double dataRowMaxHeight;
  final double columnSpacing;
  final double headingRowHeight;
  final double horizontalMargin;
  final ScrollController? scrollController;

  @override
  Widget build(BuildContext context) {
    if (columns.isEmpty) {
      return const EmptySearchResult(
        text: '記録はありません',
      );
    }
    return Center(
      child: ScrollConfiguration(
        behavior: ScrollConfiguration.of(context).copyWith(
          dragDevices: {
            PointerDeviceKind.touch,
            PointerDeviceKind.mouse,
          },
        ),
        child: Scrollbar(
          interactive: true,
          thumbVisibility: true,
          trackVisibility: true,
          controller: scrollController,
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            controller: scrollController,
            padding: const EdgeInsets.symmetric(vertical: 2),
            child: DataTable(
              columns: columns,
              rows: rows,
              sortColumnIndex: sortColumnIndex,
              sortAscending: isAscending,
              showCheckboxColumn: showCheckboxColumn,
              headingRowColor:
                  WidgetStateProperty.resolveWith<Color?>((states) {
                return Colors.grey;
                // return ColorResources.headerTable;
              }),
              border: TableBorder.all(),
              headingTextStyle: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
              dataRowMinHeight: dataRowMinHeight,
              dataRowMaxHeight: dataRowMaxHeight,
              columnSpacing: columnSpacing,
              headingRowHeight: headingRowHeight,
              horizontalMargin: horizontalMargin,
            ),
          ),
        ),
      ),
    );
  }
}

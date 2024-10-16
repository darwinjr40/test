import 'package:flutter/cupertino.dart';

enum DateFormatEnum {
  dmy,
  mdy,
  ymd,
  ddmmyyyy,
  mmddyyyy,
  yyyymmdd;

  DatePickerDateOrder get datePickerDateOrder {
    switch (this) {
      case DateFormatEnum.dmy:
      case DateFormatEnum.ddmmyyyy:
        return DatePickerDateOrder.dmy;
      case DateFormatEnum.mdy:
      case DateFormatEnum.mmddyyyy:
        return DatePickerDateOrder.mdy;
      case DateFormatEnum.ymd:
      case DateFormatEnum.yyyymmdd:
        return DatePickerDateOrder.ymd;
    }
  }
}

enum TimeFormat {
  hm,
  hms,
  hhmm,
  hhmmss,
  hm12h,
  hms12h,
  hhmm12h,
  hhmmss12h,
}

extension DateTimeCasingExtension on DateTime {
  DateTime get dateOnly => DateTime(year, month, day);
  DateTime get startOfDay => DateTime(year, month, day);
  DateTime get endOfDay => DateTime(year, month, day, 23, 59, 59, 999, 999);

  String formatDate({
    DateFormatEnum format = DateFormatEnum.ddmmyyyy,
    String separator = '/',
  }) {
    String day = this.day.toString();
    String month = this.month.toString();
    String year = this.year.toString();

    switch (format) {
      case DateFormatEnum.dmy:
      case DateFormatEnum.mdy:
      case DateFormatEnum.ymd:
        if (year.length >= 2) {
          year = year.substring(year.length - 2);
        }
        break;
      case DateFormatEnum.ddmmyyyy:
      case DateFormatEnum.mmddyyyy:
      case DateFormatEnum.yyyymmdd:
        day = day.padLeft(2, '0');
        month = month.padLeft(2, '0');
        year = year.padLeft(4, '0');
        break;
    }

    List<String> list = [];

    switch (format) {
      case DateFormatEnum.dmy:
      case DateFormatEnum.ddmmyyyy:
        list = [day, month, year];
        break;
      case DateFormatEnum.mdy:
      case DateFormatEnum.mmddyyyy:
        list = [month, day, year];
        break;
      case DateFormatEnum.ymd:
      case DateFormatEnum.yyyymmdd:
        list = [year, month, day];
        break;
    }

    return list.isEmpty ? '' : list.join(separator).trim();
  }

  String formatDatetime({
    DateFormatEnum dateFormat = DateFormatEnum.yyyymmdd,
    TimeFormat timeFormat = TimeFormat.hhmmss,
    String dateSeparator = '/',
    String timeSeparator = ':',
  }) {
    final date = formatDate(
      format: dateFormat,
      separator: dateSeparator,
    );
    String hour = this.hour.toString();
    String minute = this.minute.toString();
    String second = this.second.toString();
    String a = '';
    switch (timeFormat) {
      case TimeFormat.hm:
      case TimeFormat.hms:
        break;
      case TimeFormat.hm12h:
      case TimeFormat.hms12h:
        a = this.hour < 12 ? 'AM' : 'PM';
        hour = (12 - this.hour).abs().toString();
        break;
      case TimeFormat.hhmm:
      case TimeFormat.hhmmss:
        hour = hour.padLeft(2, '0');
        minute = minute.padLeft(2, '0');
        second = second.padLeft(2, '0');
        break;
      case TimeFormat.hhmm12h:
      case TimeFormat.hhmmss12h:
        a = this.hour < 12 ? 'AM' : 'PM';
        hour = (12 - this.hour).abs().toString().padLeft(2, '0');
        minute = minute.padLeft(2, '0');
        second = second.padLeft(2, '0');
        break;
    }
    String time = '';
    switch (timeFormat) {
      case TimeFormat.hm:
      case TimeFormat.hhmm:
      case TimeFormat.hm12h:
      case TimeFormat.hhmm12h:
        time = '$hour$timeSeparator$minute $a';
        break;
      case TimeFormat.hms:
      case TimeFormat.hhmmss:
      case TimeFormat.hms12h:
      case TimeFormat.hhmmss12h:
        time = '$hour$timeSeparator$minute$timeSeparator$second $a';
        break;
    }
    return '$date $time';
  }

  String get dateJsonFormat => formatDate(
        format: DateFormatEnum.yyyymmdd,
        separator: '-',
      );

  String get dateTimeJsonFormat => toIso8601String();

  DateTime get startOfTheDay => copyWith(
        hour: 0,
        minute: 0,
        second: 0,
        microsecond: 0,
        millisecond: 0,
      );

  DateTime get endOfTheDay => copyWith(
        hour: 23,
        minute: 59,
        second: 59,
      );

  DateTime startOfTheWeek() {
    DateTime now = DateTime.now().startOfTheDay;
    int currentDay = now.weekday;
    if (currentDay == DateTime.monday) return now;
    return now.subtract(Duration(days: currentDay - 1));
  }

  DateTime endOfTheWeek() {
    DateTime now = DateTime.now().startOfTheDay;
    int currentDay = now.weekday;
    if (currentDay == DateTime.sunday) return now;
    return now.add(Duration(days: 7 - currentDay)).endOfTheDay;
  }

  String get fileFormat {
    String day = this.day.toString();
    String month = this.month.toString();
    String year = this.year.toString();
    String hour = this.hour.toString();
    String minute = this.minute.toString();
    String second = this.second.toString();
    return '$year-$month-$day-$hour$minute$second';
  }
}

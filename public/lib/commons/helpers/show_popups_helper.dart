import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:auto_size_text/auto_size_text.dart';

class PoPups {
  static Future<bool> confirmAction({
    required BuildContext context,
    String title = '確認しますか？',
    String subtitle = '続行するには「承認」を押してください',
  }) async {
    final resp = await showCupertinoModalPopup<bool>(
      barrierDismissible: true,
      context: context,
      builder: (context) => ConfirmDialog(
        title: title,
        subtitle: subtitle,
      ),
    );
    return resp ?? false;
  }

  void showProgressIndicator(BuildContext context, {String? message}) {
    String msg = message ?? 'Procesando su solicitud...';
    AlertDialog alert = AlertDialog(
      content: Row(
        children: [
          const CircularProgressIndicator(),
          Container(
            margin: const EdgeInsets.only(left: 5),
            child: Text(msg),
          ),
        ],
      ),
    );
    showDialog(
      barrierDismissible: false,
      context: context,
      builder: (BuildContext context) {
        return alert;
      },
    );
  }
}

class ConfirmDialog extends StatelessWidget {
  final String title;
  final String subtitle;
  const ConfirmDialog({
    super.key,
    this.title = '確認しますか？',
    this.subtitle = '続行するには「承認」を押してください',
  });

  @override
  Widget build(BuildContext context) {
    return CupertinoAlertDialog(
      title: Container(
        width: double.infinity,
        height: 50,
        alignment: AlignmentDirectional.center,
        child: AutoSizeText(
          title,
          minFontSize: 12,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          textAlign: TextAlign.center,
        ),
      ),
      content: Text(subtitle),
      actions: [
        TextButton(
          child: const Text(
            'キャンセル',
            style: TextStyle(
              color: Colors.redAccent,
            ),
          ),
          onPressed: () {
            Navigator.pop(context, false);
          },
        ),
        TextButton(
          child: const Text(
            '承認',
          ),
          onPressed: () {
            Navigator.pop(context, true);
          },
        ),
      ],
    );
  }
}

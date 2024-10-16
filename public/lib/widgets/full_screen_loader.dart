import 'package:flutter/material.dart';

class FullScreenLoader extends StatelessWidget {
  final Color? color;
  final double? height;

  const FullScreenLoader({
    super.key,
    this.color,
    this.height,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: height ?? double.infinity,
      width: height ?? double.infinity,
      child: Center(
        child: CircularProgressIndicator(
          strokeWidth: 4,
          color: color ?? Colors.blue,
        ),
      ),
    );
  }
}

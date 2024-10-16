import 'package:flutter/material.dart';

class StepCustom extends StatelessWidget {
  const StepCustom({
    super.key,
    required this.value,
    this.onTap,
  });

  final bool value;
  final void Function()? onTap;

  @override
  Widget build(BuildContext context) {
    final child = value
        ? const Icon(
            Icons.check_circle,
            color: Colors.green,
          )
        : const Icon(
            Icons.touch_app,
            // Icons.cancel_rounded,
            color: Colors.grey,
          );
    return GestureDetector(
      onTap: onTap,
      child: child,
    );
  }
}

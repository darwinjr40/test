import 'package:flutter/material.dart';

class EmptySearchResult extends StatelessWidget {
  final IconData icon;
  final double? iconSize;
  final Color? iconColor;
  final String text;
  final TextStyle? style;
  const EmptySearchResult({
    super.key,
    this.icon = Icons.error_outline,
    this.text = 'No se encontro resultados',
    this.iconSize,
    this.iconColor,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(height: 20),
          Icon(icon),
          const SizedBox(height: 10),
          Text(text, style: style),
        ],
      ),
    );
  }
}

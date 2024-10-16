import 'package:flutter/material.dart';

class CardContainer extends StatelessWidget {
  final Widget child;
  final double horizontal;
  final double vertical;
  final EdgeInsetsGeometry padding;
  const CardContainer({
    super.key,
    required this.child,
    this.horizontal = 30,
    this.vertical = 0,
    this.padding = const EdgeInsets.all(20),
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: horizontal, vertical: vertical),
      child: Container(
        padding: padding,
        width: double.infinity,
        decoration: _createCardShape(),
        child: child,
      ),
    );
  }

  BoxDecoration _createCardShape() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(25),
      boxShadow: const [
        BoxShadow(
          color: Colors.black12,
          blurRadius: 15,
          offset: Offset(0, 5),
        )
      ],
    );
  }
}

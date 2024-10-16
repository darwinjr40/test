import 'package:flutter/material.dart';
import 'package:public/commons/utils/utils.dart';

import 'package:public/screens/views/views.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: ColorResources.cardShadowColor,
        // backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('データ移行'),
      ),
      body: const Center(child: HomeView()),
    );
  }
}

class HomeView extends StatelessWidget {
  const HomeView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(
          // maxWidth: 1200,
          ),
      child: const Center(
        child: Padding(
          padding: EdgeInsets.all(Dimensions.paddingSizeDefault),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(child: CheckView()),
              SizedBox(width: Dimensions.paddingSizeDefault),
              Expanded(flex: 3, child: LogView()),
            ],
          ),
        ),
      ),
    );
  }
}

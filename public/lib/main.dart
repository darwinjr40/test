// import 'dart:ui';

import 'package:flutter/material.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:public/blocs/blocs.dart';
import 'package:public/screens/screens.dart';
import 'package:public/services/notifications_service.dart';

void main() async {
  // await dotenv.load(fileName: '.env');
  runApp(const AppState());
}

class AppState extends StatelessWidget {
  const AppState({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          lazy: false,
          create: (_) => LogCubit(),
        ),
        BlocProvider(
          lazy: false,
          create: (_) => MigrateCubit(),
        ),
      ],
      child: const MyApp(),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Nurse-is',
      theme: ThemeData(
        colorScheme:
            ColorScheme.fromSeed(seedColor: const Color.fromARGB(255, 8, 8, 8)),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
      scaffoldMessengerKey: NotificationsService.messengerKey,
    );
  }
}

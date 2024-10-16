import 'package:flutter/material.dart';

class NotificationsService {
  static GlobalKey<ScaffoldMessengerState> messengerKey =
      GlobalKey<ScaffoldMessengerState>();

  static showSnackbarDanger(String message) {
    final snackBar = SnackBar(
      duration: const Duration(seconds: 8),
      backgroundColor: const Color.fromARGB(174, 224, 40, 26),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 15,
          fontWeight: FontWeight.bold,
        ),
      ),
    );

    messengerKey.currentState?.showSnackBar(snackBar);
  }

  static showSnackbarSuccess(String message) {
    final snackBar = SnackBar(
      duration: const Duration(seconds: 8),
      backgroundColor: const Color.fromARGB(173, 20, 138, 37),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 15,
          fontWeight: FontWeight.bold,
        ),
      ),
    );

    messengerKey.currentState?.showSnackBar(snackBar);
  }

  static showSnackbarPrimary(String message) {
    final snackBar = SnackBar(
      backgroundColor: const Color.fromARGB(172, 28, 127, 219),
      content: Text(
        message,
        textAlign: TextAlign.center,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 15,
          fontWeight: FontWeight.bold,
        ),
      ),
    );

    messengerKey.currentState?.showSnackBar(snackBar);
  }

  static showSnackbarLoading(String message) {
    final snackBar = SnackBar(
      backgroundColor: const Color.fromARGB(172, 102, 112, 121),
      content: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          const CircularProgressIndicator(),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );

    messengerKey.currentState?.showSnackBar(snackBar);
  }

  static showSnackbarCustomLoading(String message, Duration duration) {
    final snackBar = SnackBar(
      duration: duration,
      backgroundColor: const Color.fromARGB(172, 102, 112, 121),
      content: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          const CircularProgressIndicator(),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );

    messengerKey.currentState?.showSnackBar(snackBar);
  }
}

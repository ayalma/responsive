import 'package:flutter/material.dart';
import 'package:fl_responsive/src/model/device_info.dart';

class ResponsiveBuilder extends StatelessWidget {
  final Widget Function(
    BuildContext context,
    DeviceInfo deviceInfo,
  ) builder;
  const ResponsiveBuilder({Key? key, required this.builder}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, boxConstraints) {
      var mediaQuery = MediaQuery.of(context);
      var deviceInfo = DeviceInfo(
        mediaQuery,
        Size(boxConstraints.maxWidth, boxConstraints.maxHeight),
      );
      return builder(context, deviceInfo);
    });
  }
}

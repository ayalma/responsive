import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_responsive/src/model/device_type.dart';
import 'package:fl_responsive/src/builder/builder.dart';

class ScreenTypeLayout extends StatelessWidget {
  // Mobile will be returned by default
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ScreenTypeLayout(
      {Key? key, required this.mobile, this.tablet, this.desktop})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ResponsiveBuilder(builder: (context, deviceInfo) {
      Widget? selectedWidget = mobile;
      // If sizing indicates Tablet and we have a tablet widget then return
      if (deviceInfo.deviceType == DeviceType.Tablet) {
        if (tablet != null) {
          selectedWidget = tablet;
        }
      }

      // If sizing indicates desktop and we have a desktop widget then return
      else if (deviceInfo.deviceType == DeviceType.Desktop) {
        if (desktop != null) {
          selectedWidget = desktop;
        }
      }

      return Provider.value(
        value: deviceInfo,
        child: selectedWidget,
      );
    });
  }
}

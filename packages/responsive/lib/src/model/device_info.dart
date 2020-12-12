import 'dart:math';

import 'package:flutter/material.dart';

import 'device_size.dart';
import 'device_type.dart';

/// Combines [MobileDeviceType] and [DeviceSize].
abstract class DeviceInfo {
  final Size screenSize;
  final Size localWidgetSize;

  factory DeviceInfo(MediaQueryData data, Size localWidgetSize) =>
      data.orientation == Orientation.portrait
          ? _PortraitDeviceInfo(data.size, localWidgetSize)
          : _LandscapeDeviceInfo(data.size, localWidgetSize);

  DeviceInfo._(this.screenSize, this.localWidgetSize);

  /// Determines whether the device is a handset or tablet.
  ///
  /// Note that for some devices the device type may change depending
  /// on its orientation.
  DeviceType get deviceType;

  /// Determines the symbolic size of a device.
  ///
  /// Note that for some devices the device size may change depending
  /// on its orientation.
  DeviceSize get deviceSize;

  /// Returns the recommended number of grid layout columns.
  int get columns {
    if (_width < 600.0) {
      return 4;
    }

    if (_width < 840.0) {
      return 8;
    }

    return 12;
  }

  /// Returns the recommended gutter width, in logical pixels.
  double get gutter {
    if (_minDimension < 600.0) {
      return _width < 960.0 ? 16.0 : 24.0;
    } else {
      return _width < 600.0 ? 16.0 : 24.0;
    }
  }

  double get _width => screenSize.width;

  double get _minDimension => min(screenSize.width, screenSize.height);
}

class _PortraitDeviceInfo extends DeviceInfo {
  _PortraitDeviceInfo(Size deviceSize, Size localWidgetSize)
      : super._(deviceSize, localWidgetSize);

  @override
  DeviceType get deviceType {
    if (_width < 600)
      return DeviceType.Mobile;
    else if (_width < 960)
      return DeviceType.Tablet;
    else
      return DeviceType.Desktop;
  }

  @override
  DeviceSize get deviceSize {
    // handsets
    if (_width < 360.0) {
      return DeviceSize.small;
    }

    if (_width < 400.0) {
      return DeviceSize.medium;
    }

    if (_width < 600.0) {
      return DeviceSize.large;
    }
    // tablets
    if (_width < 720.0) {
      return DeviceSize.small;
    }

    return DeviceSize.large;
  }
}

class _LandscapeDeviceInfo extends DeviceInfo {
  _LandscapeDeviceInfo(Size deviceSize, Size localWidgetSize)
      : super._(deviceSize, localWidgetSize);

  // @override
  // DeviceType get deviceType =>
  //     _width < 960.0 ? DeviceType.Mobile : DeviceType.Tablet;

  @override
  DeviceType get deviceType {
    if (_width < 960)
      return DeviceType.Mobile;
    else if (_width < 1440)
      return DeviceType.Tablet;
    else
      return DeviceType.Desktop;
  }

  @override
  DeviceSize get deviceSize {
    // handsets
    if (_width < 600.0) {
      return DeviceSize.small;
    }

    if (_width < 720.0) {
      return DeviceSize.medium;
    }

    if (_width < 960.0) {
      return DeviceSize.large;
    }
    // tablets
    if (_width < 1024.0) {
      return DeviceSize.small;
    }

    return DeviceSize.large;
  }
}

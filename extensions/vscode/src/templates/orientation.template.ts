import * as changeCase from "change-case";

export function getOrientationTemplate(viewName: string,screenType:string) {
    const snakeCaseViewName = changeCase.snakeCase(viewName.toLowerCase());
    const pascalCaseBlocName = changeCase.pascalCase(viewName.toLowerCase());
    const screenTypeName = changeCase.pascalCase(screenType.toLowerCase());
    return `
    import 'package:flutter/material.dart';
    import 'package:gpos_commons/src/utils/responsive/responsive.dart';
    
    import '${snakeCaseViewName}_${screenType}_landscape.dart';
    import '${snakeCaseViewName}_${screenType}_portrait.dart';
    
    class ${pascalCaseBlocName}${screenTypeName} extends StatelessWidget {
      const ${pascalCaseBlocName}${screenTypeName}({Key key}) : super(key: key);
    
      @override
      Widget build(BuildContext context) => OrientationLayout(
            portrait: ${pascalCaseBlocName}${screenTypeName}Portrait(),
            landscape: ${pascalCaseBlocName}${screenTypeName}Landscape(),
          );
    }
    `;
}

export function getScreenTemplate(viewName: string,screenType:string,orientation:string) {
    // const snakeCaseViewName = changeCase.snakeCase(viewName.toLowerCase());
     const pascalCaseBlocName = changeCase.pascalCase(viewName.toLowerCase());
    const screenTypeName = changeCase.pascalCase(screenType.toLowerCase());
    const orientationName = changeCase.pascalCase(orientation.toLowerCase());
    return `
    import 'package:flutter/material.dart';
    
    class ${pascalCaseBlocName}${screenTypeName}${orientationName} extends StatelessWidget {
      const ${pascalCaseBlocName}${screenTypeName}${orientationName}({Key key}) : super(key: key);
    
      @override
      Widget build(BuildContext context) => Container(
            child: Text("${pascalCaseBlocName} ${screenTypeName} ${orientationName}"),
          );
    }
    `;
}

export function getTypeLayoutTemplate(viewName: string) {
    const snakeCaseViewName = changeCase.snakeCase(viewName.toLowerCase());
    const pascalCaseBlocName = changeCase.pascalCase(viewName.toLowerCase());
    return `
    import 'package:flutter/material.dart';
    import 'package:gpos_commons/src/utils/responsive/responsive.dart';
    import 'mobile/${snakeCaseViewName}_mobile.dart';
    import 'tablet/${snakeCaseViewName}_tablet.dart';
    import 'desktop/${snakeCaseViewName}_desktop.dart';

    class ${pascalCaseBlocName}View extends StatelessWidget {
    const ${pascalCaseBlocName}View({Key key}) : super(key: key);

    @override
    Widget build(BuildContext context) => SafeArea(
            child: ScreenTypeLayout(
            mobile: ${pascalCaseBlocName}Mobile(),
            tablet: ${pascalCaseBlocName}Tablet(),
            desktop: ${pascalCaseBlocName}Desktop(),
            ),
        );
    }
    `;
}
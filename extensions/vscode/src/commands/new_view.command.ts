import * as _ from "lodash";
import * as changeCase from "change-case";

import { InputBoxOptions, OpenDialogOptions, Uri, window } from "vscode";
import { existsSync, lstatSync, writeFile } from "fs";

import { getOrientationTemplate, getScreenTemplate, getTypeLayoutTemplate } from "../templates";
import mkdirp = require("mkdirp");

export const newView = async (uri: Uri) => {
    const viewName = await promptForviewName();
    if (_.isNil(viewName) || viewName.trim() === "") {
        window.showErrorMessage("The view name must not be empty");
        return;
    }

    let targetDirectory;
    if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
        targetDirectory = await promptForTargetDirectory();
        if (_.isNil(targetDirectory)) {
            window.showErrorMessage("Please select a valid directory");
            return;
        }
    } else {
        targetDirectory = uri.fsPath;
    }

    //const blocType = await getBlocType(TemplateType.Bloc);
    const pascalCaseViewName = changeCase.pascalCase(viewName.toLowerCase());
    try {
        await generateOreintationCode(viewName, targetDirectory);
        window.showInformationMessage(
            `Successfully Generated ${pascalCaseViewName} View in ${targetDirectory}`
        );
    } catch (error) {
        window.showErrorMessage(
            `Error:
          ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
};

function promptForviewName(): Thenable<string | undefined> {
    const viewNamePromptOptions: InputBoxOptions = {
        prompt: "view name",
        placeHolder: "view",
    };
    return window.showInputBox(viewNamePromptOptions);
}

async function promptForTargetDirectory(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
        canSelectMany: false,
        openLabel: "Select a folder to create the view in",
        canSelectFolders: true,
    };

    return window.showOpenDialog(options).then((uri) => {
        if (_.isNil(uri) || _.isEmpty(uri)) {
            return undefined;
        }
        return uri[0].fsPath;
    });
}

async function generateOreintationCode(
    viewName: string,
    targetDirectory: string,
) {
    const viewDirectoryPath = `${targetDirectory}/view`;
    if (!existsSync(viewDirectoryPath)) {
        await createDirectory(viewDirectoryPath);
    }

    const mobileDirectoryPath = `${viewDirectoryPath}/mobile`
    if (!existsSync(mobileDirectoryPath)) {
        await createDirectory(mobileDirectoryPath);
    }

    const tabletDirectoryPath = `${viewDirectoryPath}/tablet`
    if (!existsSync(tabletDirectoryPath)) {
        await createDirectory(tabletDirectoryPath);
    }

    const desktopDirectoryPath = `${viewDirectoryPath}/desktop`
    if (!existsSync(desktopDirectoryPath)) {
        await createDirectory(desktopDirectoryPath);
    }
    await Promise.all([
        createViewTemplate(viewName, viewDirectoryPath),
        createOrientationTemplate(viewName, mobileDirectoryPath, "mobile"),
        createScreenTemplate(viewName, mobileDirectoryPath, "mobile", "landscape"),
        createScreenTemplate(viewName, mobileDirectoryPath, "mobile", "portrait"),

        createOrientationTemplate(viewName, tabletDirectoryPath, "tablet"),
        createScreenTemplate(viewName, tabletDirectoryPath, "tablet", "landscape"),
        createScreenTemplate(viewName, tabletDirectoryPath, "tablet", "portrait"),

        createOrientationTemplate(viewName, desktopDirectoryPath, "desktop"),
        createScreenTemplate(viewName, desktopDirectoryPath, "desktop", "landscape"),
        createScreenTemplate(viewName, desktopDirectoryPath, "desktop", "portrait"),
        // createBlocStateTemplate(viewName, targetDirectory, type),
        // createBlocTemplate(viewName, targetDirectory, type),
    ]);
}

function createDirectory(targetDirectory: string): Promise<string | undefined> {
    return mkdirp(targetDirectory);
}

function createViewTemplate(
    viewName: string,
    targetDirectory: string,
) {
    const snakeCaseviewName = changeCase.snakeCase(viewName.toLowerCase());
    const targetPath = `${targetDirectory}/${snakeCaseviewName}_view.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseviewName}_view.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getTypeLayoutTemplate(viewName),
            "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

function createOrientationTemplate(
    viewName: string,
    targetDirectory: string,
    screenType: string,
) {
    const snakeCaseviewName = changeCase.snakeCase(viewName.toLowerCase());
    const targetPath = `${targetDirectory}/${snakeCaseviewName}_${screenType}.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseviewName}_${screenType}.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getOrientationTemplate(viewName, screenType),
            "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

function createScreenTemplate(
    viewName: string,
    targetDirectory: string,
    screenType: string,
    orientation: string,
) {
    const snakeCaseviewName = changeCase.snakeCase(viewName.toLowerCase());
    const targetPath = `${targetDirectory}/${snakeCaseviewName}_${screenType}_${orientation}.dart`;
    if (existsSync(targetPath)) {
        throw Error(`${snakeCaseviewName}_${screenType}_${orientation}.dart already exists`);
    }
    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetPath,
            getScreenTemplate(viewName, screenType, orientation),
            "utf8",
            (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

// function createBlocStateTemplate(
//     viewName: string,
//     targetDirectory: string,
//     type: BlocType
// ) {
//     const snakeCaseviewName = changeCase.snakeCase(viewName.toLowerCase());
//     const targetPath = `${targetDirectory}/bloc/${snakeCaseviewName}_state.dart`;
//     if (existsSync(targetPath)) {
//         throw Error(`${snakeCaseviewName}_state.dart already exists`);
//     }
//     return new Promise(async (resolve, reject) => {
//         writeFile(
//             targetPath,
//             getBlocStateTemplate(viewName, type),
//             "utf8",
//             (error) => {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }
//                 resolve();
//             }
//         );
//     });
// }

// function createBlocTemplate(
//     viewName: string,
//     targetDirectory: string,
//     type: BlocType
// ) {
//     const snakeCaseviewName = changeCase.snakeCase(viewName.toLowerCase());
//     const targetPath = `${targetDirectory}/bloc/${snakeCaseviewName}_bloc.dart`;
//     if (existsSync(targetPath)) {
//         throw Error(`${snakeCaseviewName}_bloc.dart already exists`);
//     }
//     return new Promise(async (resolve, reject) => {
//         writeFile(targetPath, getBlocTemplate(viewName, type), "utf8", (error) => {
//             if (error) {
//                 reject(error);
//                 return;
//             }
//             resolve();
//         });
//     });
// }
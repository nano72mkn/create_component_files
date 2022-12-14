// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { writeFileSync } from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "create-react-component-files" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "create-react-component-files.createFile",
    async (sender) => {
      try {
        console.log(1, sender);
        if (!sender.path) return;

        console.log(2);

        console.log(3);
        // コンポーネント名を入力するダイアログを表示
        const componentName = await vscode.window.showInputBox({
          title: "コンポーネント名を入力してください",
        });

        // 入力がなければ処理を終了
        if (componentName === undefined) {
          return;
        }
        console.log(4);

        // vscode.;
        const newDir = vscode.Uri.joinPath(sender, componentName);
        console.log(5, newDir.path);

        await vscode.workspace.fs.createDirectory(newDir);

        const indexFile = vscode.Uri.joinPath(newDir, "index.ts");
        const indexFileBlob: Uint8Array = Buffer.from(
          `export * from "./${componentName}.tsx";`
        );
        const indexFileRes = await writeFileSync(indexFile.path, indexFileBlob);

        const componentFile = vscode.Uri.joinPath(
          newDir,
          `${componentName}.tsx`
        );
        const componentFileBlob: Uint8Array = Buffer.from(
          `import { FC } from 'react';\n\nexport const ${componentName}: FC = () => {\n  return <></>;\n}`
        );
        const componentFileRes = await writeFileSync(
          componentFile.path,
          componentFileBlob
        );

        console.log(6, indexFileRes, componentFileRes);
        // 右下にメッセージを表示
        vscode.window.showInformationMessage(
          `Hello World from create-react-component-files! ${componentName}`
        );
      } catch (error) {
        console.error(error);
        vscode.window.showErrorMessage("コンポーネントの生成に失敗しました。");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

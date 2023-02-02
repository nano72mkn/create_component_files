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
        if (!sender.path) return;

        // コンポーネント名を入力するダイアログを表示
        const componentName = await vscode.window.showInputBox({
          title: "コンポーネント名を入力してください",
        });

        // 入力がなければ処理を終了
        if (componentName === undefined) {
          return;
        }

        // vscode.;
        const newDir = vscode.Uri.joinPath(sender, componentName);

        await vscode.workspace.fs.createDirectory(newDir);

        const indexFile = vscode.Uri.joinPath(newDir, "index.ts");
        const indexFileBlob: Uint8Array = Buffer.from(
          `export * from './${componentName}';`
        );
        await writeFileSync(indexFile.path, indexFileBlob);

        const componentFile = vscode.Uri.joinPath(
          newDir,
          `${componentName}.tsx`
        );
        const componentFileBlob: Uint8Array = Buffer.from(
          `import { FC } from 'react';\n\nexport const ${componentName}: FC = () => {\n  return <></>;\n};\n`
        );
        await writeFileSync(componentFile.path, componentFileBlob);

        const storybookFile = vscode.Uri.joinPath(
          newDir,
          `${componentName}.stories.tsx`
        );
        const storybookFileBlob: Uint8Array = Buffer.from(
          `import { ComponentMeta, ComponentStory } from '@storybook/react';\n\nimport { ${componentName} } from './index';\n\nexport default {\n  title: '${componentName}',\n  components: ${componentName},\n} as ComponentMeta<typeof ${componentName}>;\n\nconst Template: ComponentStory<typeof ${componentName}> = (args) => (\n  <${componentName} {...args} />\n);\n\nexport const Default = Template.bind({});`
        );
        await writeFileSync(storybookFile.path, storybookFileBlob);

        vscode.workspace.openTextDocument(componentFile).then((doc) => {
          vscode.window.showTextDocument(doc);
        });

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

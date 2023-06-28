import * as vscode from 'vscode';
import { ListOpenFilesProvider } from './provider';
import {
  LIST_OPEN_FILES_SCHEME,
  LIST_OPEN_FILE_PATHS,
  LIST_OPEN_FILE_ABSPATHS,
  LIST_OPEN_FILE_NAMES,
  ALL_PROVIDED_DOCUMENTS,
} from './constants';

export function activate(context: vscode.ExtensionContext) {
  const documentProvider = new ListOpenFilesProvider();
  function updateProvidedDocuments() {
    for (const path of ALL_PROVIDED_DOCUMENTS) {
      documentProvider.fireChangeEvent(vscode.Uri.from({ scheme: LIST_OPEN_FILES_SCHEME, path }));
    }
  }
  async function openProvidedDocument(path: string): Promise<vscode.TextEditor> {
    const uri = vscode.Uri.from({ scheme: LIST_OPEN_FILES_SCHEME, path });
    documentProvider.fireChangeEvent(uri);
    const document = await vscode.workspace.openTextDocument(uri);
    return vscode.window.showTextDocument(document);
  }

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(LIST_OPEN_FILES_SCHEME, documentProvider),
    vscode.workspace.onDidOpenTextDocument(updateProvidedDocuments),
    vscode.workspace.onDidCloseTextDocument(updateProvidedDocuments),
    vscode.commands.registerCommand('list-open-files.list-open-file-paths', () => {
      openProvidedDocument(LIST_OPEN_FILE_PATHS);
    }),
    vscode.commands.registerCommand('list-open-files.list-open-file-abspaths', () => {
      openProvidedDocument(LIST_OPEN_FILE_ABSPATHS);
    }),
    vscode.commands.registerCommand('list-open-files.list-open-file-names', () => {
      openProvidedDocument(LIST_OPEN_FILE_NAMES);
    }),
  );
}

export function deactivate() {}

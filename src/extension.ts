import * as vscode from 'vscode';
import {
  LIST_OPEN_FILES_SCHEME,
  LIST_OPEN_FILE_ABSPATHS,
  LIST_OPEN_FILE_RELPATHS,
  LIST_OPEN_FILE_NAMES,
  ALL_PROVIDED_DOCUMENTS,
} from './constants';
import { Logger } from './logger';
import { ListOpenFilesProvider } from './provider';
import { reopenFiles } from './functions/reopenFiles';

let logger: Logger;

export function activate(context: vscode.ExtensionContext): void {
  logger = new Logger();
  try {
    logger.debug('Activating extension...');
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
      vscode.commands.registerCommand('list-open-files.list-open-file-abspaths', () => {
        openProvidedDocument(LIST_OPEN_FILE_ABSPATHS);
      }),
      vscode.commands.registerCommand('list-open-files.list-open-file-relpaths', () => {
        openProvidedDocument(LIST_OPEN_FILE_RELPATHS);
      }),
      vscode.commands.registerCommand('list-open-files.list-open-file-names', () => {
        openProvidedDocument(LIST_OPEN_FILE_NAMES);
      }),
      vscode.commands.registerCommand('list-open-files.reopen-files', () => {
        reopenFiles();
      }),
    );
    logger.info('Extension activated.');
  } catch (ex) {
    logger.rethrow('Error activating extension:', ex);
  }
}

export function deactivate(): void {
  try {
    logger.debug('Deactivating extension...');
    logger.info('Extension deactivated.');
    logger.dispose();
  } catch (ex) {
    logger.rethrow('Error deactivating extension:', ex);
  }
}

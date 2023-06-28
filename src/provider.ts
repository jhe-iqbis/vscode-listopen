import * as vscode from 'vscode';
import { LIST_OPEN_FILE_PATHS, LIST_OPEN_FILE_ABSPATHS, LIST_OPEN_FILE_NAMES } from './constants';

export class ListOpenFilesProvider implements vscode.TextDocumentContentProvider {
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

  get onDidChange() {
    return this._onDidChange.event;
  }

  fireChangeEvent(uri: vscode.Uri) {
    return this._onDidChange.fire(uri);
  }

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): string {
    let getText: (tab: vscode.Tab) => string;
    switch (uri.path) {
      case LIST_OPEN_FILE_PATHS:
        getText = (tab: vscode.Tab): string =>
          // @ts-ignore
          tab.input.uri.path;
        break;
      case LIST_OPEN_FILE_ABSPATHS:
        getText = (tab: vscode.Tab): string =>
          // @ts-ignore
          tab.input.uri.fsPath;
        break;
      case LIST_OPEN_FILE_NAMES:
        getText = (tab: vscode.Tab) => tab.label;
        break;
      default:
        return 'An internal error occurred.';
    }
    const result = vscode.window.tabGroups.all
      .map((tabGroup) =>
        tabGroup.tabs
          .filter(
            (tab) =>
              // @ts-ignore
              tab.input.uri && tab.input.uri.scheme === 'file',
          )
          .map(getText)
          .filter(Boolean) // ignore tabs without paths or names
          .join('\n'),
      )
      .filter(Boolean) // ignore empty tab groups
      .join('\n');
    return result;
  }
}

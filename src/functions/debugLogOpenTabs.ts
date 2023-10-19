import * as vscode from 'vscode';

export async function debugLogOpenTabs(): Promise<void> {
  console.log('vscode.window.tabGroups.activeTabGroup', vscode.window.tabGroups.activeTabGroup);
  console.log('vscode.window.tabGroups.all', vscode.window.tabGroups.all);
}

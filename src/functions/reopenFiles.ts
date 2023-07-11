import * as vscode from 'vscode';
import { LOGGER } from '../logger';

export async function reopenFiles(): Promise<void> {
  LOGGER.debug('Reopening files...');
  for (const tabGroup of vscode.window.tabGroups.all) {
    const tabGroupId = tabGroup.viewColumn;
    LOGGER.debug(`Collecting file tabs from tab group ${tabGroupId}...`);
    const tabs = tabGroup.tabs.filter(
      (tab) =>
        // @ts-ignore
        tab.input?.uri && tab.input.uri.scheme === 'file',
    );
    LOGGER.debug(`Closing ${tabs.length} tabs in group ${tabGroupId}...`);
    if (!(await vscode.window.tabGroups.close(tabs))) {
      LOGGER.error(`An unexpected error occurred while trying to close ${tabs.length} tabs in group ${tabGroupId}.`);
      continue;
    }
    LOGGER.debug(`Reopening files in tab group ${tabGroupId}...`);
    await Promise.all(
      tabs.map(async (tab) => {
        try {
          await vscode.window.showTextDocument(tab.input as vscode.TextDocument, {
            preview: false,
            preserveFocus: true,
          });
        } catch {
          // HACK This will only succeed for the first document, but all documents will be opened in the end.
        }
      }),
    );
    // Safe alternative:
    // for (const tab of tabs) {
    //   await vscode.window.showTextDocument(tab.input as vscode.TextDocument, { preview: false, preserveFocus: true });
    // }
    LOGGER.info(`Reopened ${tabs.length} files for tab group ${tabGroupId}.`);
  }
}

import * as vscode from 'vscode';
import { LOGGER } from '../logger';

export async function closeDiffEditors(): Promise<void> {
  LOGGER.debug('Closing diff editors...');
  for (const tabGroup of vscode.window.tabGroups.all) {
    const tabGroupId = tabGroup.viewColumn;
    LOGGER.debug(`Collecting diff editor tabs from tab group ${tabGroupId}...`);
    const tabs = tabGroup.tabs.filter(
      (tab) =>
        // @ts-ignore
        tab.input && tab.input.original && tab.input.modified,
    );
    LOGGER.debug(`Closing ${tabs.length} tabs in group ${tabGroupId}...`);
    if (!(await vscode.window.tabGroups.close(tabs))) {
      LOGGER.error(`An unexpected error occurred while trying to close ${tabs.length} tabs in group ${tabGroupId}.`);
      continue;
    }
    LOGGER.info(`Closed ${tabs.length} diff editors for tab group ${tabGroupId}.`);
  }
}

import * as vscode from 'vscode';
import { LIST_OPEN_FILES_SCHEME } from './constants';

export let LOGGER: Logger;

export class Logger {
  private _outputChannel: vscode.LogOutputChannel;

  constructor() {
    this._outputChannel = vscode.window.createOutputChannel(LIST_OPEN_FILES_SCHEME, { log: true });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    LOGGER = this;
  }

  dispose(): void {
    this._outputChannel.dispose();
  }

  clear(): void {
    this._outputChannel.clear();
  }

  show(preserveFocus: boolean | undefined = false): void {
    this._outputChannel.show(preserveFocus);
  }

  hide(): void {
    this._outputChannel.hide();
  }

  debug(message: string, ...args: any[]): void {
    this._outputChannel.debug(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this._outputChannel.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this._outputChannel.warn(message, ...args);
  }

  error(error: string | Error, ...args: any[]): void {
    this._outputChannel.error(error, ...args);
  }

  except(msg: string, ex: Error | unknown): void {
    this._outputChannel.error(msg);
    this._outputChannel.error(ex as Error);
    this._outputChannel.show();
  }

  rethrow(msg: string, ex: Error | unknown): never {
    this.except(msg, ex);
    throw ex;
  }
}

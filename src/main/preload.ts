// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';

export type Channels =
  | 'get-audio-buffers'
  | 'open-file-dialog'
  | 'get-all-patterns'
  | 'get-all-instruments'
  | 'create-pattern'
  | 'update-pattern'
  | 'delete-pattern'
  | 'create-instrument'
  | 'update-instrument'
  | 'delete-instrument';

const electronHandler = {
  ipcRenderer: {
    invokeMessage(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

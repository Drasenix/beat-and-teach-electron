export default async function saveRecordedAudio(
  buffer: ArrayBuffer,
): Promise<string> {
  return window.electron.ipcRenderer.invokeMessage(
    'save-recorded-audio',
    new Uint8Array(buffer),
  );
}

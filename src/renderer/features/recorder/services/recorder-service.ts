async function openAudioSaveDialog(): Promise<string | null> {
  return window.electron.ipcRenderer.invokeMessage('open-audio-save-dialog');
}

export default async function saveRecordedAudio(
  buffer: ArrayBuffer,
): Promise<string | null> {
  const filePath = await openAudioSaveDialog();
  if (filePath === null) return null;

  return window.electron.ipcRenderer.invokeMessage('save-recorded-audio', {
    data: new Uint8Array(buffer),
    filePath,
  });
}

import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';

export async function getAudioBuffers(
  fileNames: string[],
): Promise<AudioFileBuffer> {
  return await window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    fileNames,
  );
}

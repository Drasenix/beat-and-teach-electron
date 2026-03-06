import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';

export async function getAudioBuffers(
  fileNames: string[],
): Promise<AudioFileBuffer> {
  return await window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    fileNames,
  );
}

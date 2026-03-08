import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import { InstrumentFilePath } from '../../../../shared/types/instrument-file-path';

export async function getAudioBuffers(
  filePaths: InstrumentFilePath[],
): Promise<AudioFileBuffer> {
  return await window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    filePaths,
  );
}

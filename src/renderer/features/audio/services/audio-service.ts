import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import { InstrumentFilePath } from '../../../../shared/types/instrument';

export default async function getAudioBuffers(
  filePaths: InstrumentFilePath[],
): Promise<AudioFileBuffer> {
  return window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    filePaths,
  );
}

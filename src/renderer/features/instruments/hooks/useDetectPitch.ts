import { useCallback } from 'react';
import * as Tone from 'tone';
import getAudioBuffers from '../../audio/services/audio-service';
import detectPitch from '../../../utils/detect-pitch';

export default function useDetectPitch(
  filepath: string | null,
  symbol: string,
): () => Promise<number | null> {
  return useCallback(async (): Promise<number | null> => {
    if (!filepath) return null;
    const buffers = await getAudioBuffers([{ name: symbol, filepath }]);
    const context = Tone.getContext();
    const bufferKey = Object.keys(buffers)[0];
    const arrayBuffer = buffers[bufferKey];
    if (!arrayBuffer) return null;
    const audioBuffer = await context.decodeAudioData(
      arrayBuffer as ArrayBuffer,
    );
    const channelData = audioBuffer.getChannelData(0);
    return detectPitch(channelData, audioBuffer.sampleRate);
  }, [filepath, symbol]);
}

import { useState, useRef, useCallback } from 'react';
import { RecordingState } from '../models/recorder-model';
import encodeWav from '../utils/wav-encoder';

function concatenateSamples(chunks: Float32Array[]): Float32Array {
  let totalLength = 0;
  chunks.forEach((chunk) => {
    totalLength += chunk.length;
  });
  const result = new Float32Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
}

export default function useRecorder() {
  const [state, setState] = useState<RecordingState>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [wavBuffer, setWavBuffer] = useState<ArrayBuffer | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const samplesRef = useRef<Float32Array[]>([]);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(1024, 1, 1);
      processorRef.current = processor;

      samplesRef.current = [];

      processor.onaudioprocess = (event: AudioProcessingEvent) => {
        const input = event.inputBuffer.getChannelData(0);
        samplesRef.current.push(new Float32Array(input));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setState('recording');
      setAudioUrl(null);
      setWavBuffer(null);
      setDuration(0);
      startTimeRef.current = Date.now();

      timerRef.current = window.setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 100);
    } catch {
      setState('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (sourceRef.current !== null && processorRef.current !== null) {
      sourceRef.current.disconnect();
      processorRef.current.disconnect();
    }

    if (streamRef.current !== null) {
      streamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    }

    const sampleRate = audioContextRef.current?.sampleRate ?? 44100;

    if (audioContextRef.current !== null) {
      audioContextRef.current.close();
    }

    const allSamples = concatenateSamples(samplesRef.current);
    const buffer = encodeWav(allSamples, sampleRate);
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    setWavBuffer(buffer);
    setAudioUrl(url);
    setState('recorded');

    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioContextRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    if (audioUrl !== null) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setWavBuffer(null);
    setState('idle');
    setDuration(0);
  }, [audioUrl]);

  return {
    state,
    audioUrl,
    duration,
    wavBuffer,
    startRecording,
    stopRecording,
    cleanup,
  };
}

import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  playPattern,
  stopPattern,
  changeTempo,
  playInstrument,
  updatePattern,
} from '../facade/audio-facade';

type AudioContextType = {
  playing: boolean;
  activeStep: number | null;
  playTrack: (sentences: string[], bpm: number) => Promise<void>;
  stopTrack: () => void;
  changeBpm: (bpm: number) => void;
  playInstrument: (filepath: string, name: string) => Promise<void>;
  updateTrack: (sentences: string[]) => Promise<void>;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const playingRef = useRef(false);

  const handleStep = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex);
  }, []);

  const value = useMemo<AudioContextType>(
    () => ({
      playing,
      activeStep,
      playTrack: async (sentences: string[], bpm: number): Promise<void> => {
        if (playingRef.current) return;
        playingRef.current = true;
        setPlaying(true);
        try {
          await playPattern(sentences, bpm, handleStep);
        } catch (error) {
          playingRef.current = false;
          setPlaying(false);
          setActiveStep(null);
          // eslint-disable-next-line no-alert
          alert(error);
        }
      },
      stopTrack: (): void => {
        stopPattern();
        playingRef.current = false;
        setPlaying(false);
        setActiveStep(null);
      },
      changeBpm: (bpm: number): void => {
        changeTempo(bpm);
      },
      playInstrument: async (filepath: string, name: string): Promise<void> => {
        try {
          await playInstrument(filepath, name);
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(error);
        }
      },
      updateTrack: async (sentences: string[]): Promise<void> => {
        try {
          await updatePattern(sentences);
        } catch {
          // Silencieux — l'édition reste réactive
        }
      },
    }),
    [playing, activeStep, handleStep],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error('useAudioContext must be used within AudioProvider');
  return context;
}

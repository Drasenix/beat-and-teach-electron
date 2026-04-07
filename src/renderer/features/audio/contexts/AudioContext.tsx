import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import {
  playPattern,
  stopPattern,
  changeTempo,
  playInstrument,
} from '../facade/audio-facade';

type AudioContextType = {
  playing: boolean;
  activeStep: number | null;
  playTrack: (sentences: string[], bpm: number) => Promise<void>;
  stopTrack: () => void;
  changeBpm: (bpm: number) => void;
  playInstrument: (filepath: string, name: string) => Promise<void>;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStep = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex);
  }, []);

  const value = useMemo<AudioContextType>(
    () => ({
      playing,
      activeStep,
      playTrack: async (sentences: string[], bpm: number): Promise<void> => {
        try {
          await playPattern(sentences, bpm, handleStep);
          setPlaying(true);
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(error);
        }
      },
      stopTrack: (): void => {
        stopPattern();
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

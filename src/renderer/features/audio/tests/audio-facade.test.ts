import { updatePattern } from '../facade/audio-facade';
import AudioEngine from '../engine/audio-engine';
import * as tokenizer from '../../../utils/sentence-tokenizer';
import getAudioBuffers from '../services/audio-service';
import { getInstrumentFilePathsFromSymbol } from '../../instruments/facade/instrument-facade';
import { preparePattern } from '../../sequence/facade/sequence-facade';

jest.mock('tone', () => ({
  Sequence: jest.fn(() => ({
    events: [],
    start: jest.fn(),
    dispose: jest.fn(),
  })),
  Players: jest.fn(() => ({
    add: jest.fn(),
    player: jest.fn(() => ({ start: jest.fn() })),
    toDestination: jest.fn(),
    dispose: jest.fn(),
  })),
  Loop: jest.fn(() => ({ start: jest.fn(), dispose: jest.fn() })),
  getContext: jest.fn(() => ({
    decodeAudioData: jest.fn().mockResolvedValue({}),
  })),
  getTransport: jest.fn(() => ({ bpm: { value: 120 } })),
}));

jest.mock('../../../utils/sentence-tokenizer', () => {
  const actual = jest.requireActual('../../../utils/sentence-tokenizer');
  return { ...actual, extractUniqueSymbols: jest.fn() };
});

jest.mock('../services/audio-service', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../../instruments/facade/instrument-facade', () => ({
  __esModule: true,
  getInstrumentFilePathsFromSymbol: jest.fn(),
}));

jest.mock('../../sequence/facade/sequence-facade', () => ({
  __esModule: true,
  preparePattern: jest.fn(),
}));

const mockEngine = {
  hasSymbol: jest.fn().mockReturnValue(true),
  registerSymbol: jest.fn(),
  addToPlayers: jest.fn().mockResolvedValue(undefined),
  updateSequences: jest.fn(),
} as unknown as jest.Mocked<AudioEngine>;

jest.spyOn(AudioEngine, 'getInstance').mockReturnValue(mockEngine);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('#updatePattern', () => {
  it('should update sequences without loading if no new symbols', async () => {
    jest
      .mocked(tokenizer.extractUniqueSymbols)
      .mockReturnValue(['P', 'Ts', '.']);
    jest.mocked(preparePattern).mockResolvedValue([
      [
        { name: 'kickdrum', playbackRate: 1 },
        { name: 'hihat', playbackRate: 1 },
      ],
    ]);

    await updatePattern(['P Ts .']);

    expect(mockEngine.addToPlayers).not.toHaveBeenCalled();
    expect(mockEngine.registerSymbol).not.toHaveBeenCalled();
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should load new audio buffer when a new valid symbol appears', async () => {
    mockEngine.hasSymbol.mockImplementation((s: string) => s !== 'Bw');
    jest.mocked(tokenizer.extractUniqueSymbols).mockReturnValue(['P', 'Bw']);
    jest
      .mocked(getInstrumentFilePathsFromSymbol)
      .mockResolvedValue([{ name: 'liproll', filepath: '/path/liproll.mp3' }]);
    jest
      .mocked(getAudioBuffers)
      .mockResolvedValue({ liproll: {} as ArrayBuffer });
    jest.mocked(preparePattern).mockResolvedValue([
      [
        { name: 'kickdrum', playbackRate: 1 },
        { name: 'liproll', playbackRate: 1 },
      ],
    ]);

    await updatePattern(['P Bw']);

    expect(getInstrumentFilePathsFromSymbol).toHaveBeenCalledWith('Bw');
    expect(getAudioBuffers).toHaveBeenCalledTimes(1);
    expect(mockEngine.addToPlayers).toHaveBeenCalledTimes(1);
    expect(mockEngine.registerSymbol).toHaveBeenCalledWith('Bw');
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should skip . (silence) when checking for new symbols', async () => {
    mockEngine.hasSymbol.mockImplementation((s: string) => s === 'P');
    jest
      .mocked(tokenizer.extractUniqueSymbols)
      .mockReturnValue(['P', '.', '.']);
    jest
      .mocked(preparePattern)
      .mockResolvedValue([[{ name: 'kickdrum', playbackRate: 1 }, null, null]]);

    await updatePattern(['P . .']);

    expect(mockEngine.addToPlayers).not.toHaveBeenCalled();
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should register new symbols after successful loading', async () => {
    mockEngine.hasSymbol.mockReturnValue(false);
    jest.mocked(tokenizer.extractUniqueSymbols).mockReturnValue(['Bw']);
    jest
      .mocked(getInstrumentFilePathsFromSymbol)
      .mockResolvedValue([{ name: 'liproll', filepath: '/path/liproll.mp3' }]);
    jest
      .mocked(getAudioBuffers)
      .mockResolvedValue({ liproll: {} as ArrayBuffer });
    jest
      .mocked(preparePattern)
      .mockResolvedValue([[{ name: 'liproll', playbackRate: 1 }]]);

    await updatePattern(['Bw']);

    expect(mockEngine.registerSymbol).toHaveBeenCalledWith('Bw');
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });
});

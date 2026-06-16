import AudioEngine, { StepCallback } from '../engine/audio-engine';

type MockLoopInstance = {
  start: jest.Mock;
  dispose: jest.Mock;
  cb: (time: number) => void;
};

jest.mock('tone', () => {
  const decodeFn = jest.fn().mockResolvedValue({});

  return {
    decodeFn,
    Sequence: jest.fn(),
    Players: jest.fn(() => ({
      add: jest.fn(),
      player: jest.fn(() => ({ start: jest.fn() })),
      toDestination: jest.fn(),
      dispose: jest.fn(),
    })),
    Loop: jest.fn((loopCallback: () => void) => ({
      start: jest.fn(),
      dispose: jest.fn(),
      cb: loopCallback,
    })),
    getContext: jest.fn(() => ({
      decodeAudioData: decodeFn,
    })),
    getTransport: jest.fn(() => ({
      bpm: { value: 120 },
    })),
    Time: jest.fn(() => ({ toSeconds: jest.fn(() => 0.2) })),
  };
});

const mockTone = jest.requireMock('tone') as {
  decodeFn: jest.Mock;
  Sequence: jest.Mock;
  Players: jest.Mock;
  Loop: jest.Mock;
  Time: jest.Mock;
  getContext: jest.Mock;
};

beforeEach(() => {
  mockTone.Sequence.mockClear();
  mockTone.Loop.mockClear();
  mockTone.decodeFn.mockClear();
  mockTone.Players.mockClear();
  mockTone.Time.mockClear();
});

describe('#hasSymbol', () => {
  it('should return false when no symbols have been registered', () => {
    const engine = AudioEngine.getInstance();
    expect(engine.hasSymbol('P')).toBe(false);
  });

  it('should return true after registerSymbol', () => {
    const engine = AudioEngine.getInstance();
    engine.registerSymbol('Ts');
    expect(engine.hasSymbol('Ts')).toBe(true);
  });
});

describe('#registerSymbol', () => {
  it('should be idempotent', () => {
    const engine = AudioEngine.getInstance();
    engine.registerSymbol('P');
    engine.registerSymbol('P');
    expect(engine.hasSymbol('P')).toBe(true);
  });
});

describe('#addToPlayers', () => {
  it('should decode audio data for each buffer entry', async () => {
    const engine = AudioEngine.getInstance();
    await engine.createPlayers({});
    const buffer: ArrayBuffer = new ArrayBuffer(8);
    await engine.addToPlayers({ kickdrum: buffer, hihat: buffer });
    expect(mockTone.decodeFn).toHaveBeenCalledTimes(2);
  });

  it('should add decoded buffers to Tone.Players', async () => {
    const engine = AudioEngine.getInstance();
    await engine.createPlayers({});
    const buffer: ArrayBuffer = new ArrayBuffer(8);
    await engine.addToPlayers({ kickdrum: buffer, hihat: buffer });
    const players = mockTone.Players.mock.results[0]?.value;
    expect(players.add).toHaveBeenCalledTimes(2);
  });
});

describe('#createSequence', () => {
  let engine: AudioEngine;

  beforeAll(() => {
    engine = AudioEngine.getInstance();
  });

  beforeEach(async () => {
    await engine.createPlayers({});
  });

  it('should create a single master Tone.Loop and no Tone.Sequence', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['a', 'b']]);
    expect(mockTone.Loop).toHaveBeenCalledTimes(1);
    expect(mockTone.Sequence).not.toHaveBeenCalled();
  });

  it('should not create master loop when onStep is not set', () => {
    engine.clearStepCallback();
    engine.createSequence([['a', 'b']]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });

  it('should play a note on each tick', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.createSequence([['kickdrum'], ['hihat']]);
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    expect(playerFn).toHaveBeenCalledWith('kickdrum');
    expect(playerFn).toHaveBeenCalledWith('hihat');
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should play sub-notes with time offsets for groups', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([['kickdrum']]);
    (engine as unknown as Record<string, unknown>).trackNotes = [
      [['hihat', 'snare']],
    ];
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    expect(playerFn).toHaveBeenCalledWith('hihat');
    expect(playerFn).toHaveBeenCalledWith('snare');

    const startHihat = playerFn.mock.results[0]?.value.start;
    const startSnare = playerFn.mock.results[1]?.value.start;
    expect(startHihat).toHaveBeenCalledWith(0);
    expect(startSnare).toHaveBeenCalledWith(expect.closeTo(0.1, 0.001));
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should spread three sub-notes across the step duration', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([['kickdrum']]);
    (engine as unknown as Record<string, unknown>).trackNotes = [
      [['a', 'b', 'c']],
    ];
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    const startA = playerFn.mock.results[0]?.value.start;
    const startB = playerFn.mock.results[1]?.value.start;
    const startC = playerFn.mock.results[2]?.value.start;

    expect(startA).toHaveBeenCalledWith(expect.closeTo(0, 0.001));
    expect(startB).toHaveBeenCalledWith(expect.closeTo(0.0666, 0.001));
    expect(startC).toHaveBeenCalledWith(expect.closeTo(0.1333, 0.001));
  });

  it('should play a single-element group at time 0', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([['kickdrum']]);
    (engine as unknown as Record<string, unknown>).trackNotes = [[['solo']]];
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    const startSolo = playerFn.mock.results[0]?.value.start;
    expect(startSolo).toHaveBeenCalledWith(expect.closeTo(0, 0.001));
  });

  it('should skip null notes (silence)', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.createSequence([['kickdrum']]);
    (engine as unknown as Record<string, unknown>).trackNotes = [[null]];
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    expect(playerFn).not.toHaveBeenCalled();
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should skip tracks shorter than current step', () => {
    const stepCb: StepCallback = jest.fn();
    engine.setStepCallback(stepCb);
    engine.createSequence([['a', 'b'], ['c']]);
    (engine as unknown as Record<string, unknown>).trackNotes = [
      ['a', 'b'],
      ['c'],
    ];
    (engine as unknown as Record<string, unknown>).stepIndex = 1;
    (engine as unknown as Record<string, unknown>).currentColumnCount = 2;
    const capturedCallback = (
      mockTone.Loop.mock.results[0]?.value as MockLoopInstance
    ).cb;

    capturedCallback(0);

    const playerFn = mockTone.Players.mock.results[0]?.value.player;
    expect(playerFn).toHaveBeenCalledWith('b');
    expect(playerFn).not.toHaveBeenCalledWith('c');
    expect(stepCb).toHaveBeenCalledWith(1);
  });
});

describe('#updateSequences', () => {
  let engine: AudioEngine;

  beforeAll(() => {
    engine = AudioEngine.getInstance();
  });

  afterEach(() => {
    engine.clearStepCallback();
  });

  it('should guard against no master loop (race condition)', () => {
    engine.updateSequences([['kickdrum']]);
    expect(true).toBe(true);
  });

  it('should accept more tracks without crashing', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['kickdrum']]);
    engine.updateSequences([['kickdrum'], ['hihat']]);
    expect(true).toBe(true);
  });

  it('should accept fewer tracks without crashing', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['kickdrum'], ['hihat']]);
    engine.updateSequences([['kickdrum']]);
    expect(true).toBe(true);
  });

  it('should update trackNotes without recreating master loop', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['a', 'b']]);
    mockTone.Loop.mockClear();
    engine.updateSequences([['x', 'y', 'z']]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });

  it('should preserve relative position when columnCount changes', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['a', 'b', 'c', 'd']]);
    (engine as unknown as Record<string, unknown>).stepIndex = 11;
    (engine as unknown as Record<string, unknown>).currentColumnCount = 4;

    engine.updateSequences([['w', 'x', 'y', 'z', 'a']]);

    const sIdx = (engine as unknown as Record<string, unknown>)
      .stepIndex as number;
    const colCount = (engine as unknown as Record<string, unknown>)
      .currentColumnCount as number;
    const tNotes = (engine as unknown as Record<string, unknown>)
      .trackNotes as string[][];

    expect(sIdx).toBe(3);
    expect(colCount).toBe(5);
    expect(tNotes).toEqual([['w', 'x', 'y', 'z', 'a']]);
  });

  it('should not change master loop when columnCount unchanged', () => {
    engine.setStepCallback(jest.fn());
    engine.createSequence([['a', 'b', 'c']]);
    mockTone.Loop.mockClear();
    engine.updateSequences([['x', 'y', 'z']]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });
});

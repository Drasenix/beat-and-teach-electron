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
    Player: jest.fn(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      playbackRate: {},
      toDestination: jest.fn(function () {
        return this;
      }),
      dispose: jest.fn(),
    })),
    Loop: jest.fn((loopCallback: (time: number) => void) => ({
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
  Player: jest.Mock;
  Loop: jest.Mock;
  Time: jest.Mock;
  getContext: jest.Mock;
};

const mockBuffer = new ArrayBuffer(8);

async function createPlayersWith(
  engine: AudioEngine,
  names: string[],
): Promise<void> {
  const data: Record<string, ArrayBuffer> = {};
  names.forEach((n) => {
    data[n] = mockBuffer;
  });
  await engine.createPlayers(data);
}

function setField(engine: AudioEngine, key: string, value: unknown): void {
  (engine as unknown as Record<string, unknown>)[key] = value;
}

function getLoopCallback(index: number): (time: number) => void {
  return (mockTone.Loop.mock.results[index]?.value as MockLoopInstance).cb;
}

function getPooledPlayer(
  engine: AudioEngine,
  trackIndex: number,
  name: string,
  semitoneOffset: number,
): { start: jest.Mock; playbackRate: Record<string, number> } | undefined {
  const pool = (engine as unknown as Record<string, unknown>).playerPool as Map<
    string,
    Map<number, { start: jest.Mock; playbackRate: Record<string, number> }>
  >[];
  return pool[trackIndex]?.get(name)?.get(semitoneOffset);
}

beforeEach(() => {
  mockTone.Loop.mockClear();
  mockTone.Player.mockClear();
  mockTone.decodeFn.mockClear();
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
    await engine.createPlayers({ kickdrum: mockBuffer });
    mockTone.decodeFn.mockClear();
    await engine.addToPlayers({ hihat: mockBuffer });
    expect(mockTone.decodeFn).toHaveBeenCalledTimes(1);
  });
});

describe('#createSequence', () => {
  it('should create one Tone.Loop per track', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['a', 'b', 'c', 'd']);
    engine.setStepCallback(jest.fn());
    engine.createSequence([
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
      ],
      [{ name: 'c', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    expect(mockTone.Loop).toHaveBeenCalledTimes(2);
  });

  it('should not create loops when onStep is not set', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['a']);
    engine.clearStepCallback();
    engine.createSequence([
      [{ name: 'a', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });

  it('should play a note on each tick', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['kickdrum', 'hihat']);
    engine.setStepCallback(stepCb);
    engine.createSequence([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
      [{ name: 'hihat', playbackRate: 1, semitoneOffset: 0 }],
    ]);

    const loop0 = getLoopCallback(0);
    loop0(0);
    const loop1 = getLoopCallback(1);
    loop1(0);

    expect(
      getPooledPlayer(engine, 0, 'kickdrum', 0)?.start,
    ).toHaveBeenCalledWith(0);
    expect(getPooledPlayer(engine, 1, 'hihat', 0)?.start).toHaveBeenCalledWith(
      0,
    );
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should play sub-notes with time offsets for groups', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['hihat', 'snare']);
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([
      [
        { name: 'hihat', playbackRate: 1, semitoneOffset: 0 },
        { name: 'snare', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    setField(engine, 'trackNotes', [
      [
        [
          { name: 'hihat', playbackRate: 1, semitoneOffset: 0 },
          { name: 'snare', playbackRate: 1, semitoneOffset: 0 },
        ],
      ],
    ]);

    const loop0 = getLoopCallback(0);
    loop0(0);

    expect(getPooledPlayer(engine, 0, 'hihat', 0)?.start).toHaveBeenCalledWith(
      0,
    );
    expect(getPooledPlayer(engine, 0, 'snare', 0)?.start).toHaveBeenCalledWith(
      expect.closeTo(0.1, 0.001),
    );
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should spread three sub-notes across the step duration', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['a', 'b', 'c']);
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
        { name: 'c', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    setField(engine, 'trackNotes', [
      [
        [
          { name: 'a', playbackRate: 1, semitoneOffset: 0 },
          { name: 'b', playbackRate: 1, semitoneOffset: 0 },
          { name: 'c', playbackRate: 1, semitoneOffset: 0 },
        ],
      ],
    ]);

    const loop0 = getLoopCallback(0);
    loop0(0);

    expect(getPooledPlayer(engine, 0, 'a', 0)?.start).toHaveBeenCalledWith(
      expect.closeTo(0, 0.001),
    );
    expect(getPooledPlayer(engine, 0, 'b', 0)?.start).toHaveBeenCalledWith(
      expect.closeTo(0.0666, 0.001),
    );
    expect(getPooledPlayer(engine, 0, 'c', 0)?.start).toHaveBeenCalledWith(
      expect.closeTo(0.1333, 0.001),
    );
  });

  it('should play a single-element group at time 0', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['solo']);
    engine.setStepCallback(stepCb);
    engine.setTempo(120);
    engine.createSequence([
      [{ name: 'solo', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    setField(engine, 'trackNotes', [
      [[{ name: 'solo', playbackRate: 1, semitoneOffset: 0 }]],
    ]);

    const loop0 = getLoopCallback(0);
    loop0(0);

    expect(getPooledPlayer(engine, 0, 'solo', 0)?.start).toHaveBeenCalledWith(
      expect.closeTo(0, 0.001),
    );
  });

  it('should skip null notes (silence)', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['kickdrum']);
    engine.setStepCallback(stepCb);
    engine.createSequence([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    setField(engine, 'trackNotes', [[null]]);

    const loop0 = getLoopCallback(0);
    loop0(0);

    expect(
      getPooledPlayer(engine, 0, 'kickdrum', 0),
    ).toBeUndefined();
    expect(stepCb).toHaveBeenCalledWith(0);
  });

  it('should skip tracks shorter than current step', async () => {
    const engine = AudioEngine.getInstance();
    const stepCb: StepCallback = jest.fn();
    await createPlayersWith(engine, ['a', 'b', 'c']);
    engine.setStepCallback(stepCb);
    engine.createSequence([
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
      ],
      [{ name: 'c', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    setField(engine, 'trackNotes', [
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
      ],
      [{ name: 'c', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    setField(engine, 'currentColumnCount', 2);

    const loop0 = getLoopCallback(0);
    loop0(0);
    loop0(0);

    expect(getPooledPlayer(engine, 0, 'b', 0)?.start).toHaveBeenCalled();
    expect(getPooledPlayer(engine, 1, 'c', 0)).toBeUndefined();
    expect(stepCb).toHaveBeenCalledWith(0);
    expect(stepCb).toHaveBeenCalledWith(1);
  });
});

describe('#updateSequences', () => {
  it('should guard against no master loop', async () => {
    const engine = AudioEngine.getInstance();
    engine.updateSequences([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    expect(true).toBe(true);
  });

  it('should accept more tracks without crashing', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['kickdrum', 'hihat']);
    engine.setStepCallback(jest.fn());
    engine.createSequence([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    engine.updateSequences([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
      [{ name: 'hihat', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    expect(true).toBe(true);
  });

  it('should accept fewer tracks without crashing', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['kickdrum', 'hihat']);
    engine.setStepCallback(jest.fn());
    engine.createSequence([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
      [{ name: 'hihat', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    engine.updateSequences([
      [{ name: 'kickdrum', playbackRate: 1, semitoneOffset: 0 }],
    ]);
    expect(true).toBe(true);
  });

  it('should update trackNotes without recreating master loop', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['a', 'b', 'x', 'y', 'z']);
    engine.setStepCallback(jest.fn());
    engine.createSequence([
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    mockTone.Loop.mockClear();
    engine.updateSequences([
      [
        { name: 'x', playbackRate: 1, semitoneOffset: 0 },
        { name: 'y', playbackRate: 1, semitoneOffset: 0 },
        { name: 'z', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });

  it('should not recreate loops when columnCount unchanged', async () => {
    const engine = AudioEngine.getInstance();
    await createPlayersWith(engine, ['a', 'b', 'c', 'x', 'y', 'z']);
    engine.setStepCallback(jest.fn());
    engine.createSequence([
      [
        { name: 'a', playbackRate: 1, semitoneOffset: 0 },
        { name: 'b', playbackRate: 1, semitoneOffset: 0 },
        { name: 'c', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    mockTone.Loop.mockClear();
    engine.updateSequences([
      [
        { name: 'x', playbackRate: 1, semitoneOffset: 0 },
        { name: 'y', playbackRate: 1, semitoneOffset: 0 },
        { name: 'z', playbackRate: 1, semitoneOffset: 0 },
      ],
    ]);
    expect(mockTone.Loop).not.toHaveBeenCalled();
  });
});

import noteNameToFrequency from './note-name-to-frequency';

describe('#noteNameToFrequency', () => {
  it('should convert C4 to 261.63 Hz', () => {
    expect(noteNameToFrequency('C4')).toBeCloseTo(261.63, 0);
  });

  it('should convert A4 to 440 Hz', () => {
    expect(noteNameToFrequency('A4')).toBeCloseTo(440, 0);
  });

  it('should convert A#4 to 466.16 Hz', () => {
    expect(noteNameToFrequency('A#4')).toBeCloseTo(466.16, 0);
  });

  it('should convert Bb4 to 466.16 Hz (flat equivalent)', () => {
    expect(noteNameToFrequency('Bb4')).toBeCloseTo(466.16, 0);
  });

  it('should handle lowercase', () => {
    expect(noteNameToFrequency('a4')).toBeCloseTo(440, 0);
  });

  it('should handle C#3', () => {
    expect(noteNameToFrequency('C#3')).toBeCloseTo(138.59, 0);
  });

  it('should convert G9 (high)', () => {
    expect(noteNameToFrequency('G9')).toBeCloseTo(12543.85, 0);
  });

  it('should convert C0 (low)', () => {
    expect(noteNameToFrequency('C0')).toBeCloseTo(16.35, 1);
  });

  it('should return null for invalid note name', () => {
    expect(noteNameToFrequency('H4')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(noteNameToFrequency('')).toBeNull();
  });

  it('should return null for frequency number', () => {
    expect(noteNameToFrequency('440')).toBeNull();
  });

  it('should handle Db4', () => {
    expect(noteNameToFrequency('Db4')).toBeCloseTo(277.18, 0);
  });

  it('should handle Eb5', () => {
    expect(noteNameToFrequency('Eb5')).toBeCloseTo(622.25, 0);
  });

  it('should handle Gb3', () => {
    expect(noteNameToFrequency('Gb3')).toBeCloseTo(185.0, 0);
  });

  it('should handle Ab2', () => {
    expect(noteNameToFrequency('Ab2')).toBeCloseTo(103.83, 0);
  });
});

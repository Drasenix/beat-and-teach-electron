import updateTokenFrequency from './update-token-frequency';

describe('#updateTokenFrequency', () => {
  describe('atomic tokens', () => {
    it('should add @freq to a token that has no frequency', () => {
      const result = updateTokenFrequency('Hum P Ts', 0, 440);
      expect(result).toBe('Hum@A4 P Ts');
    });

    it('should update existing @freq on a token', () => {
      const result = updateTokenFrequency('Hum@440 P Ts', 0, 880);
      expect(result).toBe('Hum@A5 P Ts');
    });

    it('should remove @freq when frequency is null', () => {
      const result = updateTokenFrequency('Hum@440 P Ts', 0, null);
      expect(result).toBe('Hum P Ts');
    });

    it('should handle token at a different position', () => {
      const result = updateTokenFrequency('P Hum Ts', 1, 440);
      expect(result).toBe('P Hum@A4 Ts');
    });

    it('should return sentence unchanged when flatTokenIndex is out of bounds', () => {
      const result = updateTokenFrequency('P Hum Ts', 5, 440);
      expect(result).toBe('P Hum Ts');
    });

    it('should handle float frequency', () => {
      const result = updateTokenFrequency('Hum P', 0, 466.16);
      expect(result).toBe('Hum@A#4 P');
    });
  });

  describe('group tokens', () => {
    it('should add @freq to a token inside a group', () => {
      const result = updateTokenFrequency('P (Hum K) .', 1, 440);
      expect(result).toBe('P (Hum@A4 K) .');
    });

    it('should update @freq on a token inside a group', () => {
      const result = updateTokenFrequency('P (Hum@440 K) .', 1, 880);
      expect(result).toBe('P (Hum@A5 K) .');
    });

    it('should remove @freq from a token inside a group', () => {
      const result = updateTokenFrequency('P (Hum@440 K) .', 1, null);
      expect(result).toBe('P (Hum K) .');
    });

    it('should handle second token inside a group', () => {
      const result = updateTokenFrequency('(Hum Ts) P', 1, 440);
      expect(result).toBe('(Hum Ts@A4) P');
    });

    it('should handle token inside second group', () => {
      const result = updateTokenFrequency('(Ts K) P (Hum .)', 3, 440);
      expect(result).toBe('(Ts K) P (Hum@A4 .)');
    });

    it('should handle multiple groups with correct flat indexing', () => {
      const result = updateTokenFrequency('(Ts K) (Hum P) .', 3, 880);
      expect(result).toBe('(Ts K) (Hum P@A5) .');
    });
  });

  describe('silence tokens', () => {
    it('should add @freq to a silence token', () => {
      const result = updateTokenFrequency('P . Ts', 1, 440);
      expect(result).toBe('P .@A4 Ts');
    });

    it('should remove @freq from a silence token', () => {
      const result = updateTokenFrequency('P .@440 Ts', 1, null);
      expect(result).toBe('P . Ts');
    });
  });

  describe('edge cases', () => {
    it('should handle empty sentence', () => {
      const result = updateTokenFrequency('', 0, 440);
      expect(result).toBe('');
    });

    it('should handle sentence with only spaces', () => {
      const result = updateTokenFrequency('  ', 0, 440);
      expect(result).toBe('  ');
    });

    it('should preserve whitespace structure', () => {
      const result = updateTokenFrequency('P  Hum  Ts', 1, 440);
      expect(result).toBe('P  Hum@A4  Ts');
    });

    it('should handle token with multiple @ by stripping old freq first', () => {
      const result = updateTokenFrequency('Hum@440@220 P', 0, 660);
      expect(result).toBe('Hum@E5 P');
    });
  });
});

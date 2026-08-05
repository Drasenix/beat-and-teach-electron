import { themes, getThemeById, isValidThemeId } from '../utils/themes';

type ThemeId = 'blue' | 'green' | 'pink';

type ThemeEntry = {
  id: ThemeId;
  label: string;
  accentHex: string;
};

const extraEntry: ThemeEntry = {
  id: 'blue',
  label: 'Blue',
  accentHex: '#facc15',
};

describe('#themes', () => {
  it('should expose exactly 3 themes with ids blue, green and pink', () => {
    const ids = themes.map((theme: ThemeEntry) => theme.id);
    expect(themes).toHaveLength(3);
    expect(ids).toEqual(['blue', 'green', 'pink']);
  });

  it('should give each theme a label and an accentHex', () => {
    themes.forEach((theme: ThemeEntry) => {
      expect(theme.label).toBeTruthy();
      expect(theme.accentHex).toBeTruthy();
    });
  });

  it('should expose the exact distinct accents of the 3 themes', () => {
    const accents = themes.map((theme: ThemeEntry) => theme.accentHex);
    expect(accents).toContain('#679ff9');
    expect(accents).toContain('#4ade80');
    expect(accents).toContain('#f472b6');
    expect(new Set(accents).size).toBe(3);
  });

  it('should not affect the registry when the exposed list is mutated', () => {
    const exposed = themes as Array<ThemeEntry>;
    exposed.push(extraEntry);
    expect(themes).toHaveLength(3);
    expect(
      themes.some(
        (theme: ThemeEntry) => theme.accentHex === extraEntry.accentHex,
      ),
    ).toBe(false);
  });
});

describe('#getThemeById', () => {
  it('should return the full blue theme', () => {
    const result = getThemeById('blue');
    expect(result).toMatchObject({ id: 'blue', accentHex: '#679ff9' });
    expect(result?.label).toBeTruthy();
  });

  it('should return the full green theme', () => {
    const result = getThemeById('green');
    expect(result).toMatchObject({ id: 'green', accentHex: '#4ade80' });
    expect(result?.label).toBeTruthy();
  });

  it('should return the full pink theme', () => {
    const result = getThemeById('pink');
    expect(result).toMatchObject({ id: 'pink', accentHex: '#f472b6' });
    expect(result?.label).toBeTruthy();
  });

  it('should return null for an unknown id', () => {
    expect(getThemeById('purple')).toBeNull();
  });

  it('should return null for an empty string', () => {
    expect(getThemeById('')).toBeNull();
  });

  it('should be case sensitive on the id', () => {
    expect(getThemeById('Blue')).toBeNull();
  });

  it('should return null for undefined and null without throwing', () => {
    expect(getThemeById(undefined)).toBeNull();
    expect(getThemeById(null)).toBeNull();
  });
});

describe('#isValidThemeId', () => {
  it('should return true for the 3 valid ids', () => {
    expect(isValidThemeId('blue')).toBe(true);
    expect(isValidThemeId('green')).toBe(true);
    expect(isValidThemeId('pink')).toBe(true);
  });

  it('should return false for an unknown id', () => {
    expect(isValidThemeId('purple')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isValidThemeId('')).toBe(false);
  });

  it('should return false for a trailing space', () => {
    expect(isValidThemeId('blue ')).toBe(false);
  });

  it('should return false for undefined and non-string values without throwing', () => {
    expect(isValidThemeId(undefined)).toBe(false);
    expect(isValidThemeId(123)).toBe(false);
    expect(isValidThemeId(null)).toBe(false);
  });
});

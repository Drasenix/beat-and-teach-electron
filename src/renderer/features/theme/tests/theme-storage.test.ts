import {
  getStoredTheme,
  saveTheme,
  resolveInitialTheme,
} from '../utils/theme-storage';

const THEME_STORAGE_KEY = 'beat-and-teach:theme';

describe('#getStoredTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the stored theme when the key holds a valid id', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'green');
    expect(getStoredTheme()).toBe('green');
  });

  it('should return null when the key is absent', () => {
    expect(getStoredTheme()).toBeNull();
  });

  it('should return null when the key holds an unknown id', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    expect(getStoredTheme()).toBeNull();
  });

  it('should return null when the key holds an empty value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '');
    expect(getStoredTheme()).toBeNull();
  });

  it('should return null when the key holds a malformed value without throwing', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '42');
    expect(getStoredTheme()).toBeNull();
    localStorage.setItem(THEME_STORAGE_KEY, '{"id":"green"}');
    expect(getStoredTheme()).toBeNull();
  });

  it('should return null without propagating the exception when the read throws', () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage unavailable');
      });
    expect(getStoredTheme()).toBeNull();
    getItemSpy.mockRestore();
  });
});

describe('#saveTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should write the theme under the dedicated key', () => {
    saveTheme('pink');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('pink');
  });

  it('should overwrite a previously stored theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'blue');
    saveTheme('green');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('green');
  });

  it('should not write anything for an invalid id', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'blue');
    saveTheme('purple');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('blue');
  });

  it('should not propagate the exception when the write throws', () => {
    const setItemSpy = jest
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota exceeded');
      });
    expect(() => saveTheme('blue')).not.toThrow();
    setItemSpy.mockRestore();
  });
});

describe('#resolveInitialTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should resolve the stored green theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'green');
    expect(resolveInitialTheme()).toBe('green');
  });

  it('should resolve the stored pink theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'pink');
    expect(resolveInitialTheme()).toBe('pink');
  });

  it('should fall back to blue when nothing is stored', () => {
    expect(resolveInitialTheme()).toBe('blue');
  });

  it('should fall back to blue for an unknown stored id', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'purple');
    expect(resolveInitialTheme()).toBe('blue');
  });

  it('should fall back to blue for an empty or malformed stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '');
    expect(resolveInitialTheme()).toBe('blue');
    localStorage.setItem(THEME_STORAGE_KEY, '42');
    expect(resolveInitialTheme()).toBe('blue');
  });

  it('should fall back to blue without propagating the exception when the read throws', () => {
    const getItemSpy = jest
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('storage unavailable');
      });
    expect(resolveInitialTheme()).toBe('blue');
    getItemSpy.mockRestore();
  });
});

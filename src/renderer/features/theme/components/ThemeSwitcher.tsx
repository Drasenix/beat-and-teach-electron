import { useEffect, useRef, useState } from 'react';
import { Palette } from 'lucide-react';
import { themes } from '../utils/themes';
import { useThemeContext } from '../contexts/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="nav-item"
        title="Thème"
        aria-label="Changer de thème"
      >
        <Palette size={20} />
      </button>
      {isOpen && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 flex gap-1.5 bg-surface border border-border rounded-lg p-1.5 shadow-xl">
          {themes.map((entry) => (
            <button
              key={entry.id}
              type="button"
              title={entry.label}
              aria-label={entry.label}
              onClick={() => {
                setTheme(entry.id);
                setIsOpen(false);
              }}
              className={`w-4 h-4 rounded-full ${
                entry.id === theme.id
                  ? 'ring-1 ring-primary ring-offset-1 ring-offset-surface'
                  : 'hover:scale-125 transition-transform'
              }`}
              style={{ backgroundColor: entry.accentHex }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

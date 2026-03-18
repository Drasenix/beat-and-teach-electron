import { Instrument } from '../../instruments/models/instrument-model';

type AutocompleteProps = {
  suggestions: Instrument[];
  selectedIndex: number;
  onSelect: (instrument: Instrument) => void;
  caretPos: { top: number; left: number };
};

export default function Autocomplete({
  suggestions,
  selectedIndex,
  onSelect,
  caretPos,
}: AutocompleteProps) {
  if (suggestions.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: caretPos.top + 20,
        left: caretPos.left,
      }}
      className="z-50"
    >
      <ul className="bg-surface border border-border rounded-lg overflow-hidden shadow-xl min-w-24">
        {suggestions.map((instrument, index) => (
          <li key={instrument.symbol}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(instrument);
              }}
              className={`w-full text-left px-4 py-2 font-mono text-sm transition-colors duration-100
                ${
                  index === selectedIndex
                    ? 'bg-primary text-background'
                    : 'text-text-secondary hover:text-primary hover:bg-background'
                }`}
            >
              {instrument.symbol}
              {instrument.name && (
                <span className="ml-2 opacity-60">{instrument.name}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

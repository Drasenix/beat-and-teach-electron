import { useState } from 'react';
import { Pattern } from '../models/pattern-model';

type PatternChoicesProps = {
  patterns: Pattern[];
  selectPattern: (id: number) => void;
};

export default function PatternChoices(props: PatternChoicesProps) {
  const { patterns, selectPattern } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number): void => {
    setSelectedId(id);
    selectPattern(id);
  };

  return (
    <div className="w-full max-w-2xl mb-8">
      <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-3">
        Exemples
      </h2>
      <div className="flex flex-wrap gap-2">
        {patterns.map((pat) => (
          <button
            key={pat.id}
            type="button"
            onClick={() => handleSelect(pat.id)}
            className={`px-4 py-2 font-mono text-sm rounded-lg transition-colors duration-200 uppercase tracking-widest border
              ${
                selectedId === pat.id
                  ? 'bg-primary border-primary text-background'
                  : 'bg-surface border-border hover:border-primary text-text-secondary hover:text-primary'
              }`}
          >
            {pat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

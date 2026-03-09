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
      <h2 className="section-title mb-3">Exemples</h2>
      <div className="flex flex-wrap gap-2">
        {patterns.map((pat) => (
          <button
            key={pat.id}
            type="button"
            onClick={() => handleSelect(pat.id)}
            className={`btn-secondary ${
              selectedId === pat.id
                ? 'bg-primary border-primary text-background hover:text-background'
                : ''
            }`}
          >
            {pat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

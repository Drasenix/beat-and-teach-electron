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
    <div className="workspace-section-content">
      <h2 className="section-title">Patterns</h2>
      <div className="flex flex-wrap gap-3 section-background">
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

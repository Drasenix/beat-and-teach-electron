import { useState } from 'react';
import { Pattern } from '../models/pattern-model';

type PatternChoicesProps = {
  patterns: Pattern[];
  selectPattern: (pattern: Pattern | null) => void;
};

export default function PatternChoices(props: PatternChoicesProps) {
  const { patterns, selectPattern } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (pattern: Pattern): void => {
    setSelectedId(pattern.id);
    selectPattern(pattern);
  };

  const handleNew = (): void => {
    setSelectedId(null);
    selectPattern(null);
  };

  return (
    <div className="workspace-section-content">
      <h2 className="section-title">Patterns</h2>
      <div className="flex flex-wrap gap-3 section-background">
        <button type="button" onClick={handleNew} className="btn-add">
          + Nouveau Pattern
        </button>
        {patterns.map((pat) => (
          <button
            key={pat.id}
            type="button"
            onClick={() => handleSelect(pat)}
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

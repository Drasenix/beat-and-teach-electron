import { useState } from 'react';
import { Pattern } from '../models/pattern-model';

type PatternChoicesProps = {
  patterns: Pattern[];
  selectPattern: (pattern: Pattern | null) => void;
  onSave: () => void;
  canSave: boolean;
};

export default function PatternChoices(props: PatternChoicesProps) {
  const { patterns, selectPattern, onSave, canSave } = props;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(true);

  const handleSelect = (pat: Pattern): void => {
    setSelectedId(pat.id);
    selectPattern(pat);
  };

  const handleNew = (): void => {
    setSelectedId(null);
    selectPattern(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="sidebar-header"
      >
        <span className="sidebar-title">Patterns</span>
        <span className={`section-toggle-arrow ${open ? 'open' : ''}`}>▲</span>
      </button>
      {open && (
        <div className="sidebar-footer">
          <button type="button" onClick={handleNew} className="sidebar-btn-new">
            +
          </button>
          <button
            type="button"
            onClick={onSave}
            className="sidebar-btn-save"
            disabled={!canSave}
          >
            Sauvegarder
          </button>
        </div>
      )}
      <div className={`section-collapsible ${open ? 'open' : ''}`}>
        <div className="sidebar-list">
          {[...patterns]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((pat) => (
              <button
                key={pat.id}
                type="button"
                onClick={() => handleSelect(pat)}
                className={`sidebar-item ${
                  selectedId === pat.id ? 'selected' : ''
                }`}
              >
                {pat.name}
              </button>
            ))}
        </div>
      </div>
    </>
  );
}

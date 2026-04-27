import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';
import usePatterns from '../hooks/usePatterns';

type PatternChoicesProps = {
  selectPattern: (pattern: Pattern | null) => void;
  onSave: () => void;
  canSave: boolean;
};

export default function PatternChoices(props: PatternChoicesProps) {
  const { selectPattern, onSave, canSave } = props;
  const { patterns } = usePatterns();
  const { playing } = useAudio();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (pat: Pattern): void => {
    setSelectedId(pat.id);
    selectPattern(pat);
  };

  const handleNew = (): void => {
    setSelectedId(null);
    selectPattern(null);
  };

  return (
    <span id="patterns-choices">
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
          <button
            type="button"
            onClick={handleNew}
            className="sidebar-btn-new"
            disabled={playing}
          >
            +
          </button>
          <button
            type="button"
            onClick={onSave}
            className="sidebar-btn-save"
            disabled={!canSave || playing}
          >
            Sauvegarder
          </button>
        </div>
      )}
      <div className={`section-collapsible ${open ? 'open' : ''}`}>
        <div className="sidebar-list">
          {patterns.map((pat) => (
            <button
              key={pat.id}
              type="button"
              onClick={() => handleSelect(pat)}
              disabled={playing}
              className={`sidebar-item ${
                selectedId === pat.id ? 'selected' : ''
              }`}
            >
              {pat.name}
            </button>
          ))}
        </div>
      </div>
    </span>
  );
}

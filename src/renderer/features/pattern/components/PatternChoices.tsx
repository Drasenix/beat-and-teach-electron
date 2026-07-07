import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';
import usePatterns from '../hooks/usePatterns';

type PatternChoicesProps = {
  selectPattern: (pattern: Pattern | null) => void;
  onSave: () => void;
  canSave: boolean;
  selectedId: number | null;
};

export default function PatternChoices(props: PatternChoicesProps) {
  const { selectPattern, onSave, canSave, selectedId } = props;
  const { patterns } = usePatterns();
  const { playing } = useAudio();
  const [open, setOpen] = useState(false);

  const handleSelect = (pat: Pattern): void => {
    selectPattern(pat);
  };

  const handleNew = (): void => {
    selectPattern(null);
  };

  return (
    <div id="patterns-choices" className="flex flex-col min-h-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="sidebar-header"
      >
        <span className="sidebar-title">Patterns</span>
        <span className="section-toggle-arrow">{open ? '▼' : '▶'}</span>
      </button>
      {open && (
        <div className="sidebar-footer">
          <button
            type="button"
            onClick={handleNew}
            className="sidebar-btn-new"
            disabled={playing}
          >
            <Plus size={16} />
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
    </div>
  );
}

import { useState } from 'react';
import usePatterns from '../hooks/usePatterns';
import AddPatternForm from './form/AddPatternForm';
import EditPatternForm from './form/EditPatternForm';
import { PatternFormValues } from '../types/pattern-types';

export default function PatternConfiguration() {
  const [addingPattern, setAddingPattern] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const { patterns, addPattern, editPattern, removePattern, error } =
    usePatterns();

  const handleDelete = async (id: number): Promise<void> => {
    await removePattern(id);
    setConfirmDeleteId(null);
  };

  const handleEdit = async (
    id: number,
    data: PatternFormValues,
  ): Promise<void> => {
    await editPattern(id, data);
    setEditingId(null);
  };

  return (
    <div className="config-page">
      <div className="config-content">
        <h2 className="section-title mb-6">Patterns</h2>

        {error && <div className="w-full mb-6 error-message">{error}</div>}

        <ul className="flex flex-col gap-2 mb-6">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="flex flex-col">
              <div className="item-row">
                <span className="text-text-primary font-mono flex-1">
                  {pattern.name}
                </span>
                <div className="flex flex-col gap-1 flex-1">
                  {pattern.sentences.map((sentence) => (
                    <span
                      key={sentence}
                      className="text-text-secondary text-xs font-mono truncate max-w-xs"
                    >
                      {sentence}
                    </span>
                  ))}
                </div>

                {confirmDeleteId === pattern.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-xs font-mono">
                      Confirmer ?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(pattern.id)}
                      className="btn-confirm-delete"
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="btn-secondary px-3 py-1 text-xs"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(
                          editingId === pattern.id ? null : pattern.id,
                        );
                        setAddingPattern(false);
                      }}
                      className="btn-edit"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(pattern.id)}
                      className="btn-delete"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {editingId === pattern.id && (
                <EditPatternForm
                  key={pattern.id}
                  pattern={pattern}
                  onUpdate={(data) => handleEdit(pattern.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              )}
            </li>
          ))}
        </ul>

        {addingPattern ? (
          <AddPatternForm
            onAdd={addPattern}
            onCancel={() => setAddingPattern(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setAddingPattern(true);
              setEditingId(null);
            }}
            className="btn-secondary"
          >
            + Ajouter un pattern
          </button>
        )}
      </div>
    </div>
  );
}

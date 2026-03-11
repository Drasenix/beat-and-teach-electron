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
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h2 className="section-title mb-6">Patterns</h2>

        {error && <div className="w-full mb-6 error-message">{error}</div>}

        <ul className="flex flex-col gap-2 mb-6">
          {patterns.map((pattern) => (
            <li key={pattern.id} className="flex flex-col">
              <div className="flex items-center gap-4 bg-surface border border-border rounded-lg px-4 py-3">
                <span className="text-text-primary font-mono flex-1">
                  {pattern.name}
                </span>
                <span className="text-text-secondary text-xs font-mono truncate max-w-xs flex-1">
                  {pattern.sentence}
                </span>

                {confirmDeleteId === pattern.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-xs font-mono">
                      Confirmer ?
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(pattern.id)}
                      className="px-3 py-1 bg-red-500 hover:opacity-90 text-background
                                 font-mono text-xs rounded-lg transition-opacity duration-200"
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
                      className="text-text-secondary hover:text-primary font-mono text-xs
                                 transition-colors duration-200"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(pattern.id)}
                      className="text-text-secondary hover:text-red-400 font-mono text-xs
                                 transition-colors duration-200"
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

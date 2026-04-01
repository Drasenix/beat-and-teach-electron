import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import validatePattern from '../../utils/pattern-validator';
import usePatterns from '../../hooks/usePatterns';
import PatternOverwrite from './PatternOverwrite';

type SavePatternFormProps = {
  pattern: Pattern;
  selectedPattern: Pattern | null;
};

type ConfirmOverwriteState = {
  id: number;
  name: string;
};

export default function SavePatternForm({
  pattern,
  selectedPattern,
}: SavePatternFormProps) {
  const { patterns, addPattern, editPattern } = usePatterns();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] =
    useState<ConfirmOverwriteState | null>(null);

  const resetFields = (): void => {
    setName('');
    setError(null);
    setConfirmOverwrite(null);
  };

  // Cas 1 : pattern sélectionné → écrasement direct
  const onSaveExisting = async (): Promise<void> => {
    if (!selectedPattern) return;
    try {
      await editPattern(selectedPattern.id, {
        name: selectedPattern.name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de modifier le pattern.'));
    }
  };

  // Cas 2 : aucun pattern sélectionné → création avec nom
  const onSaveNew = async (): Promise<void> => {
    const errors = validatePattern({ name, sentences: pattern.sentences });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const existing = patterns.find((p) => p.name === name);
    if (existing) {
      setConfirmOverwrite({ id: existing.id, name: existing.name });
      return;
    }

    try {
      await addPattern({
        name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
      resetFields();
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de créer le pattern.'));
    }
  };

  const onConfirmOverwrite = async (): Promise<void> => {
    if (!confirmOverwrite) return;
    try {
      await editPattern(confirmOverwrite.id, {
        name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
      resetFields();
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de modifier le pattern.'));
      setConfirmOverwrite(null);
    }
  };

  const allSentencesValid =
    pattern.sentences.length > 0 &&
    pattern.sentences.every((s) => s.trim().length > 0);

  // Cas 1 : pattern sélectionné
  if (selectedPattern) {
    return (
      <div className="flex items-center gap-3">
        {error && <span className="error-message">{error}</span>}
        <button
          type="button"
          onClick={onSaveExisting}
          disabled={!allSentencesValid}
          className="btn-primary"
        >
          Sauvegarder
        </button>
      </div>
    );
  }

  // Cas 2 : aucun pattern sélectionné → champ nom toujours visible
  return (
    <>
      {confirmOverwrite && (
        <PatternOverwrite
          name={confirmOverwrite.name}
          onConfirm={onConfirmOverwrite}
          onCancel={resetFields}
        />
      )}
      <div className="flex items-center gap-3 w-full">
        <input
          placeholder="Nom du pattern"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field flex-1"
        />
        {error && <span className="error-message">{error}</span>}
        <button
          type="button"
          onClick={onSaveNew}
          disabled={!name.trim() || !allSentencesValid}
          className="btn-primary"
        >
          Sauvegarder
        </button>
      </div>
    </>
  );
}

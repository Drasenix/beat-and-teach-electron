import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import validatePattern from '../../utils/pattern-validator';
import usePatterns from '../../hooks/usePatterns';
import PatternOverwrite from './PatternOverwrite';

type SavePatternFormProps = {
  pattern: Pattern;
};

type ConfirmOverwriteState = {
  id: number;
  name: string;
};

export default function SavePatternForm({ pattern }: SavePatternFormProps) {
  const { patterns, addPattern, editPattern } = usePatterns();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] =
    useState<ConfirmOverwriteState | null>(null);

  const resetFields = (): void => {
    setName('');
    setSaving(false);
    setError(null);
    setConfirmOverwrite(null);
  };

  const onSubmit = async (): Promise<void> => {
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

  if (!saving) {
    return (
      <button
        type="button"
        disabled={!allSentencesValid}
        onClick={() => setSaving(true)}
        className="btn-primary"
      >
        Sauvegarder
      </button>
    );
  }

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
          onClick={onSubmit}
          disabled={!name.trim() || !allSentencesValid}
          className="btn-primary"
        >
          Enregistrer
        </button>
        <button type="button" onClick={resetFields} className="btn-secondary">
          Annuler
        </button>
      </div>
    </>
  );
}

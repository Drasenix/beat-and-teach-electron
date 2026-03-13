import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { PatternFormValues } from '../../types/pattern-types';
import { extractIpcError } from '../../../../utils/util';
import validatePattern from '../../utils/pattern-validator';

type SavePatternFormProps = {
  pattern: Pattern;
  onAdd: (data: PatternFormValues) => Promise<void>;
};

export default function SavePatternForm({
  pattern,
  onAdd,
}: SavePatternFormProps) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (): Promise<void> => {
    const errors = validatePattern({ name, sentence: pattern.sentence });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }
    try {
      await onAdd({ name, sentence: pattern.sentence });
      setName('');
      setSaving(false);
      setError(null);
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de créer le pattern.'));
    }
  };

  const handleCancel = (): void => {
    setName('');
    setSaving(false);
    setError(null);
  };

  if (!saving) {
    return (
      <button
        type="button"
        onClick={() => setSaving(true)}
        className="btn-primary"
      >
        Save
      </button>
    );
  }

  return (
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
        onClick={handleConfirm}
        disabled={!name.trim() || !pattern.sentence}
        className="btn-primary"
      >
        Confirmer
      </button>
      <button type="button" onClick={handleCancel} className="btn-secondary">
        Annuler
      </button>
    </div>
  );
}

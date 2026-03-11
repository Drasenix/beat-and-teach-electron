import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import usePatterns from '../hooks/usePatterns';
import { extractIpcError } from '../../../utils/util';

type SavePatternFormProps = {
  pattern: Pattern;
};

export default function SavePatternForm({ pattern }: SavePatternFormProps) {
  const { addPattern } = usePatterns();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (): Promise<void> => {
    try {
      await addPattern({ name, sentence: pattern.sentence });
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

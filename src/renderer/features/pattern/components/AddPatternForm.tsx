import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import usePatterns from '../hooks/usePatterns';

type PatternSaveFormProps = {
  pattern: Pattern;
};
export default function AddPatternForm(props: PatternSaveFormProps) {
  const { pattern } = props;
  const { addPattern, saveError, resetSaveError } = usePatterns();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const handleConfirm = async (): Promise<void> => {
    const success = await addPattern({ name, sentence: pattern.sentence });
    if (success) {
      setName('');
      setSaving(false);
    }
  };

  const handleCancel = (): void => {
    setName('');
    setSaving(false);
    resetSaveError();
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
      {saveError && <span className="error-message">{saveError}</span>}
      <button
        type="button"
        onClick={handleConfirm}
        disabled={!name.trim()}
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

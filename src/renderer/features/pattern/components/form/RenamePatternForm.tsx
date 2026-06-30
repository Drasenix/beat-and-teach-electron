import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';

type RenamePatternFormProps = {
  name: string;
  onRename: (name: string) => Promise<void>;
  onCancel: () => void;
};

export default function RenamePatternForm({
  name,
  onRename,
  onCancel,
}: RenamePatternFormProps) {
  const [newName, setNewName] = useState(name);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (): Promise<void> => {
    if (!newName.trim()) {
      setError('Le nom est requis.');
      return;
    }
    try {
      await onRename(newName.trim());
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de renommer le pattern.'));
    }
  };

  return (
    <div className="form-card">
      <div className="form-content">
        <h3 className="section-title">Renommer</h3>
        <input
          placeholder="Nom du pattern"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input-field w-full"
        />
        {error && <span className="error-message">{error}</span>}
        <div className="flex gap-3">
          <button type="button" onClick={handleSubmit} className="btn-add">
            Enregistrer
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Instrument } from '../models/instrument-model';

type AddInstrumentFormProps = {
  onAdd: (instrument: Omit<Instrument, 'id' | 'slug'>) => Promise<void>;
  onCancel: () => void;
  onOpenFileDialog: () => Promise<string | null>;
};

export default function AddInstrumentForm({
  onAdd,
  onCancel,
  onOpenFileDialog,
}: AddInstrumentFormProps) {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [filepath, setFilepath] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!symbol.trim()) newErrors.push('Le symbole est requis.');
    if (!name.trim()) newErrors.push('Le nom est requis.');
    if (!filepath) newErrors.push('Le fichier audio est requis.');
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSelectFile = async () => {
    const path = await onOpenFileDialog();
    if (path) setFilepath(path);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onAdd({ symbol, name, filepath });
    onCancel();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Nouvel instrument</h3>

      <div className="flex flex-col gap-3">
        <input
          placeholder="Symbole (ex: P)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="input-field w-full"
        />
        <input
          placeholder="Nom (ex: Kickdrum)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field w-full"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectFile}
            className="btn-secondary"
          >
            Sélectionner un fichier
          </button>
          {filepath && (
            <span className="text-text-secondary text-xs font-mono truncate">
              {filepath}
            </span>
          )}
        </div>

        {errors.length > 0 && (
          <ul className="flex flex-col gap-1">
            {errors.map((error) => (
              <li key={error} className="text-red-400 text-xs font-mono">
                {error}
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-3 mt-2">
          <button type="button" onClick={handleSubmit} className="btn-primary">
            Ajouter
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

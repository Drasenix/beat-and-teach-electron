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
      <h3 className="text-xs font-mono text-primary uppercase tracking-widest mb-4">
        Nouvel instrument
      </h3>

      <div className="flex flex-col gap-3">
        <input
          placeholder="Symbole (ex: P)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-background border border-border focus:border-primary focus:outline-none
                     text-text-accent font-mono px-4 py-2 rounded-lg placeholder-text-secondary
                     transition-colors duration-200"
        />
        <input
          placeholder="Nom (ex: Kickdrum)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border border-border focus:border-primary focus:outline-none
                     text-text-accent font-mono px-4 py-2 rounded-lg placeholder-text-secondary
                     transition-colors duration-200"
        />

        {/* Sélection fichier */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSelectFile}
            className="px-4 py-2 bg-background border border-border hover:border-primary
                       text-text-secondary hover:text-primary font-mono text-sm
                       rounded-lg transition-colors duration-200"
          >
            Sélectionner un fichier
          </button>
          {filepath && (
            <span className="text-text-secondary text-xs font-mono truncate">
              {filepath}
            </span>
          )}
        </div>

        {/* Erreurs */}
        {errors.length > 0 && (
          <ul className="flex flex-col gap-1">
            {errors.map((error) => (
              <li key={error} className="text-red-400 text-xs font-mono">
                {error}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary hover:opacity-90 text-background
                       font-bold font-mono rounded-lg uppercase tracking-widest
                       transition-opacity duration-200"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-surface border border-border hover:border-primary
                       text-text-secondary hover:text-primary font-mono
                       rounded-lg uppercase tracking-widest transition-colors duration-200"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

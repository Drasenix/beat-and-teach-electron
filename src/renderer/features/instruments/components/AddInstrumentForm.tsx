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
    <div>
      <input
        placeholder="symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <input
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div>
        <button onClick={handleSelectFile}>
          Sélectionner un fichier audio
        </button>
        {filepath && <span>{filepath}</span>}
      </div>
      {errors.length > 0 && (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <button onClick={handleSubmit}>Ajouter</button>
      <button onClick={onCancel}>Annuler</button>
    </div>
  );
}

import { useState } from 'react';
import { Instrument } from '../models/instrument-model';
import InstrumentForm from './InstrumentForm';
import { extractIpcError } from '../../../utils/util';

type EditInstrumentFormProps = {
  instrument: Instrument;
  onUpdate: (data: Omit<Instrument, 'id' | 'slug'>) => Promise<void>;
  onCancel: () => void;
  onOpenFileDialog: () => Promise<string | null>;
};

export default function EditInstrumentForm({
  instrument,
  onUpdate,
  onCancel,
  onOpenFileDialog,
}: EditInstrumentFormProps) {
  const [symbol, setSymbol] = useState(instrument.symbol);
  const [name, setName] = useState(instrument.name ?? '');
  const [filepath, setFilepath] = useState<string | null>(
    instrument.filepath ?? null,
  );
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const next: string[] = [];
    if (!symbol.trim()) next.push('Le symbole est requis.');
    if (!name.trim()) next.push('Le nom est requis.');
    if (!filepath) next.push('Le fichier audio est requis.');
    setErrors(next);
    return next.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onUpdate({ symbol, name, filepath });
    } catch (error) {
      setErrors([
        extractIpcError(error, "Impossible de modifier l'instrument."),
      ]);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Modifier l&apos;instrument</h3>
      <InstrumentForm
        symbol={symbol}
        name={name}
        filepath={filepath}
        errors={errors}
        submitLabel="Enregistrer"
        onSymbolChange={setSymbol}
        onNameChange={setName}
        onFilepathChange={setFilepath}
        onOpenFileDialog={onOpenFileDialog}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

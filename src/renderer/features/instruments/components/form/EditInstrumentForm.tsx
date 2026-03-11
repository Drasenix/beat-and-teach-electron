import { useState } from 'react';
import { Instrument } from '../../models/instrument-model';
import InstrumentForm from './InstrumentForm';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';

type EditInstrumentFormProps = {
  instrument: Instrument;
  onUpdate: (data: InstrumentFormValues) => Promise<void>;
  onCancel: () => void;
  onOpenFileDialog: () => Promise<string | null>;
};

export default function EditInstrumentForm({
  instrument,
  onUpdate,
  onCancel,
  onOpenFileDialog,
}: EditInstrumentFormProps) {
  const [instrumentValues, setInstrumentValues] =
    useState<InstrumentFormValues>({
      symbol: instrument.symbol,
      name: instrument.name ?? '',
      filepath: instrument.filepath ?? null,
    });
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const next: string[] = [];
    if (!instrumentValues.symbol.trim()) next.push('Le symbole est requis.');
    if (!instrumentValues.name?.trim()) next.push('Le nom est requis.');
    if (!instrumentValues.filepath) next.push('Le fichier audio est requis.');
    setErrors(next);
    return next.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onUpdate(instrumentValues);
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
        instrument={instrumentValues}
        errors={errors}
        submitLabel="Enregistrer"
        onInstrumentChange={(partial) =>
          setInstrumentValues((prev) => ({ ...prev, ...partial }))
        }
        onOpenFileDialog={onOpenFileDialog}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

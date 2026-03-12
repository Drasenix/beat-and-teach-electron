import { useState } from 'react';
import { Instrument } from '../../models/instrument-model';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';
import InstrumentForm from './InstrumentForm';
import { validateInstrument } from '../../utils/instrument-validator';

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

  const handleSubmit = async () => {
    const issues: string[] = validateInstrument(instrumentValues);
    if (issues.length > 0) {
      setErrors(issues);
      return;
    }
    try {
      await onUpdate(instrumentValues);
    } catch (error) {
      setErrors([
        extractIpcError(error, "Impossible de modifier l'instrument."),
      ]);
    }
  };

  return (
    <div className="form-card">
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

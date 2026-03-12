import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';
import InstrumentForm from './InstrumentForm';
import validateInstrument from '../../utils/instrument-validator';

type AddInstrumentFormProps = {
  onAdd: (data: InstrumentFormValues) => Promise<void>;
  onCancel: () => void;
  onOpenFileDialog: () => Promise<string | null>;
};

export default function AddInstrumentForm({
  onAdd,
  onCancel,
  onOpenFileDialog,
}: AddInstrumentFormProps) {
  const [instrumentValues, setInstrumentValues] =
    useState<InstrumentFormValues>({
      symbol: '',
      name: '',
      filepath: null,
    });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    const issues: string[] = validateInstrument(instrumentValues);
    if (issues.length > 0) {
      setErrors(issues);
      return;
    }
    try {
      await onAdd(instrumentValues);
      onCancel();
    } catch (error) {
      setErrors([extractIpcError(error, "Impossible de créer l'instrument.")]);
    }
  };

  return (
    <div className="form-card">
      <h3 className="section-title mb-4">Nouvel instrument</h3>
      <InstrumentForm
        instrument={instrumentValues}
        errors={errors}
        submitLabel="Ajouter"
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

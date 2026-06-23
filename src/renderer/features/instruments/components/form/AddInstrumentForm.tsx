import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';
import InstrumentForm from './InstrumentForm';
import validateInstrument from '../../utils/instrument-validator';
import useDetectPitch from '../../hooks/useDetectPitch';

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
      referenceFrequency: null,
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

  const handleDetectPitch = useDetectPitch(
    instrumentValues.filepath,
    instrumentValues.symbol,
  );

  return (
    <div className="form-card">
      <InstrumentForm
        instrument={instrumentValues}
        errors={errors}
        submitLabel="Ajouter"
        onInstrumentChange={(partial) =>
          setInstrumentValues((prev) => ({ ...prev, ...partial }))
        }
        onOpenFileDialog={onOpenFileDialog}
        onDetectPitch={handleDetectPitch}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        titleLabel="Nouvel instrument"
      />
    </div>
  );
}

import { useState } from 'react';
import { Instrument } from '../../models/instrument-model';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';
import InstrumentForm from './InstrumentForm';
import validateInstrument from '../../utils/instrument-validator';
import useDetectPitch from '../../hooks/useDetectPitch';

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
      referenceFrequency: instrument.referenceFrequency,
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

  const handleDetectPitch = useDetectPitch(
    instrumentValues.filepath,
    instrumentValues.symbol,
  );

  return (
    <div className="form-card">
      <InstrumentForm
        instrument={instrumentValues}
        errors={errors}
        submitLabel="Enregistrer"
        onInstrumentChange={(partial) =>
          setInstrumentValues((prev) => ({ ...prev, ...partial }))
        }
        onOpenFileDialog={onOpenFileDialog}
        onDetectPitch={handleDetectPitch}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        titleLabel="Modifier l'instrument"
      />
    </div>
  );
}

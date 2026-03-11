import { useState } from 'react';
import InstrumentForm from './InstrumentForm';
import { extractIpcError } from '../../../../utils/util';
import { InstrumentFormValues } from '../../types/instrument-types';

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
  const [fields, setFields] = useState<InstrumentFormValues>({
    symbol: '',
    name: '',
    filepath: null,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const next: string[] = [];
    if (!fields.symbol.trim()) next.push('Le symbole est requis.');
    if (!fields.name?.trim()) next.push('Le nom est requis.');
    if (!fields.filepath) next.push('Le fichier audio est requis.');
    setErrors(next);
    return next.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onAdd(fields);
      onCancel();
    } catch (error) {
      setErrors([extractIpcError(error, "Impossible de créer l'instrument.")]);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Nouvel instrument</h3>
      <InstrumentForm
        instrument={fields}
        errors={errors}
        submitLabel="Ajouter"
        onInstrumentChange={(partial) =>
          setFields((prev) => ({ ...prev, ...partial }))
        }
        onOpenFileDialog={onOpenFileDialog}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';
import PatternForm from './PatternForm';
import { PatternFormValues } from '../../types/pattern-types';

type AddPatternFormProps = {
  onAdd: (data: PatternFormValues) => Promise<void>;
  onCancel: () => void;
};

export default function AddPatternForm({
  onAdd,
  onCancel,
}: AddPatternFormProps) {
  const [fields, setFields] = useState<PatternFormValues>({
    name: '',
    sentence: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const next: string[] = [];
    if (!fields.name.trim()) next.push('Le nom est requis.');
    if (!fields.sentence.trim()) next.push('La phrase est requise.');
    setErrors(next);
    return next.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onAdd(fields);
      onCancel();
    } catch (error) {
      setErrors([extractIpcError(error, 'Impossible de créer le pattern.')]);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Nouveau pattern</h3>
      <PatternForm
        pattern={fields}
        errors={errors}
        submitLabel="Ajouter"
        onPatternChange={(partial) =>
          setFields((prev) => ({ ...prev, ...partial }))
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

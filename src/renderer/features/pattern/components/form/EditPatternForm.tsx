import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import PatternForm, { PatternFormValues } from './PatternForm';

type EditPatternFormProps = {
  pattern: Pattern;
  onUpdate: (data: PatternFormValues) => Promise<void>;
  onCancel: () => void;
};

export default function EditPatternForm({
  pattern,
  onUpdate,
  onCancel,
}: EditPatternFormProps) {
  const [fields, setFields] = useState<PatternFormValues>({
    name: pattern.name,
    sentence: pattern.sentence,
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
      await onUpdate(fields);
    } catch (error) {
      setErrors([extractIpcError(error, 'Impossible de modifier le pattern.')]);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Modifier le pattern</h3>
      <PatternForm
        pattern={fields}
        errors={errors}
        submitLabel="Enregistrer"
        onPatternChange={(partial) =>
          setFields((prev) => ({ ...prev, ...partial }))
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

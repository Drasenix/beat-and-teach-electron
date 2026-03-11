import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';
import { PatternFormValues } from '../../types/pattern-types';
import PatternForm from './PatternForm';
import { validatePattern } from '../../utils/pattern-validator';

type AddPatternFormProps = {
  onAdd: (data: PatternFormValues) => Promise<void>;
  onCancel: () => void;
};

export default function AddPatternForm({
  onAdd,
  onCancel,
}: AddPatternFormProps) {
  const [patternValues, setPatternValues] = useState<PatternFormValues>({
    name: '',
    sentence: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    const issues: string[] = validatePattern(patternValues);
    if (issues.length > 0) {
      setErrors(issues);
      return;
    }
    try {
      await onAdd(patternValues);
      onCancel();
    } catch (error) {
      setErrors([extractIpcError(error, 'Impossible de créer le pattern.')]);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mt-4">
      <h3 className="section-title mb-4">Nouveau pattern</h3>
      <PatternForm
        pattern={patternValues}
        errors={errors}
        submitLabel="Ajouter"
        onPatternChange={(partial) =>
          setPatternValues((prev) => ({ ...prev, ...partial }))
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

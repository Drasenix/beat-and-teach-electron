import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import { PatternFormValues } from '../../types/pattern-types';
import PatternForm from './PatternForm';
import validatePattern from '../../utils/pattern-validator';

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
  const [patternValues, setPatternValues] = useState<PatternFormValues>({
    name: pattern.name,
    sentence: pattern.sentence,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    const issues: string[] = validatePattern(patternValues);
    if (issues.length > 0) {
      setErrors(issues);
      return;
    }
    try {
      await onUpdate(patternValues);
    } catch (error) {
      setErrors([extractIpcError(error, 'Impossible de modifier le pattern.')]);
    }
  };

  return (
    <div className="form-card">
      <h3 className="section-title mb-4">Modifier le pattern</h3>
      <PatternForm
        pattern={patternValues}
        errors={errors}
        submitLabel="Enregistrer"
        onPatternChange={(partial) =>
          setPatternValues((prev) => ({ ...prev, ...partial }))
        }
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

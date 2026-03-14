import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import { PatternFormValues } from '../../types/pattern-types';
import PatternForm from './PatternForm';
import validatePattern from '../../utils/pattern-validator';
import usePatternForm from '../../hooks/usePatternForm';

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
  const { patternValues, handlePatternChange, handleNormalize } =
    usePatternForm({
      name: pattern.name,
      sentences: pattern.sentences.length > 0 ? pattern.sentences : [''],
    });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    const issues = validatePattern(patternValues);
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
        onPatternChange={handlePatternChange}
        onNormalize={handleNormalize}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

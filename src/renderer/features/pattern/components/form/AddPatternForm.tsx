import { useState } from 'react';
import { extractIpcError } from '../../../../utils/util';
import { PatternFormValues } from '../../types/pattern-types';
import PatternForm from './PatternForm';
import validatePattern from '../../utils/pattern-validator';
import usePatternForm from '../../hooks/usePatternForm';

type AddPatternFormProps = {
  onAdd: (data: PatternFormValues) => Promise<void>;
  onCancel: () => void;
};

export default function AddPatternForm({
  onAdd,
  onCancel,
}: AddPatternFormProps) {
  const { patternValues, handlePatternChange, handleNormalize } =
    usePatternForm({
      name: '',
      sentences: [''],
      highlights: [[]],
    });
  const [errors, setErrors] = useState<string[]>([]);

  const onSubmit = async () => {
    const issues = validatePattern(patternValues);
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
    <div className="form-card">
      <PatternForm
        pattern={patternValues}
        errors={errors}
        onPatternChange={handlePatternChange}
        onNormalize={handleNormalize}
        onSubmit={onSubmit}
        onCancel={onCancel}
        titleLabel="Nouveau pattern"
      />
    </div>
  );
}

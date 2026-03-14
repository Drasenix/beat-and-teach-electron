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
    });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
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
      <h3 className="section-title mb-4">Nouveau pattern</h3>
      <PatternForm
        pattern={patternValues}
        errors={errors}
        submitLabel="Ajouter"
        onPatternChange={handlePatternChange}
        onNormalize={handleNormalize}
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}

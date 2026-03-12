import { PatternFormValues } from '../../types/pattern-types';

type PatternFormProps = {
  pattern: PatternFormValues;
  errors: string[];
  submitLabel: string;
  onPatternChange: (fields: Partial<PatternFormValues>) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function PatternForm({
  pattern,
  errors,
  submitLabel,
  onPatternChange,
  onSubmit,
  onCancel,
}: PatternFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Nom du pattern"
        value={pattern.name}
        onChange={(e) => onPatternChange({ name: e.target.value })}
        className="input-field w-full"
      />
      <textarea
        placeholder="Phrase (ex: P . P . K .)"
        value={pattern.sentence}
        onChange={(e) => onPatternChange({ sentence: e.target.value })}
        className="input-field w-full resize-none"
        rows={3}
      />

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1">
          {errors.map((e) => (
            <li key={e} className="form-error-item">
              {e}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onSubmit} className="btn-primary">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </div>
  );
}

import { PatternFormValues } from '../../types/pattern-types';

type PatternFormProps = {
  pattern: PatternFormValues;
  errors: string[];
  submitLabel: string;
  onPatternChange: (fields: Partial<PatternFormValues>) => void;
  onNormalize: () => void;
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
  onNormalize,
}: PatternFormProps) {
  const handleSentenceChange = (index: number, value: string) => {
    const next = [...pattern.sentences];
    next[index] = value;
    onPatternChange({ sentences: next });
  };

  const handleAddSentence = () => {
    onPatternChange({ sentences: [...pattern.sentences, ''] });
  };

  const handleRemoveSentence = (index: number) => {
    const next = pattern.sentences.filter((_, i) => i !== index);
    onPatternChange({ sentences: next });
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Nom du pattern"
        value={pattern.name}
        onChange={(e) => onPatternChange({ name: e.target.value })}
        className="input-field w-full"
      />

      <div className="flex flex-col gap-2">
        {pattern.sentences.map((sentence, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex items-start gap-2">
            <textarea
              placeholder="Phrase (ex: P . P . K .)"
              value={sentence}
              onChange={(e) => handleSentenceChange(index, e.target.value)}
              onBlur={onNormalize}
              className="input-field flex-1 resize-none"
              rows={2}
            />
            {pattern.sentences.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveSentence(index)}
                className="btn-delete mt-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSentence}
          className="btn-secondary self-start"
        >
          + Ajouter une phrase
        </button>
      </div>

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

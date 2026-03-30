import { PatternFormValues } from '../../types/pattern-types';
import SentencesForm from './SentencesForm';
import PatternSteps from '../PatternSteps';

type PatternFormProps = {
  pattern: PatternFormValues;
  errors: string[];
  titleLabel: string;
  onPatternChange: (fields: Partial<PatternFormValues>) => void;
  onNormalize: () => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function PatternForm({
  pattern,
  errors,
  titleLabel,
  onPatternChange,
  onNormalize,
  onSubmit,
  onCancel,
}: PatternFormProps) {
  const changeSentence = (index: number, value: string) => {
    const next = [...pattern.sentences];
    next[index] = value;
    onPatternChange({ sentences: next });
  };

  const removeSentence = (index: number) => {
    const next = pattern.sentences.filter((_, i) => i !== index);
    onPatternChange({ sentences: next });
  };

  const addSentence = () => {
    onPatternChange({ sentences: [...pattern.sentences, ''] });
  };

  const changeHighlight = (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => {
    const next = pattern.highlights.map((row, i) =>
      i === sentenceIndex
        ? row.map((c, j) => (j === tokenIndex ? color : c))
        : row,
    );
    onPatternChange({ highlights: next });
  };

  return (
    <div className="form-content">
      <h3 className="section-title">{titleLabel}</h3>
      <input
        placeholder="Nom du pattern"
        value={pattern.name}
        onChange={(e) => onPatternChange({ name: e.target.value })}
        className="input-field w-full"
      />
      <SentencesForm
        sentences={pattern.sentences}
        onChangeSentence={changeSentence}
        onRemoveSentence={removeSentence}
        onAddSentence={addSentence}
        onBlur={onNormalize}
      />
      <PatternSteps
        sentences={pattern.sentences}
        highlights={pattern.highlights}
        onChangeHighlight={changeHighlight}
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
      <div className="flex gap-3">
        <button type="button" onClick={onSubmit} className="btn-primary">
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </div>
  );
}

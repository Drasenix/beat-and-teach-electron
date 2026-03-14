import { Pattern } from '../models/pattern-model';
import SavePatternForm from './form/SavePatternForm';
import PatternSteps from './PatternSteps';

type PatternEditorProps = {
  pattern: Pattern;
  changePatternSentence: (index: number, value: string) => void;
  addSentence: () => void;
  removeSentence: (index: number) => void;
  normalizeAllSentences: () => void;
};

export default function PatternEditor({
  pattern,
  changePatternSentence,
  addSentence,
  removeSentence,
  normalizeAllSentences,
}: PatternEditorProps) {
  return (
    <div className="w-full max-w-2xl">
      <p className="section-title mb-2">Pattern</p>

      <div className="flex flex-col gap-4">
        {pattern.sentences.map((sentence, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <textarea
                value={sentence}
                onChange={(e) => changePatternSentence(index, e.target.value)}
                onBlur={normalizeAllSentences}
                placeholder="P Ts K . P (Ts P) K"
                className="input-field flex-1 text-xl p-4 resize-none h-24"
              />
              {pattern.sentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSentence(index)}
                  className="btn-delete mt-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        <PatternSteps sentences={pattern.sentences} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <button type="button" onClick={addSentence} className="btn-secondary">
          + Ajouter une piste
        </button>
        <SavePatternForm pattern={pattern} />
      </div>
    </div>
  );
}

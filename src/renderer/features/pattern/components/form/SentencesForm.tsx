import { countSentenceSteps } from '../../utils/pattern-parser';
import SentenceInput from './SentenceInput';

type SentencesFormProps = {
  sentences: string[];
  withBackground?: boolean;
  onChangeSentence: (index: number, value: string) => void;
  onRemoveSentence: (index: number) => void;
  onAddSentence: () => void;
  onBlur: () => void;
};

export default function SentencesForm({
  sentences,
  withBackground,
  onChangeSentence,
  onRemoveSentence,
  onAddSentence,
  onBlur,
}: SentencesFormProps) {
  const maxTokens = countSentenceSteps(sentences[0]);
  return (
    <div className="pattern-section-content">
      <h2 className="section-title">Pistes</h2>
      <div
        className={`pattern-section-content ${withBackground ? 'section-background' : ''}`}
      >
        {sentences.map((sentence, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <SentenceInput
                sentence={sentence}
                maxTokens={index > 0 ? maxTokens : undefined}
                onChange={(value) => onChangeSentence(index, value)}
                onBlur={onBlur}
              />
              {sentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSentence(index)}
                  className="btn-delete"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddSentence}
          className="btn-add self-start"
        >
          + Ajouter une piste
        </button>
      </div>
    </div>
  );
}

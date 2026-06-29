import { Plus, X } from 'lucide-react';
import SentenceInput from './SentenceInput';

type SentencesFormProps = {
  sentences: string[];
  withBackground?: boolean;
  onChangeSentence: (index: number, value: string) => void;
  onRemoveSentence: (index: number) => void;
  onAddSentence: () => void;
};

export default function SentencesForm({
  sentences,
  withBackground,
  onChangeSentence,
  onRemoveSentence,
  onAddSentence,
}: SentencesFormProps) {
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
                onChange={(value) => onChangeSentence(index, value)}
              />
              {sentences.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSentence(index)}
                  className="btn-delete"
                >
                  <X size={16} />
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
          <Plus size={16} /> Ajouter une piste
        </button>
      </div>
    </div>
  );
}

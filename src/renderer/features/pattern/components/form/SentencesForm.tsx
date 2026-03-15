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
              <textarea
                value={sentence}
                onChange={(e) => onChangeSentence(index, e.target.value)}
                onBlur={onBlur}
                placeholder="P Ts K . P (Ts P) K"
                className="input-field flex-1 text-xl p-4 resize-none h-24"
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
          className="btn-secondary self-start"
        >
          + Ajouter une piste
        </button>
      </div>
    </div>
  );
}

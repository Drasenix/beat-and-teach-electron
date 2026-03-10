import { useMemo } from 'react';
import { Pattern } from '../models/pattern-model';
import PatternTokens from './PatternTokens';
import { parseTokens } from '../utils/pattern-parser';
import useInstruments from '../../instruments/hooks/useInstruments';

type PatternEditorComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternEditor(props: PatternEditorComponentProps) {
  const { pattern, changePatternSentence } = props;
  const { instruments, error } = useInstruments();
  const tokens = useMemo(
    () =>
      parseTokens(
        pattern.sentence,
        instruments.map((i) => i.symbol),
      ),
    [pattern.sentence, instruments],
  );
  return (
    <>
      <div className="w-full max-w-2xl">
        <label htmlFor="pattern-input" className="section-title block mb-2">
          Pattern
          <textarea
            id="pattern-input"
            value={pattern.sentence}
            onChange={changePatternSentence}
            placeholder={pattern.sentence || 'P Ts K . P (Ts P) K'}
            className="input-field w-full text-xl p-4 resize-none h-24 mt-2"
          />
          <PatternTokens tokens={tokens} />
        </label>
      </div>

      {error && (
        <div className="w-full max-w-2xl mt-4 error-message">{error}</div>
      )}
    </>
  );
}

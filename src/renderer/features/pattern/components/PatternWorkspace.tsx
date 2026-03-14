import usePattern from '../hooks/usePattern';
import usePatterns from '../hooks/usePatterns';
import { Pattern } from '../models/pattern-model';
import PatternChoices from './PatternChoices';
import PatternComposer from './PatternComposer';

export default function PatternWorkspace() {
  const {
    pattern,
    setPattern,
    changePatternSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
  } = usePattern();
  const { patterns } = usePatterns();

  const selectPattern = (id: number): void => {
    const selected: Pattern | undefined = patterns.find((p) => p.id === id);
    if (selected) setPattern(selected);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <PatternChoices patterns={patterns} selectPattern={selectPattern} />
      <PatternComposer
        pattern={pattern}
        changePatternSentence={changePatternSentence}
        addSentence={addSentence}
        removeSentence={removeSentence}
        normalizeAllSentences={normalizeAllSentences}
      />
    </div>
  );
}

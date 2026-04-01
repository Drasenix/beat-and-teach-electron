import { useState } from 'react';
import usePattern from '../hooks/usePattern';
import usePatterns from '../hooks/usePatterns';
import { Pattern } from '../models/pattern-model';
import PatternChoices from './PatternChoices';
import PatternComposer from './PatternComposer';

export default function PatternWorkspace() {
  const {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
    changeHighlight,
    resetPattern,
  } = usePattern();
  const { patterns } = usePatterns();
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);

  const selectPattern = (selected: Pattern | null): void => {
    setSelectedPattern(selected);
    if (selected) {
      setPattern(selected);
    } else {
      resetPattern();
    }
  };

  return (
    <div className="content-page gap-3">
      <PatternChoices patterns={patterns} selectPattern={selectPattern} />
      <PatternComposer
        pattern={pattern}
        selectedPattern={selectedPattern}
        changeSentence={changeSentence}
        addSentence={addSentence}
        removeSentence={removeSentence}
        normalizeAllSentences={normalizeAllSentences}
        changeHighlight={changeHighlight}
      />
    </div>
  );
}

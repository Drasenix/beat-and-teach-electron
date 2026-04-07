import React, { useRef, useState } from 'react';
import Autocomplete from '../../../autocomplete/components/Autocomplete';
import useAutocomplete from '../../../autocomplete/hooks/useAutocomplete';
import useCaretPosition from '../../../autocomplete/hooks/useCaretPosition';
import useInstruments from '../../../instruments/hooks/useInstruments';
import { countSentenceSteps } from '../../utils/pattern-parser';

type SentenceInputProps = {
  sentence: string;
  maxTokens?: number;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export default function SentenceInput({
  sentence,
  maxTokens,
  onChange,
  onBlur,
}: SentenceInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [caretPos, setCaretPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showLimit, setShowLimit] = useState(false);
  const { getPosition } = useCaretPosition(textareaRef);
  const { instruments } = useInstruments();
  const {
    suggestions,
    selectedIndex,
    isOpen,
    handleKeyDown,
    confirmSuggestion,
    setDismissed,
    setIsFocused,
  } = useAutocomplete({ instruments, value: sentence, onChange });

  const handleWrapSelection = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (e.key !== '(' && e.key !== ')') return;

    const textarea: HTMLTextAreaElement | null = textareaRef.current;
    if (!textarea) return;

    const start: number = textarea.selectionStart;
    const end: number = textarea.selectionEnd;

    if (start === end) return;

    e.preventDefault();

    const selected: string = sentence.slice(start, end);
    const wrapped: string = `(${selected})`;
    const newValue: string =
      sentence.slice(0, start) + wrapped + sentence.slice(end);

    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.selectionStart = start + wrapped.length;
      textarea.selectionEnd = start + wrapped.length;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCaretPos(getPosition());

    if (
      maxTokens !== undefined &&
      countSentenceSteps(e.target.value) > maxTokens
    ) {
      setShowLimit(true);
      setTimeout(() => setShowLimit(false), 2000);
    } else {
      setShowLimit(false);
    }
  };

  return (
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={sentence}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setDismissed(true);
          onBlur();
        }}
        onKeyDown={(e) => {
          handleWrapSelection(e);
          if (!e.defaultPrevented) {
            handleKeyDown(e);
          }
        }}
        placeholder="P Ts K . P (Ts P) K"
        className="input-field w-full text-xl p-4 resize-none h-24"
      />
      {isOpen && caretPos && (
        <Autocomplete
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelect={confirmSuggestion}
          caretPos={caretPos}
        />
      )}
      {showLimit && caretPos && (
        <div
          style={{
            position: 'absolute',
            top: caretPos.top + 20,
            left: caretPos.left,
          }}
          className="z-50 bg-surface border border-primary rounded-lg px-3 py-1 text-xs font-mono text-primary shadow-xl"
        >
          Limite atteinte, ({maxTokens} notes sur la piste 1)
        </div>
      )}
    </div>
  );
}

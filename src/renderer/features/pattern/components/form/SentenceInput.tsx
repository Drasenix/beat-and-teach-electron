import React, { useRef, useState } from 'react';
import Autocomplete from '../../../autocomplete/components/Autocomplete';
import useAutocomplete from '../../../autocomplete/hooks/useAutocomplete';
import useCaretPosition from '../../../autocomplete/hooks/useCaretPosition';
import useInstruments from '../../../instruments/hooks/useInstruments';
import { countSentenceSteps } from '../../utils/pattern-parser';
import normalizeSpaces from '../../../../utils/normalize-spaces';

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
  const [caretIndex, setCaretIndex] = useState(0);
  const [showLimit, setShowLimit] = useState(false);
  const { getPosition } = useCaretPosition(textareaRef);
  const { instruments } = useInstruments();
  const {
    suggestions,
    selectedIndex,
    isOpen,
    forceHidden,
    handleKeyDown,
    confirmSuggestion,
    toggleAutocomplete,
    setDismissed,
    setIsFocused,
  } = useAutocomplete({
    instruments,
    value: sentence,
    caretIndex,
    onChange,
    setCaretIndex,
    textareaRef,
  });

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
    const raw = e.target.value;
    const rawCaret = e.target.selectionStart;
    const normalized = normalizeSpaces(raw);

    onChange(normalized);

    const newCaret =
      normalized !== raw
        ? normalizeSpaces(raw.substring(0, rawCaret)).length
        : rawCaret;

    setCaretIndex(newCaret);
    if (normalized !== raw) {
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(newCaret, newCaret);
        setCaretPos(getPosition());
      });
    } else {
      setCaretPos(getPosition());
    }

    if (maxTokens !== undefined && countSentenceSteps(normalized) > maxTokens) {
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
        onSelect={(e) => {
          setCaretIndex(e.currentTarget.selectionStart);
          setCaretPos(getPosition());
        }}
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
        className="input-field w-full text-xl p-4 pr-8 resize-none h-24"
      />
      <button
        type="button"
        onClick={toggleAutocomplete}
        title={
          forceHidden
            ? "Afficher l'autocomplétion (Ctrl+Espace)"
            : "Masquer l'autocomplétion (Ctrl+Espace)"
        }
        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded text-sm leading-none opacity-30 hover:opacity-100 transition-opacity text-text-secondary"
      >
        {forceHidden ? '\u2298' : '\u25BC'}
      </button>
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

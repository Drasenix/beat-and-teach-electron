import React, { useRef, useState } from 'react';
import Autocomplete from '../../../autocomplete/components/Autocomplete';
import useAutocomplete from '../../../autocomplete/hooks/useAutocomplete';
import useCaretPosition from '../../../autocomplete/hooks/useCaretPosition';
import useInstruments from '../../../instruments/hooks/useInstruments';

type SentenceInputProps = {
  sentence: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

export default function SentenceInput({
  sentence,
  onChange,
  onBlur,
}: SentenceInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [caretPos, setCaretPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCaretPos(getPosition());
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
        onKeyDown={handleKeyDown}
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
    </div>
  );
}

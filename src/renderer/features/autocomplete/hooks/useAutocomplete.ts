import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Instrument } from '../../instruments/models/instrument-model';

type UseAutocompleteProps = {
  instruments: Instrument[];
  value: string;
  caretIndex: number;
  onChange: (value: string) => void;
  setCaretIndex: (index: number) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

const useAutocomplete = ({
  instruments,
  value,
  caretIndex,
  onChange,
  setCaretIndex,
  textareaRef,
}: UseAutocompleteProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [forceHidden, setForceHidden] = useState(false);
  const currentToken = useMemo(
    () =>
      (value.substring(0, caretIndex).split(' ').pop() ?? '')
        .replace(/^\(/, '')
        .replace(/@.*$/, ''),
    [value, caretIndex],
  );

  useEffect(() => {
    if (isFocused) {
      setDismissed(false);
    }
  }, [currentToken, isFocused]);

  const suggestions = useMemo(() => {
    if (currentToken.length === 0) return [];
    return instruments.filter(
      (i) =>
        i.symbol !== '.' &&
        i.symbol.toLowerCase().startsWith(currentToken.toLowerCase()),
    );
  }, [currentToken, instruments]);

  useEffect(() => {
    if (suggestions.length > 0 && selectedIndex >= suggestions.length) {
      setSelectedIndex(0);
    }
  }, [suggestions.length, selectedIndex]);

  const isOpen = suggestions.length > 0 && !dismissed && !forceHidden;

  const toggleAutocomplete = useCallback(() => {
    setForceHidden((prev) => !prev);
    setDismissed(false);
  }, []);

  const confirmSuggestion = useCallback(
    (instrument: Instrument) => {
      const textBeforeCaret = value.substring(0, caretIndex);
      const tokenIndex =
        textBeforeCaret.length === 0
          ? 0
          : textBeforeCaret.split(' ').length - 1;
      const tokens = value.split(' ');
      const tokenToReplace = tokens[tokenIndex] ?? '';
      const prefix = tokenToReplace.startsWith('(') ? '(' : '';

      let tokenStart = 0;
      for (let i = 0; i < tokenIndex; i += 1) {
        tokenStart += tokens[i].length + 1;
      }

      tokens[tokenIndex] = `${prefix}${instrument.symbol}`;
      onChange(`${tokens.join(' ')} `);
      setSelectedIndex(0);

      const newCaretIndex =
        tokenStart + prefix.length + instrument.symbol.length + 1;
      setCaretIndex(newCaretIndex);
      requestAnimationFrame(() => {
        textareaRef.current?.setSelectionRange(newCaretIndex, newCaretIndex);
      });
    },
    [value, caretIndex, onChange, setCaretIndex, textareaRef],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        toggleAutocomplete();
        return;
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
      } else if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const instrument = suggestions[selectedIndex];
        if (instrument) {
          confirmSuggestion(instrument);
          setDismissed(true);
        }
      } else if (e.key === ')') {
        e.preventDefault();
        const instrument = suggestions[selectedIndex];
        if (instrument) {
          confirmSuggestion({ ...instrument, symbol: `${instrument.symbol})` });
          setDismissed(true);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setDismissed(true);
      }
    },
    [isOpen, suggestions, selectedIndex, confirmSuggestion, toggleAutocomplete],
  );

  return {
    suggestions,
    selectedIndex,
    isOpen,
    forceHidden,
    handleKeyDown,
    confirmSuggestion,
    toggleAutocomplete,
    setDismissed,
    setIsFocused,
  };
};

export default useAutocomplete;

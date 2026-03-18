import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Instrument } from '../../instruments/models/instrument-model';

type UseAutocompleteProps = {
  instruments: Instrument[];
  value: string;
  onChange: (value: string) => void;
};

const useAutocomplete = ({
  instruments,
  value,
  onChange,
}: UseAutocompleteProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const currentToken = (value.split(' ').pop() ?? '').replace(/^\(/, '');

  useEffect(() => {
    if (isFocused) setDismissed(false);
  }, [currentToken, isFocused]);

  const suggestions = useMemo(() => {
    if (currentToken.length === 0) return [];
    return instruments.filter((i) =>
      i.symbol.toLowerCase().startsWith(currentToken.toLowerCase()),
    );
  }, [currentToken, instruments]);

  const isOpen = suggestions.length > 0 && !dismissed;

  const confirmSuggestion = useCallback(
    (instrument: Instrument) => {
      const tokens = value.split(' ');
      const lastToken = tokens[tokens.length - 1];
      const prefix = lastToken.startsWith('(') ? '(' : '';
      tokens[tokens.length - 1] = `${prefix}${instrument.symbol}`;
      onChange(`${tokens.join(' ')} `);
      setSelectedIndex(0);
    },
    [value, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + suggestions.length) % suggestions.length,
        );
      } else if (e.key === 'Tab' || e.key === ' ') {
        e.preventDefault();
        confirmSuggestion(suggestions[selectedIndex]);
      } else if (e.key === ')') {
        e.preventDefault();
        confirmSuggestion({
          ...suggestions[selectedIndex],
          symbol: `${suggestions[selectedIndex].symbol})`,
        });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setDismissed(true);
      }
    },
    [isOpen, suggestions, selectedIndex, confirmSuggestion],
  );

  return {
    suggestions,
    selectedIndex,
    isOpen,
    handleKeyDown,
    confirmSuggestion,
    setDismissed,
    setIsFocused,
  };
};

export default useAutocomplete;

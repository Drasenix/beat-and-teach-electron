import React, { useCallback } from 'react';

function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number } {
  const mirror = document.createElement('div');
  const style = window.getComputedStyle(element);

  [
    'boxSizing',
    'width',
    'padding',
    'border',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'whiteSpace',
    'wordBreak',
    'overflowWrap',
  ].forEach((prop) => {
    mirror.style[prop as any] = style[prop as any];
  });

  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.overflow = 'hidden';
  mirror.style.top = '0';
  mirror.style.left = '0';

  const textBefore = element.value.substring(0, position);
  mirror.textContent = textBefore;

  const caret = document.createElement('span');
  caret.textContent = '\u200b'; // zero-width space
  mirror.appendChild(caret);

  element.parentElement?.appendChild(mirror);

  const caretRect = caret.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  element.parentElement?.removeChild(mirror);

  return {
    top: caretRect.top - elementRect.top + element.scrollTop,
    left: caretRect.left - elementRect.left,
  };
}

const useCaretPosition = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
  const getPosition = useCallback((): { top: number; left: number } | null => {
    const el = ref.current;
    if (!el) return null;
    return getCaretCoordinates(el, el.selectionStart);
  }, [ref]);

  return { getPosition };
};

export default useCaretPosition;

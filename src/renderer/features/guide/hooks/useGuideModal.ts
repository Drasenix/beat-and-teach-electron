import { useState, useCallback } from 'react';

export default function useGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  const showGuideModal = useCallback(() => setIsOpen(true), []);
  const hideGuideModal = useCallback(() => setIsOpen(false), []);

  return { isOpen, showGuideModal, hideGuideModal };
}

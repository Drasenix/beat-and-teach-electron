import { useEffect } from 'react';
import { useGuideModalContext } from './GuideModalProvider';
import GuideShortcuts from './GuideShortcuts';
import Modal from '../../../components/Modal';

export default function GuideModal() {
  const { isOpen, hideGuideModal } = useGuideModalContext();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hideGuideModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hideGuideModal]);

  if (!isOpen) return null;

  return (
    <Modal onClose={hideGuideModal}>
      <div className="max-w-2xl w-full relative bg-surface border border-border rounded-lg p-6 ">
        <div className="flex justify-between items-center mb-4">
          <div />
          <button
            type="button"
            onClick={hideGuideModal}
            className="text-text-secondary hover:text-primary"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <GuideShortcuts />
        </div>
      </div>
    </Modal>
  );
}

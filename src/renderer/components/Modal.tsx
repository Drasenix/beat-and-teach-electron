import { ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Fermer"
      />
      <div className="div-animated-wrapper">
        <div className="relative bg-surface border border-border rounded-lg p-6 max-w-md ">
          {children}
        </div>
      </div>
    </div>
  );
}

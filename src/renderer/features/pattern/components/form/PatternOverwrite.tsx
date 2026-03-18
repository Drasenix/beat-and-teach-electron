import Modal from '../../../../components/Modal';

type PatternOverwriteProps = {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function PatternOverwrite({
  name,
  onConfirm,
  onCancel,
}: PatternOverwriteProps) {
  return (
    <Modal onClose={onCancel}>
      <p className="section-title mb-4">Pattern existant</p>
      <p className="text-text-secondary text-sm font-mono mb-6">
        Le pattern <span className="text-primary uppercase">{name}</span> existe
        déjà. Voulez-vous l&apos;écraser ?
      </p>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-confirm-delete"
        >
          Confirmer
        </button>
      </div>
    </Modal>
  );
}

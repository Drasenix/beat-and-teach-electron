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
    <div className="flex flex-col gap-4">
      <p className="section-title">Pattern existant</p>
      <p className="text-text-secondary font-mono text-sm">
        <div>
          Le pattern <span className="text-primary uppercase">{name}</span>{' '}
          existe déjà.
        </div>
        <div>Voulez-vous l&apos;écraser ?</div>
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
    </div>
  );
}

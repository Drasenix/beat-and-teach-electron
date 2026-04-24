type ItemActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
  onConfirm: () => Promise<void>;
  isConfirming: boolean;
};

export default function ItemActions({
  onEdit,
  onDelete,
  onCancelDelete,
  onConfirm,
  isConfirming,
}: ItemActionsProps) {
  if (isConfirming) {
    return (
      <div className="edit-delete">
        <span className="text-text-secondary text-xs font-mono">
          Confirmer ?
        </span>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-confirm-delete"
        >
          Oui
        </button>
        <button
          type="button"
          onClick={onCancelDelete}
          className="btn-secondary px-3 py-1 text-xs"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={onEdit} className="btn-edit">
        ✎
      </button>
      <button type="button" onClick={onDelete} className="btn-delete">
        ✕
      </button>
    </div>
  );
}

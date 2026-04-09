import { useState } from 'react';

function useConfigurationActions<TData>(
  onRemove: (id: number) => Promise<void>,
  onEdit: (id: number, data: TData) => Promise<void>,
) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const onStartAdding = () => {
    setAdding(true);
    setEditingId(null);
  };

  const onCancelAdding = () => {
    setAdding(false);
  };

  const handleConfirm = async (id: number) => {
    await onRemove(id);
    setConfirmDeleteId(null);
  };

  const handleEdit = async (id: number, data: TData) => {
    await onEdit(id, data);
    setEditingId(null);
  };

  return {
    adding,
    onStartAdding,
    onCancelAdding,
    editingId,
    setEditingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleConfirm,
    handleEdit,
  };
}

export default useConfigurationActions;

import { ReactNode } from 'react';

type ConfigurationItemProps = {
  id: number;
  editingId: number | null;
  leftContent: ReactNode;
  rightContent: ReactNode;
  editForm: ReactNode;
};

export default function ConfigurationItem({
  id,
  editingId,
  leftContent,
  rightContent,
  editForm,
}: ConfigurationItemProps) {
  return (
    <li className="flex flex-col">
      <div className="item-row">
        <span className="item-row-column-left">{leftContent}</span>
        <span className="item-row-column-right">{rightContent}</span>
      </div>

      {editingId === id && editForm}
    </li>
  );
}

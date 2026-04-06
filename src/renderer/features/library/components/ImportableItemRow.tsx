import React from 'react';
import { ConflictAction } from '../../../../shared/models/library-dto';

type ImportableItemRowProps = {
  slug: string;
  name: string | null;
  symbol: string | null;
  isSelected: boolean;
  hasConflict: boolean;
  conflictAction: ConflictAction;
  renameName: string;
  onToggle: () => void;
  onActionChange: (action: ConflictAction) => void;
  onRenameChange: (name: string) => void;
};

export default function ImportableItemRow({
  slug,
  name,
  symbol,
  isSelected,
  hasConflict,
  conflictAction,
  renameName,
  onToggle,
  onActionChange,
  onRenameChange,
}: ImportableItemRowProps) {
  return (
    <div className="library-item">
      <input type="checkbox" checked={isSelected} onChange={onToggle} />
      {symbol !== null && <span className="library-item-symbol">{symbol}</span>}
      <span className="library-item-name">{name ?? '(sans nom)'}</span>
      <span className="library-item-slug">{slug}</span>
      {hasConflict && isSelected && (
        <div className="conflict-resolution">
          <select
            value={conflictAction}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onActionChange(e.target.value as ConflictAction)
            }
          >
            <option value="skip">Ignorer</option>
            <option value="overwrite">Écraser</option>
            <option value="rename">Renommer</option>
          </select>
          {conflictAction === 'rename' && (
            <input
              type="text"
              className="input-field"
              placeholder="Nouveau nom"
              value={renameName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onRenameChange(e.target.value)
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

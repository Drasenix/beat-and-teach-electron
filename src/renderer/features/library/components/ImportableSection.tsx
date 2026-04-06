import { useState, useEffect, useRef } from 'react';
import {
  ConflictAction,
  ConflictResolution,
} from '../../../../shared/models/library-dto';
import ImportableItemRow from './ImportableItemRow';

type ImportableItem = {
  slug: string;
  name: string | null;
  symbol?: string | null;
};

type ImportableSectionProps = {
  title: string;
  items: ImportableItem[];
  existingSlugs: string[];
  existingSymbols?: string[];
  type: 'pattern' | 'instrument';
  onResolutionsChange: (resolutions: ConflictResolution[]) => void;
};

export default function ImportableSection({
  title,
  items,
  existingSlugs,
  existingSymbols,
  type,
  onResolutionsChange,
}: ImportableSectionProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(items.map((item) => item.slug)),
  );
  const [actions, setActions] = useState<Record<string, ConflictAction>>(() => {
    const initial: Record<string, ConflictAction> = {};
    items.forEach((item) => {
      const hasConflict: boolean =
        existingSlugs.includes(item.slug) ||
        (existingSymbols?.includes(item.symbol ?? '') ?? false);
      initial[item.slug] = hasConflict ? 'skip' : 'overwrite';
    });
    return initial;
  });
  const [renameNames, setRenameNames] = useState<Record<string, string>>({});
  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  const allSelected: boolean =
    selected.size === items.length && items.length > 0;
  const someSelected: boolean =
    selected.size > 0 && selected.size < items.length;

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someSelected;
    }
  }, [selected, someSelected]);

  const toggleAll = (): void => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((item) => item.slug)));
    }
  };

  const toggleItem = (slug: string): void => {
    setSelected((prev) => {
      const next: Set<string> = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const setAction = (slug: string, action: ConflictAction): void => {
    setActions((prev) => ({ ...prev, [slug]: action }));
  };

  const setRenameName = (slug: string, name: string): void => {
    setRenameNames((prev) => ({ ...prev, [slug]: name }));
  };

  useEffect(() => {
    const resolutions: ConflictResolution[] = [];

    items.forEach((item) => {
      if (!selected.has(item.slug)) {
        return;
      }
      const action: ConflictAction = actions[item.slug] ?? 'skip';
      const resolution: ConflictResolution = {
        type,
        slug: item.slug,
        action,
      };
      if (action === 'rename') {
        resolution.newName = renameNames[item.slug] || item.name || '';
      }
      resolutions.push(resolution);
    });

    onResolutionsChange(resolutions);
  }, [selected, actions, renameNames, items, type, onResolutionsChange]);

  return (
    <div className="library-section">
      <div className="library-section-header">
        <label className="library-section-title" htmlFor={`master-${type}`}>
          <input
            id={`master-${type}`}
            ref={masterCheckboxRef}
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />
          <span>
            {title} ({items.length})
          </span>
        </label>
        {someSelected && (
          <span className="library-section-count">
            {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {items.map((item) => {
        const hasConflict: boolean =
          existingSlugs.includes(item.slug) ||
          (existingSymbols?.includes(item.symbol ?? '') ?? false);
        return (
          <ImportableItemRow
            key={item.slug}
            slug={item.slug}
            name={item.name}
            symbol={item.symbol ?? null}
            isSelected={selected.has(item.slug)}
            hasConflict={hasConflict}
            conflictAction={actions[item.slug] ?? 'skip'}
            renameName={renameNames[item.slug] || ''}
            onToggle={() => toggleItem(item.slug)}
            onActionChange={(action) => setAction(item.slug, action)}
            onRenameChange={(name) => setRenameName(item.slug, name)}
          />
        );
      })}
    </div>
  );
}

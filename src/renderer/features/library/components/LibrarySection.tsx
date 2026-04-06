import React, { useState, useEffect, useRef } from 'react';

type LibrarySectionProps<T> = {
  title: string;
  items: T[];
  onSelectionChange: (ids: Set<number>) => void;
  getId: (item: T) => number;
  children: (
    item: T,
    isSelected: boolean,
    toggle: () => void,
  ) => React.ReactNode;
};

export default function LibrarySection<T>({
  title,
  items,
  onSelectionChange,
  getId,
  children,
}: LibrarySectionProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const masterRef = useRef<HTMLInputElement>(null);

  const masterId: string = `master-${title.toLowerCase()}`;
  const allSelected: boolean =
    selectedIds.size === items.length && items.length > 0;
  const someSelected: boolean =
    selectedIds.size > 0 && selectedIds.size < items.length;

  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.indeterminate = someSelected;
    }
  }, [selectedIds, someSelected]);

  useEffect(() => {
    onSelectionChange(selectedIds);
  }, [selectedIds, onSelectionChange]);

  const toggleAll = (): void => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => getId(item))));
    }
  };

  const toggle = (id: number): void => {
    setSelectedIds((prev) => {
      const next: Set<number> = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="library-section">
      <div className="library-section-header">
        <label className="library-section-title" htmlFor={masterId}>
          <input
            ref={masterRef}
            id={masterId}
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
            {selectedIds.size} sélectionné{selectedIds.size > 1 ? 's' : ''}
          </span>
        )}
      </div>
      {items.map((item) => {
        const id: number = getId(item);
        const isSelected: boolean = selectedIds.has(id);
        return children(item, isSelected, () => toggle(id));
      })}
    </div>
  );
}

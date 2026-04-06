import React, { useState } from 'react';
import {
  LibraryManifest,
  ConflictResolution,
} from '../../../../shared/models/library-dto';
import ImportableSection from './ImportableSection';

type ImportPreviewModalProps = {
  manifest: LibraryManifest;
  onConfirm: (resolutions: ConflictResolution[]) => void;
  onCancel: () => void;
  existingPatternSlugs: string[];
  existingInstrumentSlugs: string[];
  existingInstrumentSymbols: string[];
};

export default function ImportPreviewModal({
  manifest,
  onConfirm,
  onCancel,
  existingPatternSlugs,
  existingInstrumentSlugs,
  existingInstrumentSymbols,
}: ImportPreviewModalProps) {
  const [patternResolutions, setPatternResolutions] = useState<
    ConflictResolution[]
  >([]);
  const [instrumentResolutions, setInstrumentResolutions] = useState<
    ConflictResolution[]
  >([]);

  const handleConfirm = (): void => {
    const resolutions: ConflictResolution[] = [
      ...patternResolutions,
      ...instrumentResolutions,
    ];
    onConfirm(resolutions);
  };

  return (
    <div
      className="modal-overlay"
      role="button"
      tabIndex={0}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      }}
    >
      <div className="modal-content">
        <h2 className="section-title">Importer une bibliothèque</h2>

        {manifest.patterns.length > 0 && (
          <ImportableSection
            title="Patterns"
            items={manifest.patterns}
            existingSlugs={existingPatternSlugs}
            type="pattern"
            onResolutionsChange={setPatternResolutions}
          />
        )}

        {manifest.instruments.length > 0 && (
          <ImportableSection
            title="Instruments"
            items={manifest.instruments}
            existingSlugs={existingInstrumentSlugs}
            existingSymbols={existingInstrumentSymbols}
            type="instrument"
            onResolutionsChange={setInstrumentResolutions}
          />
        )}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annuler
          </button>
          <button type="button" className="btn-primary" onClick={handleConfirm}>
            Importer
          </button>
        </div>
      </div>
    </div>
  );
}

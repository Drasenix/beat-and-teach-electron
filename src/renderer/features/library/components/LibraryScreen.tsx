import { useState } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import usePatterns from '../../pattern/hooks/usePatterns';
import { exportLibrary, importLibrary } from '../facade/library-facade';
import {
  parseLibraryFileAPI,
  openLibraryFileDialog,
} from '../services/library-service';
import ImportPreviewModal from './ImportPreviewModal';
import LibrarySection from './LibrarySection';
import {
  ConflictResolution,
  ImportResult,
  LibraryManifest,
} from '../../../../shared/models/library-dto';

export default function LibraryScreen() {
  const { instruments } = useInstruments();
  const { patterns } = usePatterns();
  const [selectedPatternIds, setSelectedPatternIds] = useState<Set<number>>(
    new Set(),
  );
  const [selectedInstrumentIds, setSelectedInstrumentIds] = useState<
    Set<number>
  >(new Set());
  const [importModal, setImportModal] = useState<{
    zipPath: string;
    manifest: LibraryManifest;
  } | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (): Promise<void> => {
    setError(null);
    try {
      await exportLibrary(
        Array.from(selectedPatternIds),
        Array.from(selectedInstrumentIds),
      );
    } catch (e: unknown) {
      const message: string = e instanceof Error ? e.message : String(e);
      setError(`Erreur à l'export : ${message}`);
    }
  };

  const handleImportClick = async (): Promise<void> => {
    setError(null);
    try {
      const zipPath: string | null = await openLibraryFileDialog();
      if (!zipPath) return;
      const manifest: LibraryManifest = await parseLibraryFileAPI(zipPath);
      if (!manifest) return;
      setImportModal({ zipPath, manifest });
    } catch (e: unknown) {
      const message: string = e instanceof Error ? e.message : String(e);
      setError(`Erreur à l'import : ${message}`);
    }
  };

  const handleImportConfirm = async (
    resolutions: ConflictResolution[],
  ): Promise<void> => {
    if (!importModal) return;
    setError(null);
    try {
      const result: ImportResult = await importLibrary(
        importModal.zipPath,
        resolutions,
      );
      setImportModal(null);
      setImportResult(result);
      window.location.reload();
    } catch (e: unknown) {
      const message: string = e instanceof Error ? e.message : String(e);
      setError(`Erreur à l'import : ${message}`);
    }
  };

  const handleImportCancel = (): void => {
    setImportModal(null);
  };

  return (
    <div className="content-page">
      <div className="workspace-section-content">
        <h2 className="section-title">Bibliothèque</h2>

        {error && <div className="w-full error-message">{error}</div>}

        {importResult && (
          <div
            className="w-full section-background"
            style={{ marginBottom: '1rem' }}
          >
            <h3 className="section-title">Import terminé</h3>
            <p>
              Patterns importés : {importResult.importedPatterns} | Ignorés :{' '}
              {importResult.skippedPatterns}
            </p>
            <p>
              Instruments importés : {importResult.importedInstruments} |
              Ignorés : {importResult.skippedInstruments}
            </p>
            {importResult.errors.length > 0 && (
              <div className="error-message">
                {importResult.errors.map((err: string) => (
                  <p key={err}>{err}</p>
                ))}
              </div>
            )}
          </div>
        )}

        <LibrarySection
          title="Patterns"
          items={patterns}
          getId={(pattern) => pattern.id}
          onSelectionChange={setSelectedPatternIds}
        >
          {(pattern, isSelected, toggle) => (
            <label
              key={pattern.id}
              className="library-item"
              htmlFor={`pattern-${pattern.id}`}
            >
              <input
                id={`pattern-${pattern.id}`}
                type="checkbox"
                checked={isSelected}
                onChange={toggle}
              />
              <span className="library-item-name">{pattern.name}</span>
              <span className="library-item-slug">{pattern.slug}</span>
            </label>
          )}
        </LibrarySection>

        <LibrarySection
          title="Instruments"
          items={instruments.filter((i) => i.symbol !== '.')}
          getId={(instrument) => instrument.id}
          onSelectionChange={setSelectedInstrumentIds}
        >
          {(instrument, isSelected, toggle) => (
            <label
              key={instrument.id}
              className="library-item"
              htmlFor={`instrument-${instrument.id}`}
            >
              <input
                id={`instrument-${instrument.id}`}
                type="checkbox"
                checked={isSelected}
                onChange={toggle}
              />
              <span className="instrument-symbol">{instrument.symbol}</span>
              <span className="library-item-name">
                {instrument.name ?? '(sans nom)'}
              </span>
            </label>
          )}
        </LibrarySection>

        <div className="library-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={handleExport}
            disabled={
              selectedPatternIds.size === 0 && selectedInstrumentIds.size === 0
            }
          >
            Exporter ({selectedPatternIds.size + selectedInstrumentIds.size})
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleImportClick}
          >
            Importer
          </button>
        </div>
      </div>

      {importModal && (
        <ImportPreviewModal
          manifest={importModal.manifest}
          onConfirm={handleImportConfirm}
          onCancel={handleImportCancel}
          existingPatternSlugs={patterns.map((p) => p.slug)}
          existingInstrumentSlugs={instruments.map((i) => i.slug)}
          existingInstrumentSymbols={instruments.map((i) => i.symbol)}
        />
      )}
    </div>
  );
}

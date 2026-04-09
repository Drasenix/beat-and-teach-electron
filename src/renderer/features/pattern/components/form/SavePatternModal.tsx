import { useState } from 'react';
import { Pattern } from '../../models/pattern-model';
import { extractIpcError } from '../../../../utils/util';
import validatePattern from '../../utils/pattern-validator';
import usePatterns from '../../hooks/usePatterns';
import PatternOverwrite from './PatternOverwrite';
import Modal from '../../../../components/Modal';

type SavePatternModalProps = {
  pattern: Pattern;
  selectedPattern: Pattern | null;
  onClose: () => void;
};

type ConfirmOverwriteState = {
  id: number;
  name: string;
};

export default function SavePatternModal({
  pattern,
  selectedPattern,
  onClose,
}: SavePatternModalProps) {
  const { patterns, addPattern, editPattern } = usePatterns();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] =
    useState<ConfirmOverwriteState | null>(null);

  const resetFields = (): void => {
    setName('');
    setError(null);
    setConfirmOverwrite(null);
  };

  const onSaveExisting = async (): Promise<void> => {
    if (!selectedPattern) return;
    try {
      await editPattern(selectedPattern.id, {
        name: selectedPattern.name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
      onClose();
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de modifier le pattern.'));
    }
  };

  const onSaveNew = async (): Promise<void> => {
    const errors = validatePattern({ name, sentences: pattern.sentences });
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const existing = patterns.find((p) => p.name === name);
    if (existing) {
      setConfirmOverwrite({ id: existing.id, name: existing.name });
      return;
    }

    try {
      await addPattern({
        name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
      resetFields();
      onClose();
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de créer le pattern.'));
    }
  };

  const onConfirmOverwrite = async (): Promise<void> => {
    if (!confirmOverwrite) return;
    try {
      await editPattern(confirmOverwrite.id, {
        name,
        sentences: pattern.sentences,
        highlights: pattern.highlights,
      });
      resetFields();
      onClose();
    } catch (e) {
      setError(extractIpcError(e, 'Impossible de modifier le pattern.'));
      setConfirmOverwrite(null);
    }
  };

  const allSentencesValid =
    pattern.sentences.length > 0 &&
    pattern.sentences.every((s) => s.trim().length > 0);

  if (confirmOverwrite) {
    return (
      <Modal onClose={onClose}>
        <PatternOverwrite
          name={confirmOverwrite.name}
          onConfirm={onConfirmOverwrite}
          onCancel={resetFields}
        />
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="section-title mb-4">Sauvegarder le pattern</h2>
      <div className="flex flex-col gap-3">
        {error && <span className="error-message">{error}</span>}
        {!selectedPattern && (
          <input
            placeholder="Nom du pattern"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full"
          />
        )}
        <button
          type="button"
          onClick={selectedPattern ? onSaveExisting : onSaveNew}
          disabled={!allSentencesValid || (!selectedPattern && !name.trim())}
          className="btn-primary"
        >
          Sauvegarder
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          Annuler
        </button>
      </div>
    </Modal>
  );
}

import { FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { InstrumentFormValues } from '../../types/instrument-types';

type InstrumentFormProps = {
  instrument: InstrumentFormValues;
  errors: string[];
  submitLabel: string;
  onInstrumentChange: (fields: Partial<InstrumentFormValues>) => void;
  onOpenFileDialog: () => Promise<string | null>;
  onDetectPitch: () => Promise<number | null>;
  onSubmit: () => void;
  onCancel: () => void;
  titleLabel: string;
};

export default function InstrumentForm({
  instrument,
  errors,
  submitLabel,
  titleLabel,
  onInstrumentChange,
  onOpenFileDialog,
  onDetectPitch,
  onSubmit,
  onCancel,
}: InstrumentFormProps) {
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  const handleSelectFile = async () => {
    const path = await onOpenFileDialog();
    if (path) onInstrumentChange({ filepath: path });
  };

  const handleDetectPitch = async () => {
    setDetecting(true);
    setDetectError(null);
    try {
      const freq = await onDetectPitch();
      if (freq !== null) {
        onInstrumentChange({ referenceFrequency: Math.round(freq) });
      } else {
        setDetectError(
          "Aucune hauteur détectée. Les sons percussifs (kick, snare, hihat) n'ont pas de fréquence stable. La détection fonctionne mieux sur les sons soutenus (voix, instruments mélodiques).",
        );
      }
    } catch {
      setDetectError('Erreur lors de la détection.');
    }
    setDetecting(false);
  };

  return (
    <div className="form-content">
      <h3 className="section-title">{titleLabel}</h3>
      <input
        placeholder="Symbole (ex: P)"
        value={instrument.symbol}
        onChange={(e) => onInstrumentChange({ symbol: e.target.value })}
        className="input-field w-full"
      />
      <input
        placeholder="Nom (ex: Kickdrum)"
        value={instrument.name ?? ''}
        onChange={(e) => onInstrumentChange({ name: e.target.value })}
        className="input-field w-full"
      />

      <div className="flex items-center gap-3">
        <button type="button" onClick={handleSelectFile} className="btn-add">
          <FolderOpen size={16} />
          {instrument.filepath
            ? 'Remplacer le fichier'
            : 'Sélectionner un fichier'}
        </button>
        {instrument.filepath && (
          <span
            className="text-text-secondary text-xs font-mono break-all"
            title={instrument.filepath}
          >
            {instrument.filepath}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          type="number"
          placeholder="Fréquence de référence (Hz)"
          value={instrument.referenceFrequency ?? ''}
          onChange={(e) =>
            onInstrumentChange({
              referenceFrequency: e.target.value
                ? parseFloat(e.target.value)
                : null,
            })
          }
          className="input-field w-full"
        />
        <button
          type="button"
          onClick={handleDetectPitch}
          disabled={!instrument.filepath || detecting}
          className="btn-add"
        >
          {detecting ? 'Détection...' : 'Détecter'}
        </button>
      </div>
      {detectError && (
        <span className="text-text-secondary text-xs">{detectError}</span>
      )}

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1">
          {errors.map((e) => (
            <li key={e} className="form-error-item">
              {e}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onSubmit} className="btn-add">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </div>
  );
}

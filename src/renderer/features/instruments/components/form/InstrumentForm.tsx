import { InstrumentFormValues } from '../../types/instrument-types';

type InstrumentFormProps = {
  instrument: InstrumentFormValues;
  errors: string[];
  submitLabel: string;
  onInstrumentChange: (fields: Partial<InstrumentFormValues>) => void;
  onOpenFileDialog: () => Promise<string | null>;
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
  onSubmit,
  onCancel,
}: InstrumentFormProps) {
  const handleSelectFile = async () => {
    const path = await onOpenFileDialog();
    if (path) onInstrumentChange({ filepath: path });
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
        <button
          type="button"
          onClick={handleSelectFile}
          className="btn-secondary"
        >
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
        <button type="button" onClick={onSubmit} className="btn-primary">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Annuler
        </button>
      </div>
    </div>
  );
}

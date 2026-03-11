type InstrumentFormProps = {
  symbol: string;
  name: string;
  filepath: string | null;
  errors: string[];
  submitLabel: string;
  onSymbolChange: (v: string) => void;
  onNameChange: (v: string) => void;
  onFilepathChange: (path: string) => void;
  onOpenFileDialog: () => Promise<string | null>;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function InstrumentForm({
  symbol,
  name,
  filepath,
  errors,
  submitLabel,
  onSymbolChange,
  onNameChange,
  onFilepathChange,
  onOpenFileDialog,
  onSubmit,
  onCancel,
}: InstrumentFormProps) {
  const handleSelectFile = async () => {
    const path = await onOpenFileDialog();
    if (path) onFilepathChange(path);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Symbole (ex: P)"
        value={symbol}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="input-field w-full"
      />
      <input
        placeholder="Nom (ex: Kickdrum)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="input-field w-full"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSelectFile}
          className="btn-secondary"
        >
          {filepath ? 'Remplacer le fichier' : 'Sélectionner un fichier'}
        </button>
        {filepath && (
          <span
            className="text-text-secondary text-xs font-mono truncate"
            title={filepath}
          >
            {filepath}
          </span>
        )}
      </div>

      {errors.length > 0 && (
        <ul className="flex flex-col gap-1">
          {errors.map((e) => (
            <li key={e} className="text-red-400 text-xs font-mono">
              {e}
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-3 mt-2">
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

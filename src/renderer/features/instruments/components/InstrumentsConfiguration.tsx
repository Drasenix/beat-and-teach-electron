import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';
import AddInstrumentForm from './AddInstrumentForm';

export default function InstrumentConfiguration() {
  const [addingInstrument, setAddingInstrument] = useState(false);
  const { instruments, addNewInstrument, openFileDialog, error } =
    useInstruments();

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h2 className="section-title mb-6">Instruments</h2>

        {error && <div className="w-full mb-6 error-message">{error}</div>}

        <ul className="flex flex-col gap-2 mb-6">
          {instruments.map((instrument) => (
            <li
              key={instrument.id}
              className="flex items-center gap-4 bg-surface border border-border rounded-lg px-4 py-3"
            >
              <span className="text-primary font-mono font-bold w-8">
                {instrument.symbol}
              </span>
              <span className="text-text-primary font-mono flex-1">
                {instrument.name}
              </span>
              <span className="text-text-secondary text-xs font-mono truncate max-w-xs">
                {instrument.filepath ?? ''}
              </span>
            </li>
          ))}
        </ul>

        {!addingInstrument && (
          <button
            type="button"
            onClick={() => setAddingInstrument(true)}
            className="btn-secondary"
          >
            + Ajouter un instrument
          </button>
        )}

        {addingInstrument && (
          <AddInstrumentForm
            onAdd={addNewInstrument}
            onCancel={() => setAddingInstrument(false)}
            onOpenFileDialog={openFileDialog}
          />
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';
import AddInstrumentForm from './AddInstrumentForm';

export default function InstrumentConfiguration() {
  const [addingInstrument, setAddingInstrument] = useState(false);
  const { instruments, addNewInstrument, openFileDialog } = useInstruments();

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h2 className="text-xs font-mono text-primary uppercase tracking-widest mb-6">
          Instruments
        </h2>

        {/* Liste des instruments */}
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
                {instrument.filepath ?? '—'}
              </span>
            </li>
          ))}
        </ul>

        {/* Bouton ajout */}
        {!addingInstrument && (
          <button
            type="button"
            onClick={() => setAddingInstrument(true)}
            className="px-6 py-3 bg-surface border border-border hover:border-primary
                       text-text-secondary hover:text-primary font-mono text-sm
                       rounded-lg transition-colors duration-200 uppercase tracking-widest"
          >
            + Ajouter un instrument
          </button>
        )}

        {/* Formulaire */}
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

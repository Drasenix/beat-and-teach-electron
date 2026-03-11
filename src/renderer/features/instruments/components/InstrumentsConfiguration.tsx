import { useState } from 'react';
import { Instrument } from '../models/instrument-model';
import useInstruments from '../hooks/useInstruments';
import AddInstrumentForm from './AddInstrumentForm';
import EditInstrumentForm from './EditInstrumentForm';

export default function InstrumentConfiguration() {
  const [addingInstrument, setAddingInstrument] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const {
    instruments,
    addNewInstrument,
    editInstrument,
    removeInstrument,
    openFileDialog,
    error,
  } = useInstruments();

  const handleDelete = async (id: number): Promise<void> => {
    await removeInstrument(id);
    setConfirmDeleteId(null);
  };

  const handleEdit = async (
    id: number,
    data: Omit<Instrument, 'id' | 'slug'>,
  ): Promise<void> => {
    await editInstrument(id, data);
    setEditingId(null);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <div className="w-full max-w-2xl">
        <h2 className="section-title mb-6">Instruments</h2>

        {error && <div className="w-full mb-6 error-message">{error}</div>}

        <ul className="flex flex-col gap-2 mb-6">
          {instruments
            .filter((instrument) => instrument.symbol !== '.')
            .map((instrument) => (
              <li key={instrument.id} className="flex flex-col">
                {/* Ligne instrument */}
                <div className="flex items-center gap-4 bg-surface border border-border rounded-lg px-4 py-3">
                  <span className="text-primary font-mono font-bold w-8">
                    {instrument.symbol}
                  </span>
                  <span className="text-text-primary font-mono flex-1">
                    {instrument.name}
                  </span>
                  <span className="text-text-secondary text-xs font-mono truncate max-w-xs flex-1">
                    {instrument.filepath ?? ''}
                  </span>

                  {/* Actions */}
                  {confirmDeleteId === instrument.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-text-secondary text-xs font-mono">
                        Confirmer ?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(instrument.id)}
                        className="px-3 py-1 bg-red-500 hover:opacity-90 text-background
                                   font-mono text-xs rounded-lg transition-opacity duration-200"
                      >
                        Oui
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn-secondary px-3 py-1 text-xs"
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(
                            editingId === instrument.id ? null : instrument.id,
                          );
                          setAddingInstrument(false);
                        }}
                        className="text-text-secondary hover:text-primary font-mono text-xs
                                   transition-colors duration-200"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(instrument.id)}
                        className="text-text-secondary hover:text-red-400 font-mono text-xs
                                   transition-colors duration-200"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Formulaire d'édition inline */}
                {editingId === instrument.id && (
                  <EditInstrumentForm
                    key={instrument.id}
                    instrument={instrument}
                    onUpdate={(data) => handleEdit(instrument.id, data)}
                    onCancel={() => setEditingId(null)}
                    onOpenFileDialog={openFileDialog}
                  />
                )}
              </li>
            ))}
        </ul>

        {addingInstrument ? (
          <AddInstrumentForm
            onAdd={addNewInstrument}
            onCancel={() => setAddingInstrument(false)}
            onOpenFileDialog={openFileDialog}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setAddingInstrument(true);
              setEditingId(null);
            }}
            className="btn-secondary"
          >
            + Ajouter un instrument
          </button>
        )}
      </div>
    </div>
  );
}

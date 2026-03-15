import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';
import AddInstrumentForm from './form/AddInstrumentForm';
import EditInstrumentForm from './form/EditInstrumentForm';
import { InstrumentFormValues } from '../types/instrument-types';
import useFileDialog from '../../../hooks/useFileDialog';

export default function InstrumentConfiguration() {
  const [addingInstrument, setAddingInstrument] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const {
    instruments,
    addNewInstrument,
    editInstrument,
    removeInstrument,
    error,
  } = useInstruments();

  const { openFileDialog } = useFileDialog();

  const handleDelete = async (id: number): Promise<void> => {
    await removeInstrument(id);
    setConfirmDeleteId(null);
  };

  const handleEdit = async (
    id: number,
    data: InstrumentFormValues,
  ): Promise<void> => {
    await editInstrument(id, data);
    setEditingId(null);
  };

  return (
    <div className="content-page">
      <div className="workspace-section-content">
        <h2 className="section-title">Instruments</h2>

        {error && <div className="w-full error-message">{error}</div>}

        <ul className="config-liste">
          {instruments
            .filter((instrument) => instrument.symbol !== '.')
            .map((instrument) => (
              <li key={instrument.id} className="flex flex-col">
                <div className="item-row">
                  <span className="text-primary font-mono font-bold w-8">
                    {instrument.symbol}
                  </span>
                  <span className="text-text-primary font-mono flex-1">
                    {instrument.name}
                  </span>
                  <span className="text-text-secondary text-xs font-mono break-all max-w-xs flex-1">
                    {instrument.filepath ?? ''}
                  </span>

                  {confirmDeleteId === instrument.id ? (
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary text-xs font-mono">
                        Confirmer ?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(instrument.id)}
                        className="btn-confirm-delete"
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
                        className="btn-edit"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(instrument.id)}
                        className="btn-delete"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

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
            className="btn-secondary self-start"
          >
            + Ajouter un instrument
          </button>
        )}
      </div>
    </div>
  );
}

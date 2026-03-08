import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';
import AddInstrumentForm from './AddInstrumentForm';

export default function InstrumentConfiguration() {
  const [addingInstrument, setAddingInstrument] = useState(false);
  const { instruments, addNewInstrument, openFileDialog } = useInstruments();
  return (
    <div>
      <h2>Config</h2>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            <h3>
              {instrument.symbol} - {instrument.name} - {instrument.slug} -{' '}
              {instrument.filepath}
            </h3>
          </li>
        ))}
      </ul>
      <button onClick={() => setAddingInstrument(true)}>
        Ajouter un instrument
      </button>
      {addingInstrument && (
        <AddInstrumentForm
          onAdd={addNewInstrument}
          onCancel={() => setAddingInstrument(false)}
          onOpenFileDialog={openFileDialog}
        />
      )}
    </div>
  );
}

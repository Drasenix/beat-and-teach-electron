import useInstruments from '../hooks/useInstruments';
import useAudio from '../../audio/hooks/useAudio';
import AddInstrumentForm from './form/AddInstrumentForm';
import EditInstrumentForm from './form/EditInstrumentForm';
import useFileDialog from '../../../hooks/useFileDialog';
import useConfigurationActions from '../../../hooks/useConfigurationActions';
import ConfigurationItem from '../../../components/ConfigurationItem';
import ItemActions from '../../../components/ItemActions';
import ConfigurationFooter from '../../../components/ConfigurationFooter';
import OnboardingDriver from '../../onboarding/components/OnboardingDriver';

export default function InstrumentConfiguration() {
  const {
    instruments,
    addNewInstrument,
    editInstrument,
    removeInstrument,
    error,
  } = useInstruments();
  const { openFileDialog } = useFileDialog();
  const { playInstrument, playing } = useAudio();

  const {
    adding,
    onStartAdding,
    onCancelAdding,
    editingId,
    setEditingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleConfirm,
    handleEdit,
  } = useConfigurationActions(removeInstrument, editInstrument);

  return (
    <OnboardingDriver tourKey="instruments">
      <div className="content-page">
        <div className="workspace-section-content">
          <h2 className="section-title">Instruments</h2>
          {error && <div className="w-full error-message">{error}</div>}

          <ul className="config-liste">
            {instruments
              .filter((i) => i.symbol !== '.')
              .map((instrument) => (
                <ConfigurationItem
                  key={instrument.id}
                  id={instrument.id}
                  editingId={editingId}
                  leftContent={
                    <>
                      <button
                        type="button"
                        className="instrument-play-btn"
                        disabled={playing}
                        onClick={() => {
                          if (instrument.filepath && instrument.name) {
                            playInstrument(
                              instrument.filepath,
                              instrument.name,
                            );
                          }
                        }}
                      >
                        ▶
                      </button>
                      <span className="instrument-symbol">
                        {instrument.symbol}
                      </span>
                      <span className="instrument-name">{instrument.name}</span>
                    </>
                  }
                  rightContent={
                    <>
                      <span className="instrument-filepath">
                        {instrument.filepath ?? ''}
                      </span>
                      <span className="actions">
                        <ItemActions
                          onEdit={() => {
                            setEditingId(instrument.id);
                            onCancelAdding();
                          }}
                          onDelete={() => setConfirmDeleteId(instrument.id)}
                          onCancelDelete={() => setConfirmDeleteId(null)}
                          onConfirm={() => handleConfirm(instrument.id)}
                          isConfirming={confirmDeleteId === instrument.id}
                        />
                      </span>
                    </>
                  }
                  editForm={
                    <EditInstrumentForm
                      instrument={instrument}
                      onUpdate={(data) => handleEdit(instrument.id, data)}
                      onCancel={() => setEditingId(null)}
                      onOpenFileDialog={openFileDialog}
                    />
                  }
                />
              ))}
          </ul>

          <ConfigurationFooter
            adding={adding}
            onStartAdding={onStartAdding}
            buttonText="+ Ajouter un instrument"
            addForm={
              <AddInstrumentForm
                onAdd={addNewInstrument}
                onCancel={onCancelAdding}
                onOpenFileDialog={openFileDialog}
              />
            }
          />
        </div>
      </div>
    </OnboardingDriver>
  );
}

import usePatterns from '../hooks/usePatterns';
import AddPatternForm from './form/AddPatternForm';
import EditPatternForm from './form/EditPatternForm';
import useConfigurationActions from '../../../hooks/useConfigurationActions';
import ConfigurationItem from '../../../components/ConfigurationItem';
import ItemActions from '../../../components/ItemActions';
import ConfigurationFooter from '../../../components/ConfigurationFooter';

export default function PatternsConfiguration() {
  const { patterns, addPattern, editPattern, removePattern, error } =
    usePatterns();

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
  } = useConfigurationActions(removePattern, editPattern);

  return (
    <div className="content-page">
      <div className="workspace-section-content">
        <h2 className="section-title">Patterns</h2>
        {error && <div className="w-full error-message">{error}</div>}

        <ul className="config-liste">
          {patterns.map((pattern) => (
            <ConfigurationItem
              key={pattern.id}
              id={pattern.id}
              editingId={editingId}
              leftContent={
                <span className="text-text-primary font-mono flex-1">
                  {pattern.name}
                </span>
              }
              rightContent={
                <>
                  <div className="flex flex-col gap-1 flex-1">
                    {pattern.sentences.map((sentence) => (
                      <span
                        key={sentence}
                        className="text-text-secondary text-xs font-mono flex-1"
                      >
                        {sentence}
                      </span>
                    ))}
                  </div>
                  <ItemActions
                    onEdit={() => {
                      setEditingId(pattern.id);
                      onCancelAdding();
                    }}
                    onDelete={() => setConfirmDeleteId(pattern.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onConfirm={() => handleConfirm(pattern.id)}
                    isConfirming={confirmDeleteId === pattern.id}
                  />
                </>
              }
              editForm={
                <EditPatternForm
                  pattern={pattern}
                  onUpdate={(data) => handleEdit(pattern.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              }
            />
          ))}
        </ul>

        <ConfigurationFooter
          adding={adding}
          onStartAdding={onStartAdding}
          buttonText="+ Ajouter un pattern"
          addForm={
            <AddPatternForm onAdd={addPattern} onCancel={onCancelAdding} />
          }
        />
      </div>
    </div>
  );
}

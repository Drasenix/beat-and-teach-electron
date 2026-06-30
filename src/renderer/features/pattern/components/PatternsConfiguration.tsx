import usePatterns from '../hooks/usePatterns';
import RenamePatternForm from './form/RenamePatternForm';
import useConfigurationActions from '../../../hooks/useConfigurationActions';
import ConfigurationItem from '../../../components/ConfigurationItem';
import ItemActions from '../../../components/ItemActions';

export default function PatternsConfiguration() {
  const { patterns, editPattern, removePattern, error } = usePatterns();

  const {
    editingId,
    setEditingId,
    confirmDeleteId,
    setConfirmDeleteId,
    handleConfirm,
  } = useConfigurationActions(removePattern, editPattern);

  const handleRename = async (name: string): Promise<void> => {
    const patternId = editingId;
    if (patternId === null) return;
    await editPattern(patternId, { name });
    setEditingId(null);
  };

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
              leftContent={<span className="pattern-name">{pattern.name}</span>}
              rightContent={
                <span className="actions ml-auto">
                  <ItemActions
                    onEdit={() => {
                      setEditingId(pattern.id);
                    }}
                    onDelete={() => setConfirmDeleteId(pattern.id)}
                    onCancelDelete={() => setConfirmDeleteId(null)}
                    onConfirm={() => handleConfirm(pattern.id)}
                    isConfirming={confirmDeleteId === pattern.id}
                  />
                </span>
              }
              editForm={
                <RenamePatternForm
                  name={pattern.name}
                  onRename={handleRename}
                  onCancel={() => setEditingId(null)}
                />
              }
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

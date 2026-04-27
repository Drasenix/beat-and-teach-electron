import { useNavigate } from 'react-router-dom';
import usePatterns from '../hooks/usePatterns';
import AddPatternForm from './form/AddPatternForm';
import EditPatternForm from './form/EditPatternForm';
import useConfigurationActions from '../../../hooks/useConfigurationActions';
import ConfigurationItem from '../../../components/ConfigurationItem';
import ItemActions from '../../../components/ItemActions';
import ConfigurationFooter from '../../../components/ConfigurationFooter';
import OnboardingDriver from '../../onboarding/components/OnboardingDriver';

export default function PatternsConfiguration() {
  const navigate = useNavigate();
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
    <OnboardingDriver tourKey="patterns" navigate={navigate}>
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
                  <span className="pattern-name">{pattern.name}</span>
                }
                rightContent={
                  <>
                    <div className="pattern-tracks">
                      {pattern.sentences.map((sentence) => (
                        <span key={sentence} className="pattern-track">
                          {sentence}
                        </span>
                      ))}
                    </div>
                    <span className="actions">
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
                    </span>
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
    </OnboardingDriver>
  );
}

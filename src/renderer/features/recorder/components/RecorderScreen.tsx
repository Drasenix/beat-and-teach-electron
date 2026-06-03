import { useState, useCallback, useRef } from 'react';
import useRecorder from '../hooks/useRecorder';
import saveRecordedAudio from '../services/recorder-service';
import WaveformEditor from './WaveformEditor';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function RecorderScreen() {
  const {
    state,
    audioUrl,
    duration,
    wavBuffer,
    rawSamples,
    startRecording,
    stopRecording,
    applyTrim,
    cleanup,
  } = useRecorder();

  const [saving, setSaving] = useState(false);
  const [savedPath, setSavedPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const audioKeyRef = useRef(0);

  const handleSave = useCallback(async () => {
    if (wavBuffer === null) return;

    setSaving(true);
    setError(null);

    try {
      const filepath = await saveRecordedAudio(wavBuffer);
      setSavedPath(filepath);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.';
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [wavBuffer]);

  const handleNew = useCallback(() => {
    setSavedPath(null);
    setError(null);
    setShowEditor(true);
    cleanup();
  }, [cleanup]);

  const handleTrim = useCallback(
    (trimmed: Float32Array) => {
      applyTrim(trimmed);
      audioKeyRef.current += 1;
    },
    [applyTrim],
  );

  return (
    <div className="content-page">
      <div className="workspace-section-content">
        <h2 className="section-title">Enregistreur</h2>

        {error !== null && <div className="w-full error-message">{error}</div>}

        {state === 'idle' && (
          <div className="form-card flex flex-col items-center gap-6">
            <p className="text-text-secondary text-sm font-mono text-center">
              Enregistrez un son depuis votre microphone
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={startRecording}
            >
              ⏺ Enregistrer
            </button>
          </div>
        )}

        {state === 'recording' && (
          <div className="form-card flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
              <span className="text-text-primary font-mono text-2xl font-bold">
                {formatTime(duration)}
              </span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={stopRecording}
            >
              ⏹ Arrêter
            </button>
          </div>
        )}

        {state === 'recorded' && savedPath === null && (
          <div className="form-card">
            <div className="form-content">
              <div className="flex items-center gap-4">
                <span className="text-text-secondary text-xs font-mono">
                  Durée : {formatTime(duration)}
                </span>
                {audioUrl !== null && (
                  <audio
                    key={audioKeyRef.current}
                    src={audioUrl}
                    controls
                    className="h-8"
                  >
                    <track kind="captions" src="" />
                  </audio>
                )}
              </div>

              {rawSamples.length > 0 && showEditor && (
                <WaveformEditor
                  samples={rawSamples}
                  duration={duration}
                  onTrim={handleTrim}
                />
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleNew}
                >
                  🗑 Effacer
                </button>
              </div>
            </div>
          </div>
        )}

        {savedPath !== null && (
          <div className="form-card">
            <div className="form-content">
              <div className="flex flex-col gap-2">
                <p className="text-text-secondary text-xs font-mono">
                  Fichier sauvegardé :
                </p>
                <p className="text-text-accent text-xs font-mono break-all">
                  {savedPath}
                </p>
              </div>
              <p className="text-text-secondary text-sm font-mono mt-2">
                Allez dans{' '}
                <span className="text-primary">
                  Configuration &gt; Instruments
                </span>{' '}
                et utilisez le formulaire pour créer un instrument à partir de
                ce fichier.
              </p>
              <button
                type="button"
                className="btn-secondary mt-2"
                onClick={handleNew}
              >
                ⏺ Nouvel enregistrement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

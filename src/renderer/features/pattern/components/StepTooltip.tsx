import MuteIcon from './MuteIcon';
import frequencyToNoteName from '../../../utils/frequency-to-note';

const HIGHLIGHT_COLORS = [
  { label: 'Rouge', value: 'red', color: '#f87171' },
  { label: 'Bleu', value: 'blue', color: '#60a5fa' },
  { label: 'Vert', value: 'green', color: '#4ade80' },
  { label: 'Jaune', value: 'yellow', color: '#facc15' },
  { label: 'Orange', value: 'orange', color: '#fb923c' },
];

const NOTE_RANGE = 8;

function generateNoteStrip(
  currentFrequency: number,
): { name: string; frequency: number }[] {
  const midiNote = 12 * Math.log2(currentFrequency / 440) + 69;
  const notes: { name: string; frequency: number }[] = [];
  for (let i = -NOTE_RANGE; i <= NOTE_RANGE; i += 1) {
    const midi = Math.round(midiNote) + i;
    const freq = 440 * 2 ** ((midi - 69) / 12);
    notes.push({ name: frequencyToNoteName(freq), frequency: freq });
  }
  return notes;
}

type StepTooltipProps = {
  currentFrequency: number | null;
  referenceFrequency: number | null;
  onSelectNote?: (frequency: number) => void;
  onSelectColor: (color: string | null) => void;
  onToggleMute?: () => void;
  onResetFrequency?: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function StepTooltip({
  currentFrequency,
  referenceFrequency,
  onSelectNote,
  onSelectColor,
  onToggleMute,
  onResetFrequency,
  onMouseEnter,
  onMouseLeave,
}: StepTooltipProps) {
  const baseFreq = currentFrequency ?? referenceFrequency;
  const showNoteStrip = onSelectNote && baseFreq !== null;
  const notes = showNoteStrip ? generateNoteStrip(baseFreq as number) : [];
  const currentNoteName =
    baseFreq !== null ? frequencyToNoteName(baseFreq) : null;

  return (
    <div
      className="bg-surface border border-border rounded-lg p-3 shadow-xl flex flex-col gap-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showNoteStrip && (
        <div
          className="flex items-center gap-1 overflow-x-auto max-w-[360px]"
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          {notes.map((note) => (
            <button
              key={note.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectNote?.(note.frequency);
              }}
              className={`text-xs px-1.5 py-0.5 rounded whitespace-nowrap transition-colors ${
                note.name === currentNoteName
                  ? 'bg-primary text-background'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {note.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {HIGHLIGHT_COLORS.map(({ label, value, color }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(value);
              }}
              className="w-4 h-4 rounded-full hover:scale-125 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {onToggleMute && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Mute"
            >
              <MuteIcon />
            </button>
          )}
          {onResetFrequency && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResetFrequency();
              }}
              className="text-text-secondary hover:text-primary transition-colors text-sm px-1"
              aria-label="Reset pitch"
            >
              ⟳
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

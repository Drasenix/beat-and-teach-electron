const HIGHLIGHT_COLORS = [
  { label: 'Rouge', value: 'red' },
  { label: 'Bleu', value: 'blue' },
  { label: 'Vert', value: 'green' },
  { label: 'Jaune', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
];

type ColorTooltipProps = {
  onSelect: (color: string | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function ColorTooltip({
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: ColorTooltipProps) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-surface border border-border rounded-lg px-2 py-1 shadow-xl flex items-center gap-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {HIGHLIGHT_COLORS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(value);
          }}
          className="w-3 h-3 rounded-full hover:scale-125 transition-transform"
          style={{ backgroundColor: value }}
        />
      ))}
    </div>
  );
}

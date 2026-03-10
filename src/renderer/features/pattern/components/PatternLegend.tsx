import { Instrument } from '../../instruments/models/instrument-model';

type PatternLegendProps = {
  instruments: Instrument[];
};

export default function PatternLegend({ instruments }: PatternLegendProps) {
  return (
    <div className="w-full max-w-2xl mt-8 p-4 bg-surface rounded-lg border border-border">
      <p className="section-title mb-2">Symboles disponibles</p>
      <div className="flex flex-wrap gap-3">
        {instruments.map((instrument) => (
          <div
            key={instrument.id}
            className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border"
          >
            <span className="text-primary font-mono font-bold">
              {instrument.symbol}
            </span>
            <span className="text-text-secondary text-xs">
              {instrument.slug ?? 'error: no slug defined'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

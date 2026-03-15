import useInstruments from '../hooks/useInstruments';

export default function InstrumentsLegend() {
  const { instruments } = useInstruments();
  return (
    <>
      <h2 className="section-title">Instruments disponibles</h2>
      <div className="section-background">
        <div className="flex flex-wrap gap-3">
          {instruments.map((instrument) => (
            <div key={instrument.id} className="instrument-card">
              <span className="instrument-symbol">{instrument.symbol}</span>
              <span className="instrument-name">
                {instrument.slug ?? 'error: no slug defined'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

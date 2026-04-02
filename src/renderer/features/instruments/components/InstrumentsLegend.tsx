import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';

export default function InstrumentsLegend() {
  const { instruments } = useInstruments();
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="sidebar-header"
      >
        <span className="sidebar-title">Instruments</span>
        <span className={`section-toggle-arrow ${open ? 'open' : ''}`}>▲</span>
      </button>
      <div className={`section-collapsible ${open ? 'open' : ''}`}>
        <div className="sidebar-list">
          {[...instruments]
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .map((instrument) => (
              <div key={instrument.id} className="sidebar-item">
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

import { useState } from 'react';
import useInstruments from '../hooks/useInstruments';
import useAudio from '../../audio/hooks/useAudio';

export default function InstrumentsLegend() {
  const { instruments } = useInstruments();
  const { playInstrument, playing } = useAudio();
  const [open, setOpen] = useState(false);

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
          {instruments.map((instrument) => (
            <div key={instrument.id} className="sidebar-item">
              <span className="instrument-symbol">{instrument.symbol}</span>
              <span className="instrument-name">
                {instrument.slug ?? 'error: no slug defined'}
              </span>
              <button
                type="button"
                className="instrument-play-btn"
                disabled={playing}
                onClick={() => {
                  if (instrument.filepath && instrument.name) {
                    playInstrument(instrument.filepath, instrument.name);
                  }
                }}
              >
                ▶
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

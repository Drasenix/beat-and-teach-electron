import useInstruments from '../hooks/useInstruments';

export default function InstrumentConfiguration() {
  const { instruments } = useInstruments();
  return (
    <div>
      <h2>Config</h2>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            {instrument.symbol} - {instrument.id} - {instrument.filename}
          </li>
        ))}
      </ul>
    </div>
  );
}

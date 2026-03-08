import useInstruments from '../hooks/useInstruments';

export default function InstrumentConfiguration() {
  const { instruments } = useInstruments();
  return (
    <div>
      <h2>Config</h2>
      <ul>
        {instruments.map((instrument) => (
          <li key={instrument.id}>
            <h3>
              {instrument.symbol} - {instrument.name} - {instrument.slug} -{' '}
              {instrument.filepath}
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

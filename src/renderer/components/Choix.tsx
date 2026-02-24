import { useState } from 'react';

export default function Choix() {
  const [pattern, setPattern] = useState<string>('inital');

  const changePatternSentence = (event: any) => {
    setPattern(event.target.value);
  };

  return (
    <>
      <div>Choix</div>
      <div>{pattern}</div>
      <textarea value={pattern} onChange={changePatternSentence} />
    </>
  );
}

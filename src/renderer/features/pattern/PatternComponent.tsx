import Pattern from './pattern-model';

interface PatternComponentProps {
  pattern: Pattern;
  selectPattern: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, selectPattern } = props;
  return (
    <div>
      <textarea value={pattern.sentence} onChange={selectPattern} />
      <button type="button">Ecouter</button>
    </div>
  );
}

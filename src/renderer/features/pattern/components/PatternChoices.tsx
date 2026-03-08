import { Pattern } from '../models/pattern-model';

type PatternChoicesProps = {
  patterns: Pattern[];
  selectPattern: (id: number) => void;
}
export default function PatternChoices(props: PatternChoicesProps) {
  const { patterns, selectPattern } = props;
  return (
    <div>
      <h2>Tes Exemples</h2>
      <div>
        <ul>
          {patterns.map((pat) => {
            return (
              <li key={pat.id}>
                <button type="button" onClick={() => selectPattern(pat.id)}>
                  {pat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

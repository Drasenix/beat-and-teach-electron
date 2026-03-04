import { Link } from 'react-router-dom';

export default function Home() {
  const intituleChoix: string = "Je pars d'un exemple";
  return (
    <div>
      <ul>
        <h1>
          <Link to="/choix">{intituleChoix}</Link>
        </h1>
      </ul>
    </div>
  );
}

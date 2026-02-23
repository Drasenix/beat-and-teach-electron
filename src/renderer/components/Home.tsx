import { Link } from 'react-router-dom';

export default function Home() {
  const intituleChoix1: string = "J'écris mon pattern";
  const intituleChoix2: string = "Je pars d'un exemple";
  return (
    <div>
      <ul>
        <h1>
          <Link to="/choix">{intituleChoix2}</Link>
        </h1>
        <h1>
          <Link to="/pattern">{intituleChoix1}</Link>
        </h1>
      </ul>
    </div>
  );
}

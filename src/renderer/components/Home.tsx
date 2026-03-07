import { Link } from 'react-router-dom';

export default function Home() {
  const intituleChoix: string = 'Je construis mon pattern';
  const intituleConfig: string = 'Je gère les instruments';
  return (
    <div>
      <ul>
        <h1>
          <Link to="/construction">{intituleChoix}</Link>
        </h1>
        <h1>
          <Link to="/configuration">{intituleConfig}</Link>
        </h1>
      </ul>
    </div>
  );
}

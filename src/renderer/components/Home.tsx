import { Link } from 'react-router-dom';

export default function Home() {
  const intituleChoix: string = 'Je construis mon pattern';
  return (
    <div>
      <ul>
        <h1>
          <Link to="/construction">{intituleChoix}</Link>
        </h1>
      </ul>
    </div>
  );
}

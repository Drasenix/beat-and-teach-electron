import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <div className="flex flex-col text-center gap-1">
        <h1 className="app-title">Beat & Teach</h1>
        <p className="text-text-secondary text-sm font-mono">
          écris ton pattern · écoute · apprends
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="btn-animated-wrapper">
          <Link to="/workspace" className="btn-animated-inner group">
            <p className="home-button-icon">🎙</p>
            <p className="text-primary">Je construis mon pattern</p>
          </Link>
        </div>
        <div className="btn-animated-wrapper">
          <Link
            to="/configuration/instruments"
            className="btn-animated-inner group"
          >
            <p className="home-button-icon">🎝</p>
            <p className="text-primary">Je gère les instruments</p>
          </Link>
        </div>
        <div className="btn-animated-wrapper">
          <Link
            to="/configuration/patterns"
            className="btn-animated-inner group"
          >
            <p className="home-button-icon">🕮</p>
            <p className="text-primary">Je gère les patterns</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

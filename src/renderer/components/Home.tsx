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
        <div className="div-animated-wrapper">
          <Link to="/guide" className="link-animated-inner group">
            <p className="home-button-icon">🗝</p>
            <p className="text-primary">guide</p>
          </Link>
        </div>
        <div className="div-animated-wrapper">
          <Link to="/workspace" className="link-animated-inner group">
            <p className="home-button-icon">🎘</p>
            <p className="text-primary">studio</p>
          </Link>
        </div>
        <div className="div-animated-wrapper">
          <Link
            to="/configuration/instruments"
            className="link-animated-inner group"
          >
            <p className="home-button-icon">🎙</p>
            <p className="text-primary">instruments</p>
          </Link>
        </div>
        <div className="div-animated-wrapper">
          <Link
            to="/configuration/patterns"
            className="link-animated-inner group"
          >
            <p className="home-button-icon">🕮</p>
            <p className="text-primary">patterns</p>
          </Link>
        </div>
        <div className="div-animated-wrapper">
          <Link to="/library" className="link-animated-inner group">
            <p className="home-button-icon">🗁</p>
            <p className="text-primary">bibliothèque</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

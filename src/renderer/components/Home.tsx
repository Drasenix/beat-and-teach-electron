import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-6">
      <div className="flex flex-col text-center gap-1">
        <h1 className="text-3xl font-bold tracking-widest text-primary uppercase">
          Beat & Teach
        </h1>
        <p className="text-text-secondary text-sm font-mono">
          écris ton pattern · écoute · apprends
        </p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link to="/workspace" className="btn-secondary text-center">
          <p className="text-primary text-4xl">▶</p> Je construis mon pattern
        </Link>
        <Link
          to="/configuration/instruments"
          className="btn-secondary text-center"
        >
          <p className="text-primary text-4xl">⚙</p> Je gère les instruments
        </Link>
        <Link
          to="/configuration/patterns"
          className="btn-secondary text-center"
        >
          <p className="text-primary text-4xl">☰</p> Je gère les patterns
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-widest text-primary uppercase">
          Beat & Teach
        </h1>
        <p className="text-text-secondary text-sm mt-1 font-mono">
          écris ton pattern · écoute · apprends
        </p>
      </div>
      {/* Navigation */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          to="/construction"
          className="px-6 py-4 bg-surface border border-border hover:border-primary
                     text-text-secondary hover:text-primary font-mono text-sm
                     rounded-lg transition-colors duration-200 uppercase tracking-widest text-center"
        >
          ▶ Je construis mon pattern
        </Link>
        <Link
          to="/configuration"
          className="px-6 py-4 bg-surface border border-border hover:border-primary
                     text-text-secondary hover:text-primary font-mono text-sm
                     rounded-lg transition-colors duration-200 uppercase tracking-widest text-center"
        >
          ⚙ Je gère les instruments
        </Link>
      </div>
    </div>
  );
}

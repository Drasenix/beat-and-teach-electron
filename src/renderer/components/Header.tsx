import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-surface border-b border-border px-8 py-4">
      <Link
        to="/"
        className="text-xs font-mono text-text-secondary hover:text-primary
                   uppercase tracking-widest transition-colors duration-200"
      >
        ← Home
      </Link>
    </header>
  );
}

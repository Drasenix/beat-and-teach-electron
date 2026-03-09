import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="w-full bg-surface border-b border-border px-8 py-4">
      <Link
        to="/"
        className="section-title hover:opacity-70 transition-opacity duration-200"
      >
        ← Home
      </Link>
    </header>
  );
}

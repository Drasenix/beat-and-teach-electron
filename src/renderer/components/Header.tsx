import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { to: '/workspace', label: '▶', title: 'Pattern' },
    { to: '/configuration/instruments', label: '⚙', title: 'Instruments' },
    { to: '/configuration/patterns', label: '☰', title: 'Patterns' },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-16 bg-surface border-r border-border
                      flex flex-col items-center py-6 gap-6 z-10"
    >
      <Link
        to="/"
        className="w-8 h-8 flex items-center justify-center text-primary font-bold
                   font-mono text-lg hover:opacity-70 transition-opacity duration-200"
        title="Home"
      >
        B
      </Link>

      <div className="w-6 border-t border-border" />

      {navItems.map(({ to, label, title }) => (
        <Link
          key={to}
          to={to}
          title={title}
          className={`nav-item ${location.pathname === to ? 'nav-item-active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}

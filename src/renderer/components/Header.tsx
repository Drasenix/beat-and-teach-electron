import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { to: '/workspace', label: '🎙', title: 'Pattern' },
    { to: '/configuration/instruments', label: '🎝', title: 'Instruments' },
    { to: '/configuration/patterns', label: '🕮', title: 'Patterns' },
  ];

  return (
    <aside className="bar-aside">
      <Link to="/" className="nav-main-button" title="Home">
        B
      </Link>

      <div className="w-6 border-t border-primary" />

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

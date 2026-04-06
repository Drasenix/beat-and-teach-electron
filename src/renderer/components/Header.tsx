import { Link, useLocation } from 'react-router-dom';
import useAudio from '../features/audio/hooks/useAudio';

export default function Header() {
  const location = useLocation();
  const { playing, stopTrack } = useAudio();

  const navItems = [
    { to: '/workspace', label: '🎘', title: 'Studio' },
    { to: '/configuration/instruments', label: '🎙', title: 'Instruments' },
    { to: '/configuration/patterns', label: '🕮', title: 'Patterns' },
    { to: '/library', label: '🗁', title: 'Bibliothèque' },
  ];

  return (
    <aside className="bar-aside">
      <Link
        to="/"
        className="nav-main-button"
        title="Home"
        onClick={() => {
          if (playing) stopTrack();
        }}
      >
        B
      </Link>

      <div className="w-6 border-t border-primary" />

      {navItems.map(({ to, label, title }) => (
        <Link
          key={to}
          to={to}
          title={title}
          onClick={() => {
            if (playing) stopTrack();
          }}
          className={`nav-item ${location.pathname === to ? 'nav-item-active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </aside>
  );
}

import { Link, useLocation } from 'react-router-dom';
import {
  AudioLines,
  Compass,
  FileHeadphone,
  FileSliders,
  ListMusic,
  Mic,
} from 'lucide-react';
import useAudio from '../features/audio/hooks/useAudio';

const NAV_ICONS = {
  '/workspace': AudioLines,
  '/configuration/instruments': FileHeadphone,
  '/configuration/patterns': ListMusic,
  '/library': FileSliders,
  '/recorder': Mic,
  '/guide': Compass,
} as const;

type Route = keyof typeof NAV_ICONS;

const NAV_TITLES: Record<Route, string> = {
  '/workspace': 'Studio',
  '/configuration/instruments': 'Instruments',
  '/configuration/patterns': 'Patterns',
  '/library': 'Bibliothèque',
  '/recorder': 'Enregistreur',
  '/guide': 'Guide',
};

const NAV_ROUTES = Object.keys(NAV_ICONS) as Route[];

export default function Header() {
  const location = useLocation();
  const { playing, stopTrack } = useAudio();

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

      {NAV_ROUTES.map((to) => {
        const Icon = NAV_ICONS[to];

        return (
          <Link
            key={to}
            to={to}
            title={NAV_TITLES[to]}
            onClick={() => {
              if (playing) stopTrack();
            }}
            className={`nav-item ${location.pathname === to ? 'nav-item-active' : ''}`}
          >
            <Icon size={24} />
          </Link>
        );
      })}
    </aside>
  );
}

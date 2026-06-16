import { Link } from 'react-router-dom';
import {
  AudioLines,
  Compass,
  FileHeadphone,
  FileSliders,
  ListMusic,
  Mic,
} from 'lucide-react';

const HOME_ENTRIES = [
  { to: '/guide', icon: Compass, label: 'guide' },
  { to: '/workspace', icon: AudioLines, label: 'studio' },
  {
    to: '/configuration/instruments',
    icon: FileHeadphone,
    label: 'instruments',
  },
  { to: '/recorder', icon: Mic, label: 'enregistreur' },
  { to: '/configuration/patterns', icon: ListMusic, label: 'patterns' },
  { to: '/library', icon: FileSliders, label: 'bibliothèque' },
] as const;

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
        {HOME_ENTRIES.map(({ to, icon: Icon, label }) => (
          <div className="div-animated-wrapper" key={to}>
            <Link to={to} className="link-animated-inner group">
              <p className="text-primary flex justify-center w-full">
                <Icon size={36} />
              </p>
              <p className="text-primary">{label}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

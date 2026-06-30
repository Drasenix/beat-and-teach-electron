import { Link } from 'react-router-dom';
import {
  AudioLines,
  Compass,
  FileHeadphone,
  FileSliders,
  ListMusic,
  Mic,
} from 'lucide-react';
import HomeLogoSvg from './HomeLogoSvg';

const HOME_ENTRIES = [
  { to: '/workspace', icon: AudioLines, label: 'studio' },
  {
    to: '/configuration/instruments',
    icon: FileHeadphone,
    label: 'instruments',
  },
  { to: '/configuration/patterns', icon: ListMusic, label: 'patterns' },
  { to: '/library', icon: FileSliders, label: 'bibliothèque' },
  { to: '/recorder', icon: Mic, label: 'enregistreur' },
  { to: '/guide', icon: Compass, label: 'guide' },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeLogoSvg />

      <main className=" flex items-center justify-center px-8 pb-8">
        <div className="grid gap-4 w-full max-w-2xl">
          {HOME_ENTRIES.map(({ to, icon: Icon, label }) => (
            <div className="div-animated-wrapper" key={to}>
              <Link to={to} className="link-animated-inner group">
                <p className="text-primary flex justify-center w-full">
                  <Icon size={25} />
                </p>
                <p className="text-primary">{label}</p>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

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

const WAVEFORM_LINES = [
  { x: 212, y1: 123, y2: 127, sw: 3 },
  { x: 234, y1: 123, y2: 127, sw: 3 },
  { x: 256, y1: 122, y2: 128, sw: 3 },
  { x: 278, y1: 123, y2: 127, sw: 3 },
  { x: 300, y1: 121, y2: 129, sw: 3 },
  { x: 322, y1: 122, y2: 128, sw: 3 },
  { x: 344, y1: 120, y2: 130, sw: 3 },
  { x: 366, y1: 121, y2: 129, sw: 3 },
  { x: 388, y1: 119, y2: 131, sw: 3 },
  { x: 410, y1: 120, y2: 130, sw: 3 },
  { x: 432, y1: 117, y2: 133, sw: 3 },
  { x: 454, y1: 119, y2: 131, sw: 3 },
  { x: 476, y1: 115, y2: 135, sw: 3 },
  { x: 498, y1: 118, y2: 132, sw: 3 },
  { x: 520, y1: 113, y2: 137, sw: 3 },
  { x: 542, y1: 116, y2: 134, sw: 3 },
  { x: 564, y1: 109, y2: 141, sw: 3 },
  { x: 586, y1: 113, y2: 137, sw: 3 },
  { x: 608, y1: 104, y2: 146, sw: 3.5 },
  { x: 630, y1: 109, y2: 141, sw: 3.5 },
  { x: 652, y1: 96, y2: 154, sw: 3.5 },
  { x: 674, y1: 102, y2: 148, sw: 3.5 },
  { x: 696, y1: 86, y2: 164, sw: 3.5 },
  { x: 720, y1: 98, y2: 152, sw: 3.5 },
  { x: 745, y1: 68, y2: 182, sw: 4 },
  { x: 772, y1: 48, y2: 202, sw: 4 },
  { x: 799, y1: 78, y2: 172, sw: 4 },
  { x: 826, y1: 33, y2: 217, sw: 4 },
  { x: 853, y1: 58, y2: 192, sw: 4 },
  { x: 880, y1: 25, y2: 225, sw: 4.5 },
  { x: 907, y1: 63, y2: 187, sw: 4.5 },
  { x: 934, y1: 40, y2: 210, sw: 4.5 },
  { x: 961, y1: 70, y2: 180, sw: 4.5 },
  { x: 988, y1: 95, y2: 155, sw: 4 },
] as const;

const DURS = [0.6, 0.75, 0.9, 0.65, 0.85, 1.0, 0.7, 0.95];
const BEGINS = [0, -0.15, -0.3, -0.45, -0.1, -0.25, -0.4, -0.05];

function animateOffset(h: number): number {
  if (h < 15) return 1;
  if (h < 30) return Math.round(h * 0.17);
  if (h < 80) return Math.round(h * 0.12);
  if (h < 150) return Math.round(h * 0.18);
  return 12;
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-center px-8 pt-8 pb-6">
        <svg
          viewBox="0 0 1012 256"
          className="max-w-[1012px] w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="gW" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-b" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
          </defs>

          <rect width="1012" height="256" fill="#030712" />

          <g filter="url(#gW)" stroke="#679ff9" strokeLinecap="round">
            {WAVEFORM_LINES.map(({ x, y1, y2, sw }, i) => {
              const h = y2 - y1;
              const offset = animateOffset(h);
              const dur = DURS[i % DURS.length];
              const begin = BEGINS[i % BEGINS.length];

              return (
                <line
                  key={`l-${x}`}
                  x1={x}
                  x2={x}
                  strokeWidth={sw}
                  y1={y1}
                  y2={y2}
                >
                  <animate
                    attributeName="y1"
                    values={`${y1};${y1 - offset};${y1}`}
                    dur={dur}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y2"
                    values={`${y2};${y2 + offset};${y2}`}
                    dur={dur}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                  />
                </line>
              );
            })}
          </g>

          <rect
            x="60"
            y="58"
            width="120"
            height="120"
            rx="20"
            fill="#1d273c"
            stroke="#679ff9"
            strokeWidth="1.5"
          />
          <text
            x="92"
            y="148"
            fontSize="80"
            fontWeight="bold"
            fill="#679ff9"
            fontFamily="Arial, sans-serif"
            filter="url(#glow-b)"
            opacity="0.6"
          >
            B
          </text>
          <text
            x="92"
            y="148"
            fontSize="80"
            fontWeight="bold"
            fill="#679ff9"
            fontFamily="Arial, sans-serif"
          >
            B
          </text>

          <text
            x="210"
            y="105"
            fontSize="52"
            fontWeight="300"
            fill="#f3f4f6"
            fontFamily="Arial, sans-serif"
            letterSpacing="3"
          >
            EAT &amp; TEACH
          </text>

          <text
            x="210"
            y="155"
            fontSize="14"
            fill="#6b7280"
            fontFamily="Arial, sans-serif"
            letterSpacing="1.5"
          >
            écris ton pattern
          </text>

          <text
            x="210"
            y="178"
            fontSize="14"
            fill="#6b7280"
            fontFamily="Arial, sans-serif"
            letterSpacing="1.5"
          >
            écoute · apprends
          </text>
        </svg>
      </header>

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

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
          <line x1="212" y1="123" x2="212" y2="127" strokeWidth="3" />
          <line x1="234" y1="123" x2="234" y2="127" strokeWidth="3" />
          <line x1="256" y1="122" x2="256" y2="128" strokeWidth="3" />
          <line x1="278" y1="123" x2="278" y2="127" strokeWidth="3" />
          <line x1="300" y1="121" x2="300" y2="129" strokeWidth="3" />
          <line x1="322" y1="122" x2="322" y2="128" strokeWidth="3" />
          <line x1="344" y1="120" x2="344" y2="130" strokeWidth="3" />
          <line x1="366" y1="121" x2="366" y2="129" strokeWidth="3" />
          <line x1="388" y1="119" x2="388" y2="131" strokeWidth="3" />
          <line x1="410" y1="120" x2="410" y2="130" strokeWidth="3" />
          <line x1="432" y1="117" x2="432" y2="133" strokeWidth="3" />
          <line x1="454" y1="119" x2="454" y2="131" strokeWidth="3" />
          <line x1="476" y1="115" x2="476" y2="135" strokeWidth="3" />
          <line x1="498" y1="118" x2="498" y2="132" strokeWidth="3" />
          <line x1="520" y1="113" x2="520" y2="137" strokeWidth="3" />
          <line x1="542" y1="116" x2="542" y2="134" strokeWidth="3" />
          <line x1="564" y1="109" x2="564" y2="141" strokeWidth="3" />
          <line x1="586" y1="113" x2="586" y2="137" strokeWidth="3" />
          <line x1="608" y1="104" x2="608" y2="146" strokeWidth="3.5" />
          <line x1="630" y1="109" x2="630" y2="141" strokeWidth="3.5" />
          <line x1="652" y1="96" x2="652" y2="154" strokeWidth="3.5" />
          <line x1="674" y1="102" x2="674" y2="148" strokeWidth="3.5" />
          <line x1="696" y1="86" x2="696" y2="164" strokeWidth="3.5" />
          <line x1="720" y1="98" x2="720" y2="152" strokeWidth="3.5" />
          <line x1="745" y1="68" x2="745" y2="182" strokeWidth="4" />
          <line x1="772" y1="48" x2="772" y2="202" strokeWidth="4" />
          <line x1="799" y1="78" x2="799" y2="172" strokeWidth="4" />
          <line x1="826" y1="33" x2="826" y2="217" strokeWidth="4" />
          <line x1="853" y1="58" x2="853" y2="192" strokeWidth="4" />
          <line x1="880" y1="25" x2="880" y2="225" strokeWidth="4.5" />
          <line x1="907" y1="63" x2="907" y2="187" strokeWidth="4.5" />
          <line x1="934" y1="40" x2="934" y2="210" strokeWidth="4.5" />
          <line x1="961" y1="70" x2="961" y2="180" strokeWidth="4.5" />
          <line x1="988" y1="95" x2="988" y2="155" strokeWidth="4" />
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

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {HOME_ENTRIES.map(({ to, icon: Icon, label }) => (
          <div className="div-animated-wrapper" key={to}>
            <Link to={to} className="link-animated-inner group">
              <p className="text-primary flex justify-center w-full">
                <Icon size={28} />
              </p>
              <p className="text-primary">{label}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

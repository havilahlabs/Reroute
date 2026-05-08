// Tiny stroke icons used across all screens. 24×24 viewBox, current stroke color.
const Icon = ({ d, size = 22, fill = false, sw = 1.8, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d}/> : children}
  </svg>
);

// Reroute looped arrow logo glyph
const IconLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 12c0-4.97 4.03-9 9-9 2.5 0 4.76 1.02 6.4 2.66M21 12c0 4.97-4.03 9-9 9-2.5 0-4.76-1.02-6.4-2.66" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M19 3v4h-4M5 21v-4h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Tab bar icons
const IconHome     = ({size=24}) => <Icon size={size}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/></Icon>;
const IconRoutine  = ({size=24}) => <Icon size={size}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IconInsights = ({size=24}) => <Icon size={size}><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></Icon>;
const IconSettings = ({size=24}) => <Icon size={size}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>;

// Common
const IconChevR    = ({size=18}) => <Icon size={size}><path d="M9 6l6 6-6 6"/></Icon>;
const IconChevL    = ({size=18}) => <Icon size={size}><path d="M15 6l-6 6 6 6"/></Icon>;
const IconChevD    = ({size=18}) => <Icon size={size}><path d="M6 9l6 6 6-6"/></Icon>;
const IconClose    = ({size=18}) => <Icon size={size}><path d="M18 6L6 18M6 6l12 12"/></Icon>;
const IconPlus     = ({size=18}) => <Icon size={size}><path d="M12 5v14M5 12h14"/></Icon>;
const IconCheck    = ({size=14, sw=2.6}) => <Icon size={size} sw={sw}><path d="M20 6L9 17l-5-5"/></Icon>;
const IconPause    = ({size=20}) => <Icon size={size} sw={2}><path d="M8 5v14M16 5v14"/></Icon>;
const IconLeaf     = ({size=18}) => <Icon size={size}><path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 7 7v9h-9z"/><path d="M4 4l16 16"/></Icon>;
const IconLock     = ({size=18}) => <Icon size={size}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></Icon>;
const IconBell     = ({size=18}) => <Icon size={size}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></Icon>;
const IconMoon     = ({size=18}) => <Icon size={size}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></Icon>;
const IconSun      = ({size=18}) => <Icon size={size}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Icon>;
const IconShield   = ({size=18}) => <Icon size={size}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></Icon>;
const IconCal      = ({size=18}) => <Icon size={size}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></Icon>;
const IconStar     = ({size=18}) => <Icon size={size}><path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3z"/></Icon>;
const IconUser     = ({size=18}) => <Icon size={size}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></Icon>;
const IconHelp     = ({size=18}) => <Icon size={size}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.3-1.5 2.5"/><circle cx="12" cy="17" r=".7" fill="currentColor"/></Icon>;
const IconDoc      = ({size=18}) => <Icon size={size}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M9 14h6M9 17h6"/></Icon>;

// App brand glyphs (placeholders — colored squares with letter)
const AppGlyph = ({ name, color }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 10, background: color,
    display: 'grid', placeItems: 'center', color: '#fff',
    fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, flex: '0 0 36px',
  }}>{name[0]}</div>
);

const APPS = {
  TikTok:    '#0F0F1A',
  Instagram: '#C13584',
  YouTube:   '#FF0000',
  X:         '#222',
  Safari:    '#1E88E5',
  Messages:  '#34C759',
  Email:     '#5D52A8',
  Reddit:    '#FF4500',
  Games:     '#7C6FCD',
  Other:     '#6B6880',
};

Object.assign(window, {
  Icon, IconLogo, IconHome, IconRoutine, IconInsights, IconSettings,
  IconChevR, IconChevL, IconChevD, IconClose, IconPlus, IconCheck,
  IconPause, IconLeaf, IconLock, IconBell, IconMoon, IconSun, IconShield,
  IconCal, IconStar, IconUser, IconHelp, IconDoc, AppGlyph, APPS,
});

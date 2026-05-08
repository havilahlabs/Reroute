import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

function Icon({
  size = 22,
  color = 'currentColor',
  strokeWidth = 1.8,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              stroke: color,
              strokeWidth,
              strokeLinecap: 'round' as const,
              strokeLinejoin: 'round' as const,
            })
          : child
      )}
    </Svg>
  );
}

export function IconLogo({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12c0-4.97 4.03-9 9-9 2.5 0 4.76 1.02 6.4 2.66M21 12c0 4.97-4.03 9-9 9-2.5 0-4.76-1.02-6.4-2.66"
        stroke={color} strokeWidth={2.4} strokeLinecap="round"
      />
      <Path
        d="M19 3v4h-4M5 21v-4h4"
        stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconHome({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z" />
    </Icon>
  );
}

export function IconRoutine({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M12 7v5l3 2" />
    </Icon>
  );
}

export function IconInsights({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </Icon>
  );
}

export function IconSettings({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={1.5}>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Icon>
  );
}

export function IconChevronRight({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M9 6l6 6-6 6" />
    </Icon>
  );
}

export function IconChevronLeft({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M15 6l-6 6 6 6" />
    </Icon>
  );
}

export function IconChevronDown({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M6 9l6 6 6-6" />
    </Icon>
  );
}

export function IconClose({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M18 6L6 18M6 6l12 12" />
    </Icon>
  );
}

export function IconPlus({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function IconCheck({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={2.6}>
      <Path d="M20 6L9 17l-5-5" />
    </Icon>
  );
}

export function IconPause({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color} strokeWidth={2}>
      <Path d="M8 5v14M16 5v14" />
    </Icon>
  );
}

export function IconLeaf({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 7 7v9h-9z" />
      <Path d="M4 4l16 16" />
    </Icon>
  );
}

export function IconLock({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Rect x={4} y={11} width={16} height={10} rx={2} />
      <Path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </Icon>
  );
}

export function IconBell({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <Path d="M10 21a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function IconMoon({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </Icon>
  );
}

export function IconSun({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  );
}

export function IconShield({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
    </Icon>
  );
}

export function IconCalendar({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Rect x={3} y={5} width={18} height={16} rx={2} />
      <Path d="M16 3v4M8 3v4M3 11h18" />
    </Icon>
  );
}

export function IconStar({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3z" />
    </Icon>
  );
}

export function IconUser({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  );
}

export function IconHelp({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .8-1.5 1.3-1.5 2.5" />
      <Circle cx={12} cy={17} r={0.7} fill={color} stroke="none" />
    </Icon>
  );
}

export function IconDoc({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
      <Path d="M14 3v6h6M9 14h6M9 17h6" />
    </Icon>
  );
}

export function IconBack({ size = 22, color = 'currentColor' }: IconProps) {
  return (
    <Icon size={size} color={color}>
      <Path d="M19 12H5M12 5l-7 7 7 7" />
    </Icon>
  );
}

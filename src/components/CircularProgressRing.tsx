import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CircularProgressRingProps {
  size: number;
  progress: number; // 0–1
  reroutes?: number; // number of dots to show on ring
  trackColor?: string;
  children?: React.ReactNode;
}

export function CircularProgressRing({
  size,
  progress,
  reroutes = 0,
  trackColor = 'rgba(58,54,88,0.5)',
  children,
}: CircularProgressRingProps) {
  const strokeWidth = 3;
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  // Reroute dots placed along the ring at the positions where drifts happened
  const rerouteDots = Array.from({ length: reroutes }, (_, i) => {
    const angle = (2 * Math.PI * (i + 1)) / Math.max(reroutes + 1, 2) - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#A99FE0" />
            <Stop offset="100%" stopColor="#7C6FCD" />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        {/* Progress */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${cx},${cy}`}
        />
        {/* Reroute dots */}
        {rerouteDots.map((dot, i) => (
          <Circle key={i} cx={dot.x} cy={dot.y} r={4} fill="#F4ECDF" opacity={0.9} />
        ))}
      </Svg>
      {children}
    </View>
  );
}

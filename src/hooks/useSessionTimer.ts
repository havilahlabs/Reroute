import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useSessionTimer(
  durationMinutes: number,
  onComplete: () => void,
  startedAt?: string,
) {
  const totalSeconds = durationMinutes * 60;

  const calcRemaining = useCallback(() => {
    if (!startedAt) return totalSeconds;
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, totalSeconds - elapsed);
  }, [startedAt, totalSeconds]);

  const [secondsLeft, setSecondsLeft] = useState(calcRemaining);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completedRef = useRef(false);

  const tick = useCallback(() => {
    const remaining = calcRemaining();
    setSecondsLeft(remaining);
    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
    }
  }, [calcRemaining, onComplete]);

  const startTick = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  useEffect(() => {
    tick(); // sync immediately on mount
    startTick();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTick, tick]);

  // Re-sync after app comes back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        tick();
        if (!isPaused) startTick();
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    });
    return () => sub.remove();
  }, [tick, startTick, isPaused]);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    startTick();
  }, [startTick]);

  const progress = startedAt ? 1 - secondsLeft / totalSeconds : 1 - secondsLeft / totalSeconds;

  return { secondsLeft, isPaused, pause, resume, progress };
}

export function useUnlockTimer(durationSeconds: number, onComplete: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [durationSeconds, onComplete]);

  return { secondsLeft };
}

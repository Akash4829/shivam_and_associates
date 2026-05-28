import React from 'react';
import { useThemeMode } from '../../context/ThemeContext';

export function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const base = isLight ? 'bg-navy/5' : 'bg-white/[0.06]';
  return <div className={`${base} ${rounded} animate-pulse ${className}`} aria-hidden />;
}

export function CardSkeleton({ lines = 3 }) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  return (
    <div
      className={`rounded-2xl p-6 border ${
        isLight ? 'border-navy/10 bg-white' : 'border-white/[0.06] bg-white/[0.03]'
      } space-y-4`}
      aria-hidden
    >
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-5 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}

export default Skeleton;

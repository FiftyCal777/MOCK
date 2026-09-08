import { useEffect, useState } from 'react';

const chevronDelays = Array.from({ length: 9 }, (_, index) => {
  const row = Math.floor(index / 3);
  const column = index % 3;
  return (column + Math.abs(row - 1)) * 90;
});

const orbitOrder = [0, 1, 2, 5, 8, 7, 6, 3];
const orbitDelays = Array.from({ length: 9 }, (_, index) => {
  const position = orbitOrder.indexOf(index);
  return position === -1 ? null : position * 110;
});

const patterns: Record<string, { delays: (number | null)[]; duration: number; round: boolean }> = {
  Drive: { delays: chevronDelays, duration: 650, round: false },
  Dots: { delays: chevronDelays, duration: 650, round: true },
  Orbit: { delays: orbitDelays, duration: 950, round: false },
};

function LoaderGrid({
  delays,
  duration,
  round,
}: {
  delays: (number | null)[];
  duration: number;
  round: boolean;
}) {
  return (
    <span aria-hidden className="grid shrink-0 grid-cols-3 gap-[2px]">
      {delays.map((delay, index) => (
        <span
          key={index}
          className={`h-1 w-1 bg-primary ${round ? 'rounded-full' : 'rounded-[1px]'}`}
          style={{
            opacity: delay === null ? 0.12 : 0.25,
            animation: delay === null ? 'none' : `pixel-on ${duration}ms ease-in-out ${delay}ms infinite`,
          }}
        />
      ))}
    </span>
  );
}

function useElapsed() {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTicks((value) => value + 1), 100);
    return () => window.clearInterval(timer);
  }, []);

  const seconds = ticks / 10;
  return seconds < 60
    ? `${seconds.toFixed(1)}s`
    : `${Math.floor(seconds / 60)}m ${(seconds % 60).toFixed(1)}s`;
}

interface LoadingStateProps {
  label?: string;
  variant?: 'Drive' | 'Dots' | 'Orbit';
}

export default function LoadingState({ label = 'Loading', variant = 'Drive' }: LoadingStateProps) {
  const elapsed = useElapsed();
  const pattern = patterns[variant];

  return (
    <div role="status" aria-live="polite" className="flex w-fit items-center gap-2.5">
      <LoaderGrid delays={pattern.delays} duration={pattern.duration} round={pattern.round} />
      <span
        className="loading-shimmer text-sm font-medium"
        style={{
          backgroundImage: 'linear-gradient(90deg, hsl(var(--muted-foreground)) 35%, hsl(var(--foreground)) 50%, hsl(var(--muted-foreground)) 65%)',
        }}
      >
        {label}
      </span>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">{elapsed}</span>
    </div>
  );
}

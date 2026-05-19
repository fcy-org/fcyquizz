'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full px-4 pt-4 pb-2">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '3px', backgroundColor: 'var(--color-border)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: 'var(--color-accent)',
          }}
        />
      </div>
      <p
        className="text-right text-xs mt-1"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {current} / {total}
      </p>
    </div>
  );
}

'use client';

import { CheckCircle2 } from 'lucide-react';

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

export default function OptionCard({ label, selected, onClick, icon }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 md:p-5 transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer"
      style={{
        backgroundColor: selected ? 'var(--color-accent-dim)' : 'var(--color-surface)',
        border: `1px solid ${selected ? 'var(--color-accent)' : 'var(--color-border)'}`,
        boxShadow: selected ? '0 0 0 1px var(--color-accent)' : 'none',
      }}
      onMouseEnter={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-hover)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-2)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)';
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface)';
        }
      }}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <span
          className="text-sm font-medium leading-snug"
          style={{ color: selected ? 'var(--color-accent)' : 'var(--color-text)' }}
        >
          {label}
        </span>
      </div>
      <div className="shrink-0">
        {selected ? (
          <CheckCircle2
            size={20}
            style={{ color: 'var(--color-accent)' }}
          />
        ) : (
          <div
            className="w-5 h-5 rounded-full border-2"
            style={{ borderColor: 'var(--color-border-hover)' }}
          />
        )}
      </div>
    </button>
  );
}

'use client';

import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface QuizButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

export default function QuizButton({
  children,
  onClick,
  disabled,
  loading,
  variant = 'primary',
  type = 'button',
  fullWidth = true,
}: QuizButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${fullWidth ? 'w-full' : ''} rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
      style={{
        backgroundColor: isPrimary
          ? disabled || loading
            ? 'rgba(197, 255, 77, 0.4)'
            : 'var(--color-accent)'
          : 'transparent',
        color: isPrimary ? '#000000' : 'var(--color-text-secondary)',
        border: isPrimary ? 'none' : '1px solid var(--color-border)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transform: 'scale(1)',
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.transform = 'scale(1.01)';
          if (isPrimary) el.style.backgroundColor = '#d4ff70';
        }
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.transform = 'scale(1)';
        if (isPrimary && !disabled && !loading) el.style.backgroundColor = 'var(--color-accent)';
      }}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}

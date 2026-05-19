'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, TrendingUp, RefreshCw, Zap } from 'lucide-react';

const ITEMS = [
  { icon: BarChart3, label: 'Estrutura comercial' },
  { icon: Users, label: 'Canal de vendas atual' },
  { icon: TrendingUp, label: 'Potencial de crescimento' },
  { icon: RefreshCw, label: 'Recompra e base de clientes' },
];

interface Props {
  firstName: string;
}

export default function Screen17Processing({ firstName }: Props) {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    ITEMS.forEach((_, i) => {
      setTimeout(() => setVisibleItems(prev => [...prev, i]), 400 + i * 450);
    });

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[80vh] lg:min-h-0 gap-8 py-12 text-center">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-4"
          style={{ borderColor: 'var(--color-border)' }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: 'var(--color-accent)',
            borderRightColor: 'var(--color-accent)',
            animationDuration: '0.8s',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={20} style={{ color: 'var(--color-accent)' }} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Estamos analisando seu cenário, {firstName}.
        </h2>
        <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Cruzando suas respostas sobre estrutura comercial, canais atuais, capacidade de atendimento e potencial de crescimento.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="w-full rounded-full overflow-hidden" style={{ height: '4px', backgroundColor: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, backgroundColor: 'var(--color-accent)' }}
          />
        </div>
        <p className="text-xs text-right mt-1" style={{ color: 'var(--color-text-muted)' }}>{progress}%</p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2.5 w-full max-w-xs">
        {ITEMS.map(({ icon: Icon, label }, i) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300"
            style={{
              backgroundColor: visibleItems.includes(i) ? 'var(--color-surface)' : 'transparent',
              border: `1px solid ${visibleItems.includes(i) ? 'var(--color-border)' : 'transparent'}`,
              opacity: visibleItems.includes(i) ? 1 : 0.2,
              transform: visibleItems.includes(i) ? 'translateX(0)' : 'translateX(-8px)',
            }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: visibleItems.includes(i) ? 'var(--color-accent-dim)' : 'transparent' }}
            >
              <Icon size={14} style={{ color: visibleItems.includes(i) ? 'var(--color-accent)' : 'var(--color-text-muted)' }} />
            </div>
            <span className="text-sm" style={{ color: visibleItems.includes(i) ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {label}
            </span>
            {visibleItems.includes(i) && (
              <div className="ml-auto">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path d="M2 6l3 3 5-5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

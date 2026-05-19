'use client';

import { type QuizAnswers } from '@/lib/types';
import { Megaphone, BarChart3, RefreshCw, TrendingUp } from 'lucide-react';
import QuizButton from '../QuizButton';

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen11Info({ next }: Props) {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
          Um novo canal de vendas não nasce só com anúncio.
        </h2>

        <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Para uma distribuidora ou indústria crescer com previsibilidade, é preciso gerar oportunidades, acompanhar o comercial, entender o que vira venda e criar uma jornada para que o cliente compre novamente.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Megaphone, label: 'Geração de oportunidades' },
          { icon: BarChart3, label: 'O que vira venda' },
          { icon: RefreshCw, label: 'Jornada de recompra' },
          { icon: TrendingUp, label: 'Receita previsível' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-accent-dim)' }}
            >
              <Icon size={18} style={{ color: 'var(--color-accent)' }} />
            </div>
            <span className="text-xs font-medium leading-tight" style={{ color: 'var(--color-text)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next}>
          Faz sentido, continuar
        </QuizButton>
      </div>
    </div>
  );
}

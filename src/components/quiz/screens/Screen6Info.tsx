'use client';

import { type QuizAnswers } from '@/lib/types';
import { ArrowRight, Target, TrendingUp, Users } from 'lucide-react';
import QuizButton from '../QuizButton';

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen6Info({ answers, next }: Props) {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-4">
        <div
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: 'var(--color-accent)' }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-dim)' }}>
            <ArrowRight size={12} style={{ color: 'var(--color-accent)' }} />
          </div>
          Entendido, {answers.firstName}.
        </div>

        <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
          Agora vamos olhar para a estrutura comercial.
        </h2>
      </div>

      <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        Empresas que crescem com mais previsibilidade geralmente não dependem apenas de indicação, carteira antiga ou esforço individual dos vendedores. Elas possuem uma estrutura capaz de gerar oportunidades, acompanhar o comercial e transformar novos contatos em receita recorrente.
      </p>

      <div className="flex flex-col gap-3">
        {[
          { icon: Target, label: 'Geração consistente de oportunidades' },
          { icon: Users, label: 'Acompanhamento estruturado do comercial' },
          { icon: TrendingUp, label: 'Transformação de novos contatos em receita recorrente' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <Icon size={16} style={{ color: 'var(--color-accent)' }} className="shrink-0" />
            <span className="text-sm" style={{ color: 'var(--color-text)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next}>
          Continuar diagnóstico
        </QuizButton>
      </div>
    </div>
  );
}

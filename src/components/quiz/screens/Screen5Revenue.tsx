'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'up_100k', label: 'Até R$100 mil/mês' },
  { value: '100k_300k', label: 'Entre R$100 mil e R$300 mil/mês' },
  { value: '300k_700k', label: 'Entre R$300 mil e R$700 mil/mês' },
  { value: '700k_1m', label: 'Entre R$700 mil e R$1 milhão/mês' },
  { value: 'above_1m', label: 'Acima de R$1 milhão/mês' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen5Revenue({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Qual é o faturamento médio mensal da sua empresa?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.revenue === opt.value}
            onClick={() => { updateAnswers({ revenue: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.revenue}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

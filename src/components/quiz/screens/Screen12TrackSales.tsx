'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'clearly', label: 'Sim, com clareza' },
  { value: 'partially', label: 'Parcialmente' },
  { value: 'salesperson_reports', label: 'Só quando o vendedor informa' },
  { value: 'spread_out', label: 'Não, fica espalhado' },
  { value: 'not_measure', label: 'Não medimos isso hoje' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen12TrackSales({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Hoje você consegue saber de onde veio cada venda?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.trackSales === opt.value}
            onClick={() => { updateAnswers({ trackSales: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.trackSales}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

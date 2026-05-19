'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'clear_routine', label: 'Sim, temos uma rotina clara' },
  { value: 'sometimes', label: 'Fazemos às vezes' },
  { value: 'per_salesperson', label: 'Depende de cada vendedor' },
  { value: 'not_organized', label: 'Não fazemos de forma organizada' },
  { value: 'dont_know', label: 'Não sei dizer' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen13Repurchase({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Sua empresa trabalha recompra ou reativação de clientes de forma organizada?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.repurchase === opt.value}
            onClick={() => { updateAnswers({ repurchase: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.repurchase}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

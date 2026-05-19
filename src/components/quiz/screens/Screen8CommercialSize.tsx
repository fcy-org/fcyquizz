'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'only_1', label: 'Apenas 1 pessoa' },
  { value: '2_3', label: '2 a 3 pessoas' },
  { value: '4_6', label: '4 a 6 pessoas' },
  { value: '7_10', label: '7 a 10 pessoas' },
  { value: 'more_10', label: 'Mais de 10 pessoas' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen8CommercialSize({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Quantas pessoas atuam diretamente no comercial da empresa?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.commercialSize === opt.value}
            onClick={() => { updateAnswers({ commercialSize: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.commercialSize}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

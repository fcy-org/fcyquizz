'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'yes_know_sales', label: 'Sim, e conseguimos saber quais vendas vieram disso' },
  { value: 'yes_dont_know', label: 'Sim, mas não sabemos exatamente o que virou venda' },
  { value: 'stopped', label: 'Já investimos, mas paramos por falta de resultado' },
  { value: 'not_yet', label: 'Ainda não investimos' },
  { value: 'thinking', label: 'Estamos pensando em começar' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen10Marketing({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Sua empresa já investe em marketing ou anúncios para gerar oportunidades comerciais?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.marketing === opt.value}
            onClick={() => { updateAnswers({ marketing: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.marketing}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

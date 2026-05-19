'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'referral', label: 'Indicação' },
  { value: 'old_clients', label: 'Carteira antiga de clientes' },
  { value: 'reps', label: 'Representantes comerciais' },
  { value: 'prospection', label: 'Prospecção ativa' },
  { value: 'ads', label: 'Anúncios na internet' },
  { value: 'social', label: 'Redes sociais / conteúdo' },
  { value: 'no_predictable', label: 'Não temos uma fonte previsível de novos clientes' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen9ClientSource({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Hoje, de onde vêm a maior parte dos novos clientes da sua empresa?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.clientSource === opt.value}
            onClick={() => { updateAnswers({ clientSource: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.clientSource}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

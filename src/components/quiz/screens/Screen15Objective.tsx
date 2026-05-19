'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'new_clients', label: 'Gerar novos clientes todos os meses' },
  { value: 'sell_more_base', label: 'Vender mais para a base atual' },
  { value: 'new_regions', label: 'Entrar em novas regiões' },
  { value: 'organize_commercial', label: 'Organizar o comercial' },
  { value: 'new_predictable_channel', label: 'Criar um novo canal previsível de vendas' },
  { value: 'all', label: 'Todos os anteriores' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen15Objective({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Qual é o principal objetivo da sua empresa hoje?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.objective === opt.value}
            onClick={() => { updateAnswers({ objective: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.objective}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

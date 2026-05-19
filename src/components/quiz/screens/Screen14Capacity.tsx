'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'yes_team_process', label: 'Sim, temos equipe e processo' },
  { value: 'yes_need_organize', label: 'Sim, mas precisaríamos organizar melhor' },
  { value: 'maybe_depends', label: 'Talvez, dependeria do volume' },
  { value: 'could_not', label: 'Hoje não conseguiríamos' },
  { value: 'dont_know', label: 'Não sei dizer' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen14Capacity({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Se um novo canal começasse a gerar oportunidades todos os meses, sua equipe conseguiria atender essa demanda?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.capacity === opt.value}
            onClick={() => { updateAnswers({ capacity: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.capacity}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

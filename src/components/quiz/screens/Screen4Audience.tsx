'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'lojistas', label: 'Lojistas e revendedores' },
  { value: 'empresas', label: 'Empresas e compradores corporativos' },
  { value: 'mercados', label: 'Mercados, farmácias ou pontos comerciais' },
  { value: 'representantes', label: 'Representantes ou parceiros comerciais' },
  { value: 'consumidor_final', label: 'Consumidor final' },
  { value: 'misto', label: 'Misto: vendemos para empresas e consumidor final' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen4Audience({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Sua empresa vende principalmente para quem?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.audience === opt.value}
            onClick={() => { updateAnswers({ audience: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.audience}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

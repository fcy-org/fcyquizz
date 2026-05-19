'use client';

import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'main_channel', label: 'Sim, é um dos principais canais comerciais' },
  { value: 'uses_unorganized', label: 'Sim, usamos bastante, mas ainda sem muita organização' },
  { value: 'little_support', label: 'Usamos pouco, apenas como apoio ao comercial' },
  { value: 'not_using', label: 'Ainda não usamos WhatsApp como canal comercial' },
  { value: 'dont_know', label: 'Não sei dizer' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen7WhatsApp({ answers, updateAnswers, next }: Props) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Hoje sua empresa vende ou atende oportunidades pelo WhatsApp?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.whatsappUsage === opt.value}
            onClick={() => { updateAnswers({ whatsappUsage: opt.value }); setTimeout(next, 300); }}
          />
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next} disabled={!answers.whatsappUsage}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

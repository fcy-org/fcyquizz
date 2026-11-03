'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import { ROLE } from '@/lib/labels';
import OptionCard from '../OptionCard';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

const OPTIONS = [
  ...Object.entries(ROLE).map(([value, label]) => ({ value, label })),
  { value: 'outro', label: 'Outro' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function ScreenRole({ answers, updateAnswers, next }: Props) {
  const [error, setError] = useState('');

  const handleSelect = (value: string) => {
    updateAnswers({ role: value });
    if (error) setError('');
  };

  const handleNext = () => {
    if (!answers.role) {
      setError('Selecione seu cargo para continuar.');
      return;
    }
    if (answers.role === 'outro' && !answers.roleOther.trim()) {
      setError('Informe seu cargo.');
      return;
    }
    next();
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Qual é o seu cargo na empresa?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.role === opt.value}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>

      {answers.role === 'outro' && (
        <QuizInput
          label="Qual é o seu cargo?"
          placeholder="Ex: Coordenador de operações"
          value={answers.roleOther}
          onChange={e => {
            updateAnswers({ roleOther: e.target.value });
            if (error) setError('');
          }}
          autoFocus
        />
      )}

      {error && (
        <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>
      )}

      <div className="mt-2">
        <QuizButton
          onClick={handleNext}
          disabled={!answers.role || (answers.role === 'outro' && !answers.roleOther.trim())}
        >
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

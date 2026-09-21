'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import { extractFirstName } from '@/lib/utils';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen1Name({ answers, updateAnswers, next }: Props) {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s{2,}/g, ' ');
    updateAnswers({
      fullName: value,
      firstName: extractFirstName(value),
    });
    if (error) setError('');
  };

  const handleNext = () => {
    if (!answers.fullName.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }
    next();
  };

  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-3">
        <h2
          className="text-2xl md:text-3xl font-bold leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Antes de analisarmos sua empresa, me diga seu nome
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Vamos usar essa informação apenas para personalizar sua experiência durante o diagnóstico.
        </p>
      </div>

      <QuizInput
        label="Seu nome"
        placeholder="Ex: Miguel"
        value={answers.fullName}
        onChange={handleChange}
        error={error}
        autoFocus
        autoComplete="name"
        onKeyDown={e => e.key === 'Enter' && handleNext()}
      />

      <div className="mt-auto">
        <QuizButton onClick={handleNext} disabled={!answers.fullName.trim()}>
          Começar análise
        </QuizButton>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'distribuidora', label: 'Distribuidora' },
  { value: 'industria', label: 'Indústria' },
  { value: 'atacado', label: 'Atacado' },
  { value: 'representacao', label: 'Representação comercial' },
  { value: 'outro', label: 'Outro modelo de negócio' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen2OperationType({ answers, updateAnswers, next }: Props) {
  const [error, setError] = useState('');

  const handleSelect = (value: string) => {
    updateAnswers({ operationType: value });
    if (error) setError('');
  };

  const handleNext = () => {
    if (!answers.operationType) {
      setError('Selecione uma opção para continuar.');
      return;
    }
    if (answers.operationType === 'outro' && !answers.operationTypeOther.trim()) {
      setError('Informe o modelo da sua empresa.');
      return;
    }
    next();
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
          Prazer, {answers.firstName}. Agora vamos entender o perfil da sua empresa.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
          Qual dessas opções descreve melhor a sua operação hoje?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.operationType === opt.value}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>

      {answers.operationType === 'outro' && (
        <QuizInput
          label="Qual é o modelo da sua empresa?"
          placeholder="Ex: importadora, varejo, e-commerce B2B, prestadora de serviços, etc."
          value={answers.operationTypeOther}
          onChange={e => {
            updateAnswers({ operationTypeOther: e.target.value });
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
          disabled={!answers.operationType || (answers.operationType === 'outro' && !answers.operationTypeOther.trim())}
        >
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import { cleanPhone, formatWhatsApp, validateWhatsApp } from '@/lib/utils';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

interface Props {
  answers: QuizAnswers;
  updateAnswers: (updates: Partial<QuizAnswers>) => void;
  next: () => void;
}

export default function ScreenWhatsAppNumber({ answers, updateAnswers, next }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!validateWhatsApp(answers.whatsapp)) {
      setError('Informe seu número de WhatsApp com DDD.');
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
          {answers.firstName}, qual número você usa no WhatsApp?
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Informe seu telefone com DDD.
        </p>
      </div>

      <QuizInput
        label="Número do WhatsApp"
        aria-label="Número do WhatsApp"
        placeholder="(86) 99999-9999"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        autoFocus
        value={answers.whatsapp}
        error={error}
        onChange={e => {
          const formatted = formatWhatsApp(e.target.value);
          updateAnswers({ whatsapp: formatted, whatsappClean: cleanPhone(formatted) });
          if (error) setError('');
        }}
        onKeyDown={e => e.key === 'Enter' && handleNext()}
      />

      <div className="mt-auto">
        <QuizButton onClick={handleNext} disabled={!answers.whatsapp.trim()}>
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

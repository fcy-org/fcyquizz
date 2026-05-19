'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import OptionCard from '../OptionCard';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

const OPTIONS = [
  { value: 'alimentos_bebidas', label: 'Alimentos e bebidas' },
  { value: 'farmacia_cosmeticos', label: 'Farmácia, cosméticos ou higiene' },
  { value: 'construcao_eletrico', label: 'Construção, material elétrico ou ferragens' },
  { value: 'moda_calcados', label: 'Moda, confecção ou calçados' },
  { value: 'autopecas', label: 'Autopeças ou peças em geral' },
  { value: 'maquinas_equipamentos', label: 'Máquinas, equipamentos ou suprimentos' },
  { value: 'outro', label: 'Outro segmento' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

export default function Screen3Segment({ answers, updateAnswers, next }: Props) {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!answers.segment) { setError('Selecione um segmento para continuar.'); return; }
    if (answers.segment === 'outro' && !answers.segmentOther.trim()) { setError('Informe o segmento da sua empresa.'); return; }
    next();
  };

  return (
    <div className="flex flex-col gap-6 py-8">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
        Em qual segmento sua empresa atua?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={answers.segment === opt.value}
            onClick={() => { updateAnswers({ segment: opt.value }); if (error) setError(''); }}
          />
        ))}
      </div>

      {answers.segment === 'outro' && (
        <QuizInput
          label="Qual segmento sua empresa atende?"
          placeholder="Ex: embalagens, papelaria, produtos hospitalares, tecnologia, etc."
          value={answers.segmentOther}
          onChange={e => { updateAnswers({ segmentOther: e.target.value }); if (error) setError(''); }}
          autoFocus
        />
      )}

      {error && <p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p>}

      <div className="mt-2">
        <QuizButton
          onClick={handleNext}
          disabled={!answers.segment || (answers.segment === 'outro' && !answers.segmentOther.trim())}
        >
          Continuar
        </QuizButton>
      </div>
    </div>
  );
}

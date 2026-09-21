'use client';

import { type QuizAnswers } from '@/lib/types';
import { Quote } from 'lucide-react';
import QuizButton from '../QuizButton';

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
}

interface Testimonial {
  name: string;
  company: string;
  quote: string;
  /** Vídeo vertical em /public (ex: '/depoimentos/maykon.mp4'). Sem vídeo, mostra só o card de texto. */
  videoSrc?: string;
  poster?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Maykon',
    company: 'Rio Piranhas / Brave',
    quote: 'Faço parte da operação comercial e vi de perto o canal de vendas ganhar previsibilidade.',
    videoSrc: '/depoimentos/maykon.mp4',
  },
  {
    name: 'Jessica',
    company: 'Cliente Fonil',
    quote: 'Veja como a Fonil ajudou a estruturar o canal de vendas.',
    videoSrc: '/depoimentos/jessica.mp4',
  },
  {
    name: 'Remédios',
    company: 'Cliente Fonil',
    quote: 'Veja como a Fonil ajudou a estruturar o canal de vendas.',
    videoSrc: '/depoimentos/remedios.mp4',
  },
];

export default function ScreenSocialProofBreak({ answers, next }: Props) {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
          {answers.firstName}, você não está sozinho.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
          Veja o que empresas como a sua estão dizendo.
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          Distribuidoras e indústrias que estruturaram seu canal de vendas com a Fonil.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {TESTIMONIALS.map(t => (
          <div
            key={t.name}
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            {t.videoSrc && (
              <video
                src={t.videoSrc}
                poster={t.poster}
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-[9/16] max-h-[520px] object-cover bg-black"
              />
            )}
            <div className="flex gap-3 p-4">
              <Quote size={18} className="shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }} />
              <div className="flex flex-col gap-1">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                  {t.quote}
                </p>
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                  {t.name} · {t.company}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <QuizButton onClick={next}>Continuar</QuizButton>
      </div>
    </div>
  );
}

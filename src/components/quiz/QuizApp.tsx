'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type QuizAnswers, type QuizState, INITIAL_ANSWERS } from '@/lib/types';
import { calculateResult, getQualificationLevel } from '@/lib/scoring';
import { getUTMParams, generateEventId } from '@/lib/utils';
import { label, OPERATION_TYPE, SEGMENT, AUDIENCE, REVENUE, WHATSAPP_USAGE, COMMERCIAL_SIZE, CLIENT_SOURCE, MARKETING, TRACK_SALES, REPURCHASE, CAPACITY, OBJECTIVE, RESULT, ROLE } from '@/lib/labels';

import ProgressBar from './ProgressBar';
import Logo from './Logo';
import Screen0Welcome from './screens/Screen0Welcome';
import Screen1Name from './screens/Screen1Name';
import Screen2OperationType from './screens/Screen2OperationType';
import Screen3Segment from './screens/Screen3Segment';
import Screen4Audience from './screens/Screen4Audience';
import Screen5Revenue from './screens/Screen5Revenue';
import Screen6Info from './screens/Screen6Info';
import Screen7WhatsApp from './screens/Screen7WhatsApp';
import Screen8CommercialSize from './screens/Screen8CommercialSize';
import Screen9ClientSource from './screens/Screen9ClientSource';
import Screen10Marketing from './screens/Screen10Marketing';
import Screen11Info from './screens/Screen11Info';
import Screen12TrackSales from './screens/Screen12TrackSales';
import Screen13Repurchase from './screens/Screen13Repurchase';
import Screen14FinalForm from './screens/Screen16FinalForm';
import Screen15Processing from './screens/Screen17Processing';
import Screen16Result from './screens/Screen18Result';

// Steps: 0=welcome, 1-13=questions/info, 14=form, 15=processing, 16=result
const PROGRESS_STEPS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 13, 14];

export default function QuizApp() {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    answers: INITIAL_ANSWERS,
    result: null,
    isSubmitting: false,
    utmParams: {},
  });
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  useEffect(() => {
    setState(prev => ({ ...prev, utmParams: getUTMParams() }));
  }, []);

  const goTo = useCallback((step: number, dir = 1) => {
    setDirection(dir);
    setState(prev => ({ ...prev, currentStep: step }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const next = useCallback(() => goTo(state.currentStep + 1, 1), [state.currentStep, goTo]);
  const back = useCallback(() => goTo(state.currentStep - 1, -1), [state.currentStep, goTo]);

  const updateAnswers = useCallback((updates: Partial<QuizAnswers>) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, ...updates },
    }));
  }, []);

  const submitAndShowResult = useCallback(async () => {
    const result = calculateResult(state.answers);
    const qualification = getQualificationLevel(result);

    setState(prev => ({ ...prev, result, isSubmitting: true }));
    goTo(15, 1); // show processing screen

    // Build submission payload
    const payload = {
      // Personal data
      nome_completo: state.answers.fullName,
      primeiro_nome: state.answers.firstName,
      empresa: state.answers.companyName,
      whatsapp: state.answers.whatsapp,
      whatsapp_limpo: state.answers.whatsappClean,
      email: state.answers.email,
      cnpj: state.answers.cnpj,
      cnpj_limpo: state.answers.cnpjClean,
      cidade: state.answers.city,
      estado: state.answers.state,
      cargo: state.answers.role === 'outro' ? state.answers.roleOther : label(ROLE, state.answers.role),
      // Quiz answers (labels em português)
      tipo_operacao: state.answers.operationType === 'outro' ? state.answers.operationTypeOther : label(OPERATION_TYPE, state.answers.operationType),
      segmento: state.answers.segment === 'outro' ? state.answers.segmentOther : label(SEGMENT, state.answers.segment),
      publico_atendido: label(AUDIENCE, state.answers.audience),
      faturamento: label(REVENUE, state.answers.revenue),
      uso_whatsapp: label(WHATSAPP_USAGE, state.answers.whatsappUsage),
      tamanho_comercial: label(COMMERCIAL_SIZE, state.answers.commercialSize),
      origem_clientes: label(CLIENT_SOURCE, state.answers.clientSource),
      investimento_marketing: label(MARKETING, state.answers.marketing),
      rastreio_vendas: label(TRACK_SALES, state.answers.trackSales),
      recompra: label(REPURCHASE, state.answers.repurchase),
      capacidade: label(CAPACITY, state.answers.capacity),
      objetivo: label(OBJECTIVE, state.answers.objective),
      // Result
      resultado_diagnostico: label(RESULT, result),
      nivel_qualificacao: qualification,
      // Meta e rastreamento
      event_id: generateEventId(),
      ...state.utmParams,
      url_pagina: typeof window !== 'undefined' ? window.location.href : '',
      dispositivo: typeof window !== 'undefined' ? (window.innerWidth <= 768 ? 'mobile' : 'desktop') : '',
      navegador: typeof window !== 'undefined' ? navigator.userAgent : '',
    };

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Fail silently - user still gets their result
    }

    // Simulate 2.5s processing for UX
    await new Promise(r => setTimeout(r, 2500));

    setState(prev => ({ ...prev, isSubmitting: false }));
    goTo(16, 1);
  }, [state.answers, state.utmParams, goTo]);

  // Progress bar calculation
  const showProgress = state.currentStep >= 1 && state.currentStep <= 14;
  const progressCurrent = PROGRESS_STEPS.indexOf(state.currentStep) + 1;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const renderScreen = () => {
    const props = { answers: state.answers, updateAnswers, next, back };
    switch (state.currentStep) {
      case 0: return <Screen0Welcome onStart={next} />;
      case 1: return <Screen1Name {...props} />;
      case 2: return <Screen2OperationType {...props} />;
      case 3: return <Screen3Segment {...props} />;
      case 4: return <Screen4Audience {...props} />;
      case 5: return <Screen5Revenue {...props} />;
      case 6: return <Screen6Info {...props} />;
      case 7: return <Screen7WhatsApp {...props} />;
      case 8: return <Screen8CommercialSize {...props} />;
      case 9: return <Screen9ClientSource {...props} />;
      case 10: return <Screen10Marketing {...props} />;
      case 11: return <Screen11Info {...props} />;
      case 12: return <Screen12TrackSales {...props} />;
      case 13: return <Screen13Repurchase {...props} />;
      case 14: return <Screen14FinalForm {...props} onSubmit={submitAndShowResult} />;
      case 15: return <Screen15Processing firstName={state.answers.firstName} />;
      case 16: return <Screen16Result answers={state.answers} result={state.result!} />;
      default: return null;
    }
  };

  return (
    /*
     * Mobile: full-screen, single column
     * Desktop (lg+): quiz centrado num card com bordas arredondadas e respiro vertical
     */
    <div
      className="min-h-screen flex flex-col lg:items-center lg:justify-center lg:py-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      {/* Card container — borda e sombra só no desktop */}
      <div
        className="quiz-card w-full lg:max-w-2xl flex flex-col flex-1 lg:flex-none lg:rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Header — steps 1-14 */}
        {state.currentStep >= 1 && state.currentStep <= 14 && (
          <header className="flex items-center justify-between px-5 pt-5 pb-2">
            <Logo />
            <button
              onClick={back}
              className="text-sm flex items-center gap-1 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              ← Voltar
            </button>
          </header>
        )}

        {/* Progress bar */}
        {showProgress && <ProgressBar current={progressCurrent} total={PROGRESS_STEPS.length} />}

        {/* Main content */}
        <main className={`flex-1 flex flex-col ${state.currentStep !== 0 ? 'px-5 md:px-8' : ''}`}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

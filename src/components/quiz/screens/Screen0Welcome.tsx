"use client";

import QuizButton from "../QuizButton";
import Logo from "../Logo";
import { TrendingUp, BarChart3, Zap } from "lucide-react";

interface Props {
  onStart: () => void;
}

export default function Screen0Welcome({ onStart }: Props) {
  return (
    <div className="flex flex-col flex-1 pb-8 px-5 md:px-8 relative overflow-hidden min-h-svh lg:min-h-0">
      <div
        className="relative z-10 -mx-5 md:-mx-8 py-3 px-5 text-center text-xs md:text-sm font-bold tracking-wider"
        style={{ backgroundColor: '#B91C1C', color: '#FFFFFF' }}
      >
        EXCLUSIVO PARA DISTRIBUIDORAS/INDÚSTRIAS QUE FATURAM MAIS DE R$ 100.000,00
      </div>
      {/* Background elements */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          background: "var(--color-accent)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{
          background: "var(--color-accent)",
          transform: "translate(-40%, 40%)",
        }}
      />

      {/* Logo */}
      <div className="flex justify-center mb-auto pt-8">
        <Logo size="md" />
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center text-center gap-6 py-8 my-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
          style={{
            backgroundColor: "var(--color-accent-dim)",
            color: "var(--color-accent)",
            border: "1px solid rgba(197,255,77,0.25)",
          }}
        >
          Agende a sua consultoria
        </div>

        <h1
          className="text-3xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          O sistema que gerou mais de R$ 200 mil em receita nova para uma
          distribuidora do Nordeste, sem depender de representantes. Veja se
          ele se aplica ao seu negócio.
        </h1>

        <p
          className="text-base leading-relaxed max-w-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Sua distribuidora/indústria ainda depende da agenda dos
          representantes para vender? Responda essas perguntas rápidas e
          descubra como mudar isso.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-xs md:max-w-none">
          {[
            { icon: BarChart3, label: "Análise da estrutura comercial" },
            {
              icon: TrendingUp,
              label: "Mapeamento do potencial de crescimento",
            },
            { icon: Zap, label: "Consultoria gratuita para sua empresa" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--color-accent-dim)" }}
              >
                <Icon size={15} style={{ color: "var(--color-accent)" }} />
              </div>
              <span
                className="text-sm font-medium text-left"
                style={{ color: "var(--color-text)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6">
        <QuizButton onClick={onStart}>Iniciar cadastro</QuizButton>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Consultoria gratuita · Para distribuidoras e indústrias
        </p>
      </div>
    </div>
  );
}

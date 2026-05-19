"use client";

import QuizButton from "../QuizButton";
import Logo from "../Logo";
import { TrendingUp, BarChart3, Zap } from "lucide-react";

interface Props {
  onStart: () => void;
}

export default function Screen0Welcome({ onStart }: Props) {
  return (
    <div className="flex flex-col flex-1 py-8 px-5 md:px-8 relative overflow-hidden min-h-svh lg:min-h-0">
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
      <div className="flex justify-center mb-auto pt-4">
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
          <Zap size={12} />
          Diagnóstico Personalizado
        </div>

        <h1
          className="text-3xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          Descubra se sua empresa está pronta para criar um novo canal de vendas
        </h1>

        <p
          className="text-base leading-relaxed max-w-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Responda algumas perguntas sobre sua operação comercial e receba um
          diagnóstico sobre o potencial da sua empresa para transformar demanda
          em receita previsível.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-xs md:max-w-none">
          {[
            { icon: BarChart3, label: "Análise da estrutura comercial" },
            {
              icon: TrendingUp,
              label: "Mapeamento do potencial de crescimento",
            },
            { icon: Zap, label: "Diagnóstico personalizado para sua empresa" },
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
        <QuizButton onClick={onStart}>Iniciar diagnóstico</QuizButton>
        <p
          className="text-center text-xs mt-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Gratuito · Diagnóstico personalizado
        </p>
      </div>
    </div>
  );
}

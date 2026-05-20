"use client";

import { type QuizAnswers, type ResultType } from "@/lib/types";
import { buildWhatsAppMessage } from "@/lib/utils";
import {
  MessageCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import Logo from "../Logo";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5586999999999";

interface ResultConfig {
  badge: string;
  title: (firstName: string) => string;
  description: string;
  recommendation: string;
  offer: string;
  color: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
}

const RESULTS: Record<ResultType, ResultConfig> = {
  beginning: {
    badge: "Começo da Estrutura",
    title: (n) => `${n}, sua empresa está no Começo da Estrutura`,
    description:
      "Sua empresa tem potencial, mas ainda precisa organizar melhor a base comercial antes de criar um novo canal de crescimento. Hoje, o principal ponto de atenção parece estar na estrutura de atendimento, registro das oportunidades e clareza sobre o que realmente gera vendas.",
    recommendation:
      "O caminho mais indicado é começar entendendo como sua operação comercial funciona hoje, quais gargalos impedem mais conversões e o que pode ser organizado antes de escalar a geração de demanda.",
    offer: "Análise Comercial com IA",
    color: "#FF9F4D",
    icon: Target,
  },
  potential: {
    badge: "Operação com Potencial",
    title: (n) => `${n}, sua empresa tem uma Operação com Potencial`,
    description:
      "Sua empresa já possui uma operação comercial ativa, mas ainda pode estar deixando oportunidades na mesa por falta de processo, acompanhamento e recompra. Existe uma base importante para crescer, mas o próximo passo é transformar essa operação em algo mais previsível e controlado.",
    recommendation:
      "O caminho mais indicado é analisar o comercial, entender onde as oportunidades se perdem e estruturar um processo mais claro para atendimento, acompanhamento e reativação da base.",
    offer: "Análise Comercial com IA",
    color: "#4D9FFF",
    icon: TrendingUp,
  },
  ready: {
    badge: "Pronta para um Novo Canal",
    title: (n) => `${n}, sua empresa está Pronta para um Novo Canal`,
    description:
      "Pelas suas respostas, sua empresa já possui os elementos principais para transformar demanda digital em uma nova fonte de receita. Existe estrutura comercial, potencial de atendimento e espaço para criar um canal de vendas mais previsível, conectando aquisição de clientes, acompanhamento comercial e recompra.",
    recommendation:
      "O próximo passo é entender como estruturar esse canal com clareza: gerar oportunidades qualificadas, acompanhar o que vira venda e aumentar o valor da base ao longo do tempo.",
    offer: "Assessoria de Crescimento para Distribuidoras e Indústrias",
    color: "#C5FF4D",
    icon: Zap,
  },
  scale: {
    badge: "Pronta para Escalar",
    title: (n) => `${n}, sua empresa está Pronta para Escalar`,
    description:
      "Sua empresa já tem estrutura comercial e potencial para escalar um canal de vendas com mais controle, previsibilidade e aumento de LTV. O cenário indica que a operação já possui base para crescer de forma mais estruturada, usando tecnologia, estratégia comercial e acompanhamento de ponta a ponta.",
    recommendation:
      "O próximo passo é conectar aquisição, comercial, dados e recompra para transformar crescimento em uma fonte recorrente de receita.",
    offer: "Assessoria de Crescimento para Distribuidoras e Indústrias",
    color: "#C5FF4D",
    icon: TrendingUp,
  },
};

interface Props {
  answers: QuizAnswers;
  result: ResultType;
}

export default function Screen18Result({ answers, result }: Props) {
  const config = RESULTS[result];
  const Icon = config.icon;

  const waMessage = buildWhatsAppMessage({
    firstName: answers.firstName,
    companyName: answers.companyName,
    result,
    revenue: answers.revenue,
    whatsappUsage: answers.whatsappUsage,
    objective: answers.objective,
  });

  const waUrl = `https://wa.me/${+558695315620}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="flex flex-col py-8 pb-12 gap-6">
      {/* Logo */}
      <div className="flex justify-center pt-4 pb-2">
        <Logo size="md" />
      </div>

      {/* Result card */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: `1px solid ${config.color}33`,
          boxShadow: `0 0 40px ${config.color}15`,
        }}
      >
        {/* Background glow */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{
            background: config.color,
            opacity: 0.07,
            transform: "translate(30%, -30%)",
          }}
        />

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{
            backgroundColor: `${config.color}22`,
            color: config.color,
            border: `1px solid ${config.color}44`,
          }}
        >
          <Icon size={12} style={{ color: config.color }} />
          {config.badge}
        </div>

        <h1
          className="text-xl font-bold leading-tight mb-4"
          style={{ color: "var(--color-text)" }}
        >
          {config.title(answers.firstName)}
        </h1>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {config.description}
        </p>
      </div>

      {/* Recommendation */}
      <div
        className="rounded-xl p-5 flex flex-col gap-3"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: "var(--color-accent)" }} />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            Recomendação
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {config.recommendation}
        </p>
      </div>

      {/* Offer */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: "var(--color-accent-dim)",
          border: "1px solid rgba(197,255,77,0.2)",
        }}
      >
        <Zap
          size={16}
          style={{ color: "var(--color-accent)" }}
          className="shrink-0"
        />
        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Próximo passo sugerido
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {config.offer}
          </p>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full rounded-xl px-6 py-4 text-base font-semibold flex items-center justify-center gap-3 transition-all duration-200 no-underline"
        style={{
          backgroundColor: "#25D366",
          color: "#FFFFFF",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#22c35e")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#25D366")
        }
      >
        <MessageCircle size={20} />
        Falar com a Fonil pelo WhatsApp
      </a>

      {/* Footer */}
      <p
        className="text-center text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        Diagnóstico gerado pela Fonil Company · {new Date().getFullYear()}
      </p>
    </div>
  );
}

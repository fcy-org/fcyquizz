import {
  BarChart3,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface WelcomeCopy {
  /** Identificador enviado no lead (campo variante_quiz). */
  id: string;
  /** Faixa vermelha do topo. `stripHighlight` aparece em destaque no final. */
  strip: string;
  stripHighlight?: string;
  badge: string;
  headline: string;
  subheadline: string;
  bullets: { icon: LucideIcon; label: string }[];
  cta: string;
  footer: string;
}

export const ORIGINAL_COPY: WelcomeCopy = {
  id: 'original',
  strip: 'EXCLUSIVO PARA DISTRIBUIDORAS/INDÚSTRIAS QUE FATURAM MAIS DE R$ 100.000,00',
  badge: 'Agende a sua consultoria',
  headline:
    'Implemente uma nova fonte de aquisição de clientes que não depende de representante na sua distribuidora.',
  subheadline: 'Responda essas perguntas rápidas para receber uma consultoria gratuita com nosso time',
  bullets: [
    { icon: BarChart3, label: 'Análise da estrutura comercial' },
    { icon: TrendingUp, label: 'Mapeamento do potencial de crescimento' },
    { icon: Zap, label: 'Consultoria gratuita para sua empresa' },
  ],
  cta: 'Iniciar cadastro',
  footer: 'Consultoria gratuita · Para distribuidoras e indústrias',
};

export const V32_COPY: WelcomeCopy = {
  id: 'v3.2',
  strip: 'EXCLUSIVO PARA DISTRIBUIDORAS E INDÚSTRIAS QUE FATURAM',
  stripHighlight: 'MAIS DE R$ 100.000,00 REAIS POR MÊS',
  badge: 'Agende uma reunião comercial',
  headline:
    'Gere novas oportunidades de venda para sua distribuidora ou indústria, sem depender apenas dos representantes comerciais.',
  subheadline:
    'Através do Método CODE, implementamos um funil de aquisição que capta lojistas e distribuidores qualificados e com interesse real nos seus produtos, gerando novas oportunidades para seu time de vendas interno.',
  bullets: [
    { icon: UserPlus, label: 'Captação de novos compradores' },
    { icon: Target, label: 'Canal próprio de aquisição' },
    { icon: BarChart3, label: 'Aumento da base de clientes' },
  ],
  cta: 'Solicitar minha reunião Comercial',
  footer: 'Consultoria gratuita · Sujeita à análise de perfil',
};

export const WELCOME_VARIANTS = {
  original: ORIGINAL_COPY,
  v32: V32_COPY,
} satisfies Record<string, WelcomeCopy>;

export type WelcomeVariant = keyof typeof WELCOME_VARIANTS;

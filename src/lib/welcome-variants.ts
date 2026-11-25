import {
  BarChart3,
  MessageCircle,
  TrendingUp,
  Users,
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

export const V31_COPY: WelcomeCopy = {
  id: 'v3.1',
  strip: 'EXCLUSIVO PARA DISTRIBUIDORAS E INDÚSTRIAS COM TIME DE VENDAS INTERNO',
  badge: 'Fale com nosso time comercial',
  headline:
    'Faça novos compradores procurarem sua distribuidora ou indústria interessados em comprar seus produtos, sem depender de representantes comerciais',
  subheadline:
    'Implementamos um funil de aquisição através de anúncios na internet para atrair lojistas e distribuidores interessados nos seus produtos diretamente para o WhatsApp do seu time de vendas.',
  bullets: [
    { icon: Users, label: 'Novos Compradores interessados' },
    { icon: MessageCircle, label: 'Demanda pelo WhatsApp' },
    { icon: TrendingUp, label: 'Mais oportunidades para seu time' },
  ],
  cta: 'Iniciar Cadastro',
  footer: 'Consultoria gratuita · Para empresas B2B',
};

export const WELCOME_VARIANTS = {
  original: ORIGINAL_COPY,
  v31: V31_COPY,
} satisfies Record<string, WelcomeCopy>;

export type WelcomeVariant = keyof typeof WELCOME_VARIANTS;

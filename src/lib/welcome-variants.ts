import {
  BarChart3,
  LayoutDashboard,
  Rocket,
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

export const V33_COPY: WelcomeCopy = {
  id: 'v3.3',
  strip: 'EXCLUSIVO PARA DISTRIBUIDORAS E INDÚSTRIAS COM TIME DE VENDAS INTERNO',
  badge: 'Estruturação comercial B2B',
  headline:
    'Tenha uma estrutura de captação de novos compradores integrada ao time de vendas interno da sua distribuidora ou indústria em 30 dias. Sem depender de representantes comerciais ou lista de prospecção',
  subheadline:
    'Utilizando nossa metodologia, geramos lojistas e distribuidores interessados nos seus produtos, sem depender de lista de prospecção ou representantes comerciais. Em 30 dias estruturamos todo processo e disponibilizamos uma ferramenta de CRM própria para potencializar o time de vendas interno que sua empresa já possui.',
  bullets: [
    { icon: Users, label: 'Aumento da Base de Clientes' },
    { icon: LayoutDashboard, label: 'Implementação de CRM' },
    { icon: Rocket, label: 'Potencialização do time de vendas Interno' },
  ],
  cta: 'Solicitar diagnóstico comercial',
  footer: 'Consultoria gratuita · Sujeita à análise de perfil',
};

export const WELCOME_VARIANTS = {
  original: ORIGINAL_COPY,
  v33: V33_COPY,
} satisfies Record<string, WelcomeCopy>;

export type WelcomeVariant = keyof typeof WELCOME_VARIANTS;

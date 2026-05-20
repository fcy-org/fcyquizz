export function extractFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || '';
}

export function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const calc = (d: string, len: number) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(d[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11);
  };

  return (
    calc(digits, 12) === parseInt(digits[12]) &&
    calc(digits, 13) === parseInt(digits[13])
  );
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateWhatsApp(whatsapp: string): boolean {
  const digits = whatsapp.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

export function validateFullName(name: string): boolean {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every(p => p.length >= 2);
}

export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function cleanCNPJ(value: string): string {
  return value.replace(/\D/g, '');
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trimStart()
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function buildWhatsAppMessage(answers: {
  firstName: string;
  companyName: string;
  result: string;
  revenue: string;
  whatsappUsage: string;
  objective: string;
}): string {
  const revenueLabels: Record<string, string> = {
    'up_100k': 'até R$100 mil/mês',
    '100k_300k': 'entre R$100 mil e R$300 mil/mês',
    '300k_700k': 'entre R$300 mil e R$700 mil/mês',
    '700k_1m': 'entre R$700 mil e R$1 milhão/mês',
    'above_1m': 'acima de R$1 milhão/mês',
  };

  const objectiveLabels: Record<string, string> = {
    'new_clients': 'gerar novos clientes todos os meses',
    'sell_more_base': 'vender mais para a base atual',
    'new_regions': 'entrar em novas regiões',
    'organize_commercial': 'organizar o comercial',
    'new_predictable_channel': 'criar um novo canal previsível de vendas',
    'all': 'todos os anteriores',
  };

  const resultLabels: Record<string, string> = {
    'beginning': 'Começo da Estrutura',
    'potential': 'Operação com Potencial',
    'ready': 'Pronta para um Novo Canal',
    'scale': 'Pronta para Escalar',
  };

  return `Olá, concluí o diagnóstico da Fonil. Meu resultado foi: ${resultLabels[answers.result] || answers.result}. Minha empresa é ${answers.companyName}, faturamos ${revenueLabels[answers.revenue] || answers.revenue} e meu principal objetivo hoje é ${objectiveLabels[answers.objective] || answers.objective}. Quero entender qual seria o melhor caminho para nossa operação.`;
}

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const tracking: Record<string, string> = {};

  // UTMs
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const val = params.get(key);
    if (val) tracking[key] = val;
  });

  // fbclid raw
  const fbclid = params.get('fbclid');
  if (fbclid) tracking['fbclid'] = fbclid;

  // Facebook fbc — from cookie or built from fbclid
  let fbc = getCookie('_fbc');
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  if (fbc) tracking['fbc'] = fbc;

  // Facebook fbp — browser ID cookie set by Pixel
  const fbp = getCookie('_fbp');
  if (fbp) tracking['fbp'] = fbp;

  return tracking;
}

export function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

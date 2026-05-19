// Mapeamento de valores internos → labels em português para envio ao CRM/Sheets

const OPERATION_TYPE: Record<string, string> = {
  distribuidora: 'Distribuidora',
  industria: 'Indústria',
  atacado: 'Atacado',
  representacao: 'Representação comercial',
};

const SEGMENT: Record<string, string> = {
  alimentos_bebidas: 'Alimentos e bebidas',
  farmacia_cosmeticos: 'Farmácia, cosméticos ou higiene',
  construcao_eletrico: 'Construção, material elétrico ou ferragens',
  moda_calcados: 'Moda, confecção ou calçados',
  autopecas: 'Autopeças ou peças em geral',
  maquinas_equipamentos: 'Máquinas, equipamentos ou suprimentos',
};

const AUDIENCE: Record<string, string> = {
  lojistas: 'Lojistas e revendedores',
  empresas: 'Empresas e compradores corporativos',
  mercados: 'Mercados, farmácias ou pontos comerciais',
  representantes: 'Representantes ou parceiros comerciais',
  consumidor_final: 'Consumidor final',
  misto: 'Misto: vendemos para empresas e consumidor final',
};

const REVENUE: Record<string, string> = {
  up_100k: 'Até R$100 mil/mês',
  '100k_300k': 'Entre R$100 mil e R$300 mil/mês',
  '300k_700k': 'Entre R$300 mil e R$700 mil/mês',
  '700k_1m': 'Entre R$700 mil e R$1 milhão/mês',
  above_1m: 'Acima de R$1 milhão/mês',
};

const WHATSAPP_USAGE: Record<string, string> = {
  main_channel: 'Sim, é um dos principais canais comerciais',
  uses_unorganized: 'Sim, usamos bastante, mas ainda sem muita organização',
  little_support: 'Usamos pouco, apenas como apoio ao comercial',
  not_using: 'Ainda não usamos WhatsApp como canal comercial',
  dont_know: 'Não sei dizer',
};

const COMMERCIAL_SIZE: Record<string, string> = {
  only_1: 'Apenas 1 pessoa',
  '2_3': '2 a 3 pessoas',
  '4_6': '4 a 6 pessoas',
  '7_10': '7 a 10 pessoas',
  more_10: 'Mais de 10 pessoas',
};

const CLIENT_SOURCE: Record<string, string> = {
  referral: 'Indicação',
  old_clients: 'Carteira antiga de clientes',
  reps: 'Representantes comerciais',
  prospection: 'Prospecção ativa',
  ads: 'Anúncios na internet',
  social: 'Redes sociais / conteúdo',
  no_predictable: 'Não temos uma fonte previsível de novos clientes',
};

const MARKETING: Record<string, string> = {
  yes_know_sales: 'Sim, e conseguimos saber quais vendas vieram disso',
  yes_dont_know: 'Sim, mas não sabemos exatamente o que virou venda',
  stopped: 'Já investimos, mas paramos por falta de resultado',
  not_yet: 'Ainda não investimos',
  thinking: 'Estamos pensando em começar',
};

const TRACK_SALES: Record<string, string> = {
  clearly: 'Sim, com clareza',
  partially: 'Parcialmente',
  salesperson_reports: 'Só quando o vendedor informa',
  spread_out: 'Não, fica espalhado',
  not_measure: 'Não medimos isso hoje',
};

const REPURCHASE: Record<string, string> = {
  clear_routine: 'Sim, temos uma rotina clara',
  sometimes: 'Fazemos às vezes',
  per_salesperson: 'Depende de cada vendedor',
  not_organized: 'Não fazemos de forma organizada',
  dont_know: 'Não sei dizer',
};

const CAPACITY: Record<string, string> = {
  yes_team_process: 'Sim, temos equipe e processo',
  yes_need_organize: 'Sim, mas precisaríamos organizar melhor',
  maybe_depends: 'Talvez, dependeria do volume',
  could_not: 'Hoje não conseguiríamos',
  dont_know: 'Não sei dizer',
};

const OBJECTIVE: Record<string, string> = {
  new_clients: 'Gerar novos clientes todos os meses',
  sell_more_base: 'Vender mais para a base atual',
  new_regions: 'Entrar em novas regiões',
  organize_commercial: 'Organizar o comercial',
  new_predictable_channel: 'Criar um novo canal previsível de vendas',
  all: 'Todos os anteriores',
};

const RESULT: Record<string, string> = {
  beginning: 'Começo da Estrutura',
  potential: 'Operação com Potencial',
  ready: 'Pronta para um Novo Canal',
  scale: 'Pronta para Escalar',
};

function label(map: Record<string, string>, value: string, fallback = value): string {
  return map[value] ?? fallback;
}

export { label, OPERATION_TYPE, SEGMENT, AUDIENCE, REVENUE, WHATSAPP_USAGE, COMMERCIAL_SIZE, CLIENT_SOURCE, MARKETING, TRACK_SALES, REPURCHASE, CAPACITY, OBJECTIVE, RESULT };

import type { QuizAnswers, ResultType } from './types';

export function calculateScore(answers: QuizAnswers): number {
  let score = 0;

  // Step 2 - Operation type (ICP fit)
  if (['distribuidora', 'industria', 'atacado'].includes(answers.operationType)) {
    score += 3;
  }

  // Step 4 - Audience (B2B check)
  if (['lojistas', 'empresas', 'mercados', 'representantes'].includes(answers.audience)) {
    score += 2;
  } else if (answers.audience === 'misto') {
    score += 1;
  }

  // Step 5 - Revenue
  switch (answers.revenue) {
    case 'above_1m': score += 5; break;
    case '700k_1m': score += 4; break;
    case '300k_700k': score += 3; break;
    case '100k_300k': score += 1; break;
  }

  // Step 7 - WhatsApp usage
  switch (answers.whatsappUsage) {
    case 'main_channel': score += 3; break;
    case 'uses_unorganized': score += 2; break;
    case 'little_support': score += 1; break;
  }

  // Step 8 - Commercial team size
  switch (answers.commercialSize) {
    case 'more_10': score += 4; break;
    case '7_10': score += 3; break;
    case '4_6': score += 2; break;
    case '2_3': score += 1; break;
  }

  // Step 9 - Client source
  if (['prospection', 'ads', 'social'].includes(answers.clientSource)) {
    score += 2;
  } else if (['referral', 'old_clients', 'reps'].includes(answers.clientSource)) {
    score += 1;
  } else if (answers.clientSource === 'no_predictable') {
    score -= 1;
  }

  // Step 10 - Marketing investment
  switch (answers.marketing) {
    case 'yes_know_sales': score += 3; break;
    case 'yes_dont_know': score += 2; break;
    case 'thinking': score += 1; break;
  }

  // Step 12 - Sales tracking
  switch (answers.trackSales) {
    case 'clearly': score += 2; break;
    case 'partially': score += 1; break;
  }

  // Step 13 - Repurchase
  switch (answers.repurchase) {
    case 'clear_routine': score += 2; break;
    case 'sometimes': score += 1; break;
  }

  // Step 14 - Capacity
  switch (answers.capacity) {
    case 'yes_team_process': score += 2; break;
    case 'yes_need_organize': score += 1; break;
  }

  // Step 15 - Objective
  if (['new_clients', 'new_predictable_channel', 'all'].includes(answers.objective)) {
    score += 2;
  }

  return score;
}

export function calculateResult(answers: QuizAnswers): ResultType {
  const score = calculateScore(answers);

  // Also check hard ICP criteria
  const isHighRevenue = ['300k_700k', '700k_1m', 'above_1m'].includes(answers.revenue);
  const isVeryHighRevenue = ['700k_1m', 'above_1m'].includes(answers.revenue);
  const usesWhatsApp = ['main_channel', 'uses_unorganized'].includes(answers.whatsappUsage);
  const hasTeam = !['only_1'].includes(answers.commercialSize);

  if (score >= 20 || (isVeryHighRevenue && usesWhatsApp && hasTeam)) {
    return 'scale';
  }
  if (score >= 14 || (isHighRevenue && usesWhatsApp)) {
    return 'ready';
  }
  if (score >= 8) {
    return 'potential';
  }
  return 'beginning';
}

export function getQualificationLevel(result: ResultType): string {
  switch (result) {
    case 'scale': return 'ICP Quente - Pronta para Escalar';
    case 'ready': return 'ICP Forte - Pronta para um Novo Canal';
    case 'potential': return 'ICP Médio - Operação com Potencial';
    case 'beginning': return 'ICP em Desenvolvimento - Começo da Estrutura';
  }
}

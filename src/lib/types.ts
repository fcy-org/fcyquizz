export type ResultType = 'beginning' | 'potential' | 'ready' | 'scale';

export interface QuizAnswers {
  // Step 1
  fullName: string;
  firstName: string;
  // Step 2
  operationType: string;
  operationTypeOther: string;
  // Step 3
  segment: string;
  segmentOther: string;
  // Step 4
  audience: string;
  // Step 5
  revenue: string;
  // Step 7
  whatsappUsage: string;
  // Step 8
  commercialSize: string;
  // Step 9
  clientSource: string;
  // Step 10
  marketing: string;
  // Step 12
  trackSales: string;
  // Step 13
  repurchase: string;
  // Step 14
  capacity: string;
  // Step 15
  objective: string;
  // Step 16
  companyName: string;
  whatsapp: string;
  whatsappClean: string;
  email: string;
  cnpj: string;
  cnpjClean: string;
  city: string;
  state: string;
  role: string;
  roleOther: string;
  privacyConsent: boolean;
}

export interface QuizState {
  currentStep: number;
  answers: QuizAnswers;
  result: ResultType | null;
  isSubmitting: boolean;
  utmParams: Record<string, string>;
}

export const INITIAL_ANSWERS: QuizAnswers = {
  fullName: '',
  firstName: '',
  operationType: '',
  operationTypeOther: '',
  segment: '',
  segmentOther: '',
  audience: '',
  revenue: '',
  whatsappUsage: '',
  commercialSize: '',
  clientSource: '',
  marketing: '',
  trackSales: '',
  repurchase: '',
  capacity: '',
  objective: '',
  companyName: '',
  whatsapp: '',
  whatsappClean: '',
  email: '',
  cnpj: '',
  cnpjClean: '',
  city: '',
  state: '',
  role: '',
  roleOther: '',
  privacyConsent: false,
};

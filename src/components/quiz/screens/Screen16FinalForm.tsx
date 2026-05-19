'use client';

import { useState } from 'react';
import { type QuizAnswers } from '@/lib/types';
import {
  formatWhatsApp, formatCNPJ, validateCNPJ, validateEmail,
  validateWhatsApp, cleanPhone, cleanCNPJ, capitalizeWords,
} from '@/lib/utils';
import QuizInput from '../QuizInput';
import QuizButton from '../QuizButton';

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

const ROLES = [
  { value: 'socio_dono', label: 'Sócio / Dono' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'gerente_comercial', label: 'Gerente comercial' },
  { value: 'gerente_marketing', label: 'Gerente de marketing' },
  { value: 'coordenador_comercial', label: 'Coordenador comercial' },
  { value: 'analista', label: 'Analista' },
  { value: 'outro', label: 'Outro' },
];

interface Props {
  answers: QuizAnswers;
  updateAnswers: (u: Partial<QuizAnswers>) => void;
  next: () => void;
  back: () => void;
  onSubmit: () => void;
}

interface Errors {
  companyName?: string;
  whatsapp?: string;
  email?: string;
  cnpj?: string;
  city?: string;
  state?: string;
  role?: string;
  roleOther?: string;
  consent?: string;
}

export default function Screen16FinalForm({ answers, updateAnswers, onSubmit }: Props) {
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!answers.companyName.trim()) e.companyName = 'Informe o nome da empresa.';
    if (!answers.whatsapp.trim()) e.whatsapp = 'Informe seu WhatsApp.';
    else if (!validateWhatsApp(answers.whatsapp)) e.whatsapp = 'WhatsApp inválido. Informe DDD + número.';
    if (!answers.email.trim()) e.email = 'Informe seu e-mail.';
    else if (!validateEmail(answers.email)) e.email = 'Formato de e-mail inválido.';
    if (!answers.cnpj.trim()) e.cnpj = 'Informe o CNPJ.';
    else if (!validateCNPJ(answers.cnpj)) e.cnpj = 'CNPJ inválido.';
    if (!answers.city.trim()) e.city = 'Informe a cidade.';
    if (!answers.state) e.state = 'Selecione o estado.';
    if (!answers.role) e.role = 'Selecione seu cargo.';
    if (answers.role === 'outro' && !answers.roleOther.trim()) e.roleOther = 'Informe seu cargo.';
    if (!answers.privacyConsent) e.consent = 'Aceite o termo para continuar.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  const field = (key: keyof Errors) => errors[key];

  return (
    <div className="flex flex-col gap-6 py-8 pb-12">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
          {answers.firstName}, agora falta pouco.
        </p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
          Preencha os dados abaixo para liberar seu diagnóstico.
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Company name */}
        <QuizInput
          label="Nome da empresa *"
          placeholder="Ex: Distribuidora Silva Ltda"
          value={answers.companyName}
          error={field('companyName')}
          onChange={e => { updateAnswers({ companyName: e.target.value }); setErrors(p => ({ ...p, companyName: undefined })); }}
          autoComplete="organization"
        />

        {/* WhatsApp */}
        <QuizInput
          label="WhatsApp *"
          placeholder="(86) 99999-9999"
          value={answers.whatsapp}
          error={field('whatsapp')}
          inputMode="tel"
          onChange={e => {
            const formatted = formatWhatsApp(e.target.value);
            updateAnswers({ whatsapp: formatted, whatsappClean: cleanPhone(formatted) });
            setErrors(p => ({ ...p, whatsapp: undefined }));
          }}
          autoComplete="tel"
        />

        {/* Email */}
        <QuizInput
          label="E-mail *"
          placeholder="seu@email.com.br"
          value={answers.email}
          error={field('email')}
          type="email"
          inputMode="email"
          onChange={e => { updateAnswers({ email: e.target.value.trim() }); setErrors(p => ({ ...p, email: undefined })); }}
          autoComplete="email"
        />

        {/* CNPJ */}
        <QuizInput
          label="CNPJ *"
          placeholder="00.000.000/0000-00"
          value={answers.cnpj}
          error={field('cnpj')}
          inputMode="numeric"
          onChange={e => {
            const formatted = formatCNPJ(e.target.value);
            updateAnswers({ cnpj: formatted, cnpjClean: cleanCNPJ(formatted) });
            setErrors(p => ({ ...p, cnpj: undefined }));
          }}
        />

        {/* City */}
        <QuizInput
          label="Cidade *"
          placeholder="Ex: Teresina"
          value={answers.city}
          error={field('city')}
          onChange={e => { updateAnswers({ city: capitalizeWords(e.target.value) }); setErrors(p => ({ ...p, city: undefined })); }}
          autoComplete="address-level2"
        />

        {/* State */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Estado *
          </label>
          <select
            value={answers.state}
            onChange={e => { updateAnswers({ state: e.target.value }); setErrors(p => ({ ...p, state: undefined })); }}
            className="w-full rounded-xl px-4 py-4 text-base outline-none transition-all duration-200 appearance-none"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border: `1px solid ${field('state') ? 'var(--color-error)' : 'var(--color-border)'}`,
              color: answers.state ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
          >
            <option value="" disabled>Selecione o estado</option>
            {ESTADOS.map(uf => (
              <option key={uf} value={uf} style={{ backgroundColor: '#1E1E1E', color: '#fff' }}>
                {uf}
              </option>
            ))}
          </select>
          {field('state') && <p className="text-sm mt-1.5" style={{ color: 'var(--color-error)' }}>{field('state')}</p>}
        </div>

        {/* Role */}
        <div className="w-full">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
            Cargo *
          </label>
          <select
            value={answers.role}
            onChange={e => { updateAnswers({ role: e.target.value }); setErrors(p => ({ ...p, role: undefined })); }}
            className="w-full rounded-xl px-4 py-4 text-base outline-none transition-all duration-200 appearance-none"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              border: `1px solid ${field('role') ? 'var(--color-error)' : 'var(--color-border)'}`,
              color: answers.role ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
          >
            <option value="" disabled>Selecione seu cargo</option>
            {ROLES.map(r => (
              <option key={r.value} value={r.value} style={{ backgroundColor: '#1E1E1E', color: '#fff' }}>
                {r.label}
              </option>
            ))}
          </select>
          {field('role') && <p className="text-sm mt-1.5" style={{ color: 'var(--color-error)' }}>{field('role')}</p>}
        </div>

        {/* Role other */}
        {answers.role === 'outro' && (
          <QuizInput
            label="Qual é o seu cargo? *"
            placeholder="Ex: Coordenador de operações"
            value={answers.roleOther}
            error={field('roleOther')}
            onChange={e => { updateAnswers({ roleOther: e.target.value }); setErrors(p => ({ ...p, roleOther: undefined })); }}
            autoFocus
          />
        )}

        {/* Consent */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={answers.privacyConsent}
                onChange={e => { updateAnswers({ privacyConsent: e.target.checked }); setErrors(p => ({ ...p, consent: undefined })); }}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded flex items-center justify-center transition-all"
                style={{
                  backgroundColor: answers.privacyConsent ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  border: `2px solid ${answers.privacyConsent ? 'var(--color-accent)' : field('consent') ? 'var(--color-error)' : 'var(--color-border)'}`,
                }}
              >
                {answers.privacyConsent && (
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6l3 3 5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Aceito receber meu diagnóstico e autorizo o contato da Fonil com base nas informações enviadas.
            </span>
          </label>
          {field('consent') && (
            <p className="text-sm ml-8" style={{ color: 'var(--color-error)' }}>{field('consent')}</p>
          )}
          <p className="text-xs ml-8" style={{ color: 'var(--color-text-muted)' }}>
            Seus dados são protegidos. <span style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>Política de Privacidade</span>
          </p>
        </div>
      </div>

      <QuizButton onClick={handleSubmit} loading={loading}>
        Ver meu diagnóstico
      </QuizButton>
    </div>
  );
}

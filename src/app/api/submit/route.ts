import { NextRequest, NextResponse } from 'next/server';

const CRM_URL = 'https://newtracking-sales-sys.vercel.app/api/public/leads';
const CRM_KEY = process.env.CRM_LEAD_CAPTURE_KEY || 'xnhk218ib9voq5j7vd4o2uet';

// Google Apps Script executes doPost on the FIRST POST request before returning 302.
// The redirect URL only serves the response (GET). So we just follow with default redirect
// and the script will have already run when the 302 was issued.
async function postToGoogleScript(url: string, body: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    // redirect: 'follow' (default) — Apps Script runs doPost before the 302, then we follow to get the response
  });
  return { ok: res.ok, status: res.status };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const payload = { ...body, timestamp };
    const payloadStr = JSON.stringify(payload);

    const errors: string[] = [];

    // 1. Google Sheets (via Google Apps Script — redirect manual para preservar POST)
    const sheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      try {
        const result = await postToGoogleScript(sheetsUrl, payloadStr);
        if (!result.ok) errors.push(`Sheets: ${result.status}`);
      } catch (e) {
        errors.push(`Sheets: ${e instanceof Error ? e.message : 'unknown'}`);
      }
    }

    // 2. CRM — newtracking-sales-sys
    try {
      const crmBody = JSON.stringify({
        // Dados pessoais e da empresa (formulário final)
        name: payload.nome_completo || '',
        first_name: payload.primeiro_nome || '',
        phone: payload.whatsapp_limpo || '',
        phone_formatted: payload.whatsapp || '',
        email: payload.email || '',
        cnpj: payload.cnpj || '',
        cnpj_raw: payload.cnpj_limpo || '',
        empresa: payload.empresa || '',
        cidade: payload.cidade || '',
        estado: payload.estado || '',
        cargo: payload.cargo || '',
        // Resultado do diagnóstico
        resultado_diagnostico: payload.resultado_diagnostico || '',
        nivel_qualificacao: payload.nivel_qualificacao || '',
        // Rastreamento
        event_id: payload.event_id || '',
        fbclid: payload.fbclid || '',
        fbc: payload.fbc || '',
        fbp: payload.fbp || '',
        utm_source: payload.utm_source || '',
        utm_medium: payload.utm_medium || '',
        utm_campaign: payload.utm_campaign || '',
        utm_content: payload.utm_content || '',
        utm_term: payload.utm_term || '',
        url_pagina: payload.url_pagina || '',
        dispositivo: payload.dispositivo || '',
      });

      const res = await fetch(CRM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lead-capture-key': CRM_KEY,
        },
        body: crmBody,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => String(res.status));
        errors.push(`CRM: ${res.status} — ${text.slice(0, 200)}`);
      }
    } catch (e) {
      errors.push(`CRM: ${e instanceof Error ? e.message : 'unknown'}`);
    }

    return NextResponse.json({
      success: true,
      warnings: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error('Submit error:', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

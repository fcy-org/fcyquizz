import { NextRequest, NextResponse } from 'next/server';
import { sendMetaLead } from './meta-conversions';

export const runtime = 'nodejs';

// Definida em .env.local / variáveis da hospedagem (a URL contém um token)
const SUPABASE_WEBHOOK_URL = process.env.WEBHOOK_SUPABASE_URL;

async function postWebhook(url: string, name: string, payload: Record<string, string>) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`Webhook ${name} error: ${res.status}`);
      return false;
    }

    const result = await res.json().catch(() => null);
    if (result?.success === false) {
      console.error(`Webhook ${name} rejected the submission.`);
      return false;
    }

    return true;
  } catch {
    console.error(`Webhook ${name} request failed.`);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const webhookUrl = process.env.WEBHOOK_LEADS_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { success: false, crm_received: false, error: 'CRM is not configured' },
        { status: 503 },
      );
    }

    const body = await req.json();
    if (typeof body.event_id !== 'string' || !body.event_id.trim()) {
      return NextResponse.json(
        { success: false, crm_received: false, error: 'Missing event ID' },
        { status: 400 },
      );
    }

    const raw: Record<string, string> = {
      // ── Campos padrão reconhecidos pelo CRM ──────────────────────────────
      phone:          body.whatsapp_limpo      ?? '',
      name:           body.nome_completo       ?? '',
      email:          body.email               ?? '',
      document:       body.cnpj_limpo          ?? '',
      city:           body.cidade              ?? '',
      state:          body.estado              ?? '',
      pipeline_stage: body.nivel_qualificacao  ?? '',

      // ── Campos extras → vão automaticamente para Observações no CRM ──────
      empresa:                  body.empresa                ?? '',
      cargo:                    body.cargo                  ?? '',
      resultado_diagnostico:    body.resultado_diagnostico  ?? '',
      tipo_operacao:            body.tipo_operacao          ?? '',
      segmento:                 body.segmento               ?? '',
      publico_atendido:         body.publico_atendido       ?? '',
      faturamento:              body.faturamento            ?? '',
      uso_whatsapp:             body.uso_whatsapp           ?? '',
      equipe_comercial:         body.tamanho_comercial      ?? '',
      origem_clientes:          body.origem_clientes        ?? '',
      investimento_marketing:   body.investimento_marketing ?? '',
      rastreio_vendas:          body.rastreio_vendas        ?? '',
      recompra:                 body.recompra               ?? '',
      capacidade_atendimento:   body.capacidade             ?? '',
      objetivo_principal:       body.objetivo               ?? '',
      utm_source:               body.utm_source             ?? '',
      utm_medium:               body.utm_medium             ?? '',
      utm_campaign:             body.utm_campaign           ?? '',
      utm_content:              body.utm_content            ?? '',
      utm_term:                 body.utm_term               ?? '',
      event_id:                 body.event_id,
      fbclid:                   body.fbclid                 ?? '',
      fbc:                      body.fbc                    ?? '',
      fbp:                      body.fbp                    ?? '',
      url_pagina:               body.url_pagina             ?? '',
      dispositivo:              body.dispositivo            ?? '',
    };

    // Remove campos vazios antes de enviar
    const payload = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v.trim() !== '')
    );

    const targets = [{ name: 'CRM', url: webhookUrl }];
    if (SUPABASE_WEBHOOK_URL && SUPABASE_WEBHOOK_URL !== webhookUrl) {
      targets.push({ name: 'Supabase', url: SUPABASE_WEBHOOK_URL });
    }
    const [crmReceived] = await Promise.all(targets.map(t => postWebhook(t.url, t.name, payload)));

    if (!crmReceived) {
      return NextResponse.json(
        { success: false, crm_received: false, error: 'CRM submission failed' },
        { status: 502 },
      );
    }

    const metaSent = await sendMetaLead(body, req);
    return NextResponse.json({ success: true, crm_received: true, meta_sent: metaSent });
  } catch {
    console.error('Submit request failed.');
    return NextResponse.json({ success: false, crm_received: false, error: 'Internal error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL =
  process.env.WEBHOOK_LEADS_URL ||
  'https://newtracking-sales-sys.vercel.app/api/webhooks/leads/cmpylrvkv000376i6bzhsl1lo';

// Definida em .env.local / variáveis da hospedagem (a URL contém um token)
const SUPABASE_WEBHOOK_URL = process.env.WEBHOOK_SUPABASE_URL;

async function postWebhook(url: string, name: string, payload: Record<string, string>) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => String(res.status));
      console.error(`Webhook ${name} error: ${res.status} — ${text.slice(0, 200)}`);
    }
  } catch (e) {
    console.error(`Webhook ${name} failed:`, e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
      url_pagina:               body.url_pagina             ?? '',
      dispositivo:              body.dispositivo            ?? '',
    };

    // Remove campos vazios antes de enviar
    const payload = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v.trim() !== '')
    );

    const targets = [{ name: 'CRM', url: WEBHOOK_URL }];
    if (SUPABASE_WEBHOOK_URL) targets.push({ name: 'Supabase', url: SUPABASE_WEBHOOK_URL });
    await Promise.all(targets.map(t => postWebhook(t.url, t.name, payload)));

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Submit error:', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

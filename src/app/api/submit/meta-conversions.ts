import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

type LeadData = Record<string, unknown> & { event_id: string };

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function hash(value: string): string[] {
  return [createHash('sha256').update(value).digest('hex')];
}

function normalizeName(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
}

function cookie(request: Request, name: string): string {
  const entry = request.headers.get('cookie')?.split(';').map(value => value.trim())
    .find(value => value.startsWith(`${name}=`));
  if (!entry) return '';
  try {
    return decodeURIComponent(entry.slice(name.length + 1));
  } catch {
    return '';
  }
}

export async function sendMetaLead(body: LeadData, request: Request): Promise<boolean> {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1014610764961858';
  const apiVersion = process.env.META_GRAPH_API_VERSION || 'v26.0';

  if (!accessToken) {
    console.error('Meta Conversions API is not configured.');
    return false;
  }

  try {
    const userData: Record<string, string | string[]> = { country: hash('br') };
    const email = text(body.email).toLowerCase();
    let phone = text(body.whatsapp_limpo || body.whatsapp).replace(/\D/g, '');
    if (phone.length === 10 || phone.length === 11) phone = `55${phone}`;
    const names = text(body.nome_completo).split(/\s+/).filter(Boolean);
    const firstName = normalizeName(names[0] || text(body.primeiro_nome));
    const lastName = normalizeName(names.length > 1 ? names.slice(1).join(' ') : '');
    const city = normalizeName(text(body.cidade));
    const state = normalizeName(text(body.estado));

    if (email) userData.em = hash(email);
    if (phone) userData.ph = hash(phone);
    if (firstName) userData.fn = hash(firstName);
    if (lastName) userData.ln = hash(lastName);
    if (city) userData.ct = hash(city);
    if (state) userData.st = hash(state);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || text(body.navegador);
    const fbp = cookie(request, '_fbp') || text(body.fbp);
    const fbc = cookie(request, '_fbc') || text(body.fbc)
      || (text(body.fbclid) ? `fb.1.${Date.now()}.${text(body.fbclid)}` : '');
    if (isIP(ip)) userData.client_ip_address = ip;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const customData = Object.fromEntries(
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        .map(key => [key, text(body[key])])
        .filter(([, value]) => value !== ''),
    );
    const event = {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      action_source: 'website',
      event_source_url: text(body.url_pagina) || request.headers.get('referer') || new URL(request.url).origin,
      user_data: userData,
      custom_data: { content_name: 'Consultoria gratuita', ...customData },
    };
    const testEventCode = process.env.META_TEST_EVENT_CODE;
    const response = await fetch(`https://graph.facebook.com/${apiVersion}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        data: [event],
        ...(testEventCode ? { test_event_code: testEventCode } : {}),
      }),
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !(result?.events_received > 0)) {
      console.error('Meta Conversions API rejected the event.', {
        status: response.status,
        code: result?.error?.code,
      });
      return false;
    }
    return true;
  } catch {
    console.error('Meta Conversions API request failed.');
    return false;
  }
}

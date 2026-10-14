import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as nextServer from 'next/server.js';
import * as crypto from 'node:crypto';
import * as net from 'node:net';

const CRM_URL = 'https://crm.example.test/leads';
const BACKUP_URL = 'https://backup.example.test/leads';
const payload = {
  event_id: 'test-lead-event',
  nome_completo: 'Test Lead',
  empresa: 'Test Company',
  whatsapp_limpo: '11900000000',
  email: 'test@example.test',
  cidade: 'São Paulo',
  estado: 'SP',
  url_pagina: 'https://quiz.example.test/?utm_source=ig',
  utm_source: 'ig',
};

function loadModule(relativePath, globals) {
  const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const compiledModule = { exports: {} };
  vm.runInNewContext(outputText, {
    module: compiledModule,
    exports: compiledModule.exports,
    console: { error() {} },
    URL,
    AbortSignal,
    require(specifier) {
      if (specifier === 'next/server') return nextServer;
      if (specifier === 'node:crypto') return crypto;
      if (specifier === 'node:net') return net;
      if (specifier === './meta-conversions') {
        return loadModule('../src/app/api/submit/meta-conversions.ts', globals);
      }
      throw new Error(`Unexpected import: ${specifier}`);
    },
    ...globals,
  }, { filename: relativePath });
  return compiledModule.exports;
}

function harness({ crm, backup, meta, apiResponse, pixel, missingPixel = false, env = {}, requestHeaders = {} } = {}) {
  const pixelCalls = [];
  const webhookCalls = [];
  const apiResponses = [];
  const metaCalls = [];
  const { POST } = loadModule('../src/app/api/submit/route.ts', {
    process: { env: {
      WEBHOOK_LEADS_URL: CRM_URL,
      WEBHOOK_SUPABASE_URL: BACKUP_URL,
      META_ACCESS_TOKEN: 'test-meta-access-token',
      NEXT_PUBLIC_META_PIXEL_ID: '123456789',
      META_GRAPH_API_VERSION: 'v26.0',
      ...env,
    } },
    fetch: async (url, options) => {
      if (url.startsWith('https://graph.facebook.com/')) {
        metaCalls.push({ url, payload: JSON.parse(options.body) });
        return meta ? meta() : Response.json({ events_received: 1 });
      }
      webhookCalls.push({ url, payload: JSON.parse(options.body) });
      if (url === CRM_URL) return crm ? crm() : Response.json({ success: true });
      if (url === BACKUP_URL) return backup ? backup() : Response.json({ success: true });
      throw new Error(`Unexpected request: ${url}`);
    },
  });
  const { submitLead } = loadModule('../src/lib/lead-submit.ts', {
    window: {
      fbq: missingPixel ? undefined : pixel || ((...args) => pixelCalls.push(args)),
    },
    fetch: async (url, options) => {
      assert.equal(url, '/api/submit');
      if (apiResponse) return apiResponse();
      const response = await POST(new Request('https://quiz.example.test/api/submit', {
        ...options,
        headers: { ...options.headers, ...requestHeaders },
      }));
      apiResponses.push({ status: response.status, body: await response.clone().json() });
      return response;
    },
  });
  return { submitLead, pixelCalls, webhookCalls, apiResponses, metaCalls };
}

test('Lead fires once after a confirmed CRM submission, with the submission event ID', async () => {
  const h = harness();
  await h.submitLead(payload);
  assert.equal(h.pixelCalls.length, 1);
  const [action, event, parameters, options] = h.pixelCalls[0];
  assert.equal(action, 'track');
  assert.equal(event, 'Lead');
  assert.equal(options.eventID, payload.event_id);
  assert.equal(Object.keys(parameters).length, 0);
  assert.equal(h.webhookCalls.find(call => call.url === CRM_URL).payload.name, payload.nome_completo);
  assert.deepEqual(h.apiResponses[0], {
    status: 200, body: { success: true, crm_received: true, meta_sent: true },
  });
  assert.equal(h.metaCalls.length, 1);
  assert.equal(h.metaCalls[0].payload.data[0].event_id, options.eventID);
  assert.equal(h.metaCalls[0].payload.data[0].event_name, event);
});

test('Lead does not fire while the CRM acknowledgement is pending', async () => {
  let acknowledge;
  const crmResponse = new Promise(resolve => { acknowledge = resolve; });
  const h = harness({ crm: () => crmResponse });
  const pending = h.submitLead(payload);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.pixelCalls.length, 0);
  assert.equal(h.metaCalls.length, 0);
  acknowledge(Response.json({ success: true }));
  await pending;
  assert.equal(h.pixelCalls.length, 1);
});

test('CRM HTTP failure blocks Lead even when the backup succeeds', async () => {
  const h = harness({ crm: () => Response.json({ error: 'Rejected' }, { status: 500 }) });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.pixelCalls.length, 0);
  assert.equal(h.apiResponses[0].status, 502);
  assert.equal(h.apiResponses[0].body.crm_received, false);
  assert.equal(h.metaCalls.length, 0);
});

test('CRM rejection in a successful HTTP response blocks Lead', async () => {
  const h = harness({ crm: () => Response.json({ success: false }) });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.pixelCalls.length, 0);
  assert.equal(h.apiResponses[0].status, 502);
  assert.equal(h.metaCalls.length, 0);
});

test('CRM network failure blocks Lead', async () => {
  const h = harness({ crm: () => { throw new Error('Network unavailable'); } });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.pixelCalls.length, 0);
  assert.equal(h.metaCalls.length, 0);
});

test('Backup failure does not block Lead when the CRM confirms receipt', async () => {
  const h = harness({ backup: () => { throw new Error('Backup unavailable'); } });
  await h.submitLead(payload);
  assert.equal(h.pixelCalls.length, 1);
  assert.equal(h.apiResponses[0].body.crm_received, true);
});

test('An API response without explicit CRM confirmation does not count as Lead', async () => {
  const h = harness({ apiResponse: () => Response.json({ success: true }) });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.pixelCalls.length, 0);
});

test('An HTTP error cannot fire Lead even if its body claims success', async () => {
  const h = harness({
    apiResponse: () => Response.json({ success: true, crm_received: true }, { status: 502 }),
  });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.pixelCalls.length, 0);
});

test('Invalid API JSON and transport failures do not fire Lead', async () => {
  for (const apiResponse of [
    () => new Response('Not JSON'),
    () => { throw new Error('Transport unavailable'); },
  ]) {
    const h = harness({ apiResponse });
    await assert.rejects(h.submitLead(payload));
    assert.equal(h.pixelCalls.length, 0);
  }
});

test('A missing or throwing pixel does not turn a saved lead into a submission failure', async () => {
  for (const options of [
    { missingPixel: true },
    { pixel: () => { throw new Error('Pixel blocked'); } },
  ]) {
    const h = harness(options);
    await h.submitLead(payload);
    assert.equal(h.apiResponses[0].body.crm_received, true);
    assert.equal(h.metaCalls.length, 1);
  }
});

test('CAPI hashes normalized contact data and keeps click identifiers unhashed', async () => {
  const h = harness({ requestHeaders: {
    cookie: '_fbp=fb.1.1760000000000.browser-id; _fbc=fb.1.1760000000000.click-id',
    'user-agent': 'QuizTest/1.0',
    'x-forwarded-for': '203.0.113.12, 127.0.0.1',
  } });
  await h.submitLead({ ...payload, email: ' TEST@EXAMPLE.TEST ', fbp: 'stale-cookie' });
  const event = h.metaCalls[0].payload.data[0];
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  assert.equal(event.user_data.em[0], sha('test@example.test'));
  assert.equal(event.user_data.ph[0], sha('5511900000000'));
  assert.equal(event.user_data.fn[0], sha('test'));
  assert.equal(event.user_data.ln[0], sha('lead'));
  assert.equal(event.user_data.ct[0], sha('saopaulo'));
  assert.equal(event.user_data.st[0], sha('sp'));
  assert.equal(event.user_data.country[0], sha('br'));
  assert.equal(event.user_data.fbp, 'fb.1.1760000000000.browser-id');
  assert.equal(event.user_data.fbc, 'fb.1.1760000000000.click-id');
  assert.equal(event.user_data.client_ip_address, '203.0.113.12');
  assert.equal(event.user_data.client_user_agent, 'QuizTest/1.0');
  assert.equal(event.action_source, 'website');
  assert.equal(event.event_source_url, payload.url_pagina);
  assert.equal(event.custom_data.utm_source, payload.utm_source);
  assert.ok(Math.abs(event.event_time - Math.floor(Date.now() / 1000)) < 5);
});

test('Meta rejection or network failure does not ask the user to resend a saved CRM lead', async () => {
  for (const meta of [
    () => Response.json({ error: { code: 190 } }, { status: 401 }),
    () => { throw new Error('Meta unavailable'); },
    () => Response.json({ events_received: 0 }),
  ]) {
    const h = harness({ meta });
    await h.submitLead(payload);
    assert.equal(h.apiResponses[0].status, 200);
    assert.equal(h.apiResponses[0].body.crm_received, true);
    assert.equal(h.apiResponses[0].body.meta_sent, false);
    assert.equal(h.pixelCalls.length, 1);
  }
});

test('Missing CRM configuration blocks both conversion channels and any webhook request', async () => {
  const h = harness({ env: { WEBHOOK_LEADS_URL: '' } });
  await assert.rejects(h.submitLead(payload), /CRM did not confirm/);
  assert.equal(h.apiResponses[0].status, 503);
  assert.equal(h.webhookCalls.length, 0);
  assert.equal(h.pixelCalls.length, 0);
  assert.equal(h.metaCalls.length, 0);
});

test('A missing Meta token preserves the saved lead and browser pixel', async () => {
  const h = harness({ env: { META_ACCESS_TOKEN: '' } });
  await h.submitLead(payload);
  assert.equal(h.metaCalls.length, 0);
  assert.equal(h.apiResponses[0].body.meta_sent, false);
  assert.equal(h.pixelCalls.length, 1);
});

test('Missing event ID is rejected before CRM submission or tracking', async () => {
  const h = harness();
  await assert.rejects(h.submitLead({ ...payload, event_id: '' }), /CRM did not confirm/);
  assert.equal(h.apiResponses[0].status, 400);
  assert.equal(h.webhookCalls.length, 0);
  assert.equal(h.metaCalls.length, 0);
  assert.equal(h.pixelCalls.length, 0);
});

test('The same primary and secondary webhook URL receives the lead only once', async () => {
  const h = harness({ env: { WEBHOOK_SUPABASE_URL: CRM_URL } });
  await h.submitLead(payload);
  assert.equal(h.webhookCalls.length, 1);
  assert.equal(h.metaCalls.length, 1);
});

test('Meta test mode is optional and private credentials are never returned to the browser', async () => {
  const h = harness({ env: { META_TEST_EVENT_CODE: 'TEST_ONLY' } });
  await h.submitLead(payload);
  assert.equal(h.metaCalls[0].payload.test_event_code, 'TEST_ONLY');
  assert.equal(h.metaCalls[0].url, 'https://graph.facebook.com/v26.0/123456789/events');
  assert.equal(h.metaCalls[0].payload.access_token, 'test-meta-access-token');
  assert.ok(!JSON.stringify(h.apiResponses).includes('test-meta-access-token'));
  assert.ok(!JSON.stringify(h.apiResponses).includes('TEST_ONLY'));
});

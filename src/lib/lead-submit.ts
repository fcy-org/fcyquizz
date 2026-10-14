type LeadPayload = Record<string, unknown> & { event_id: string };

type PixelWindow = Window & {
  fbq?: (
    action: 'track',
    event: 'Lead',
    parameters: Record<string, unknown>,
    options: { eventID: string },
  ) => void;
};

export async function submitLead(payload: LeadPayload): Promise<void> {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok || result.success !== true || result.crm_received !== true) {
    throw new Error('CRM did not confirm the submission.');
  }

  if (typeof window === 'undefined') return;

  // Only a confirmed CRM submission counts as a Lead.
  // A blocked or unavailable pixel must not turn a saved lead into a form error.
  try {
    (window as PixelWindow).fbq?.('track', 'Lead', {}, { eventID: payload.event_id });
  } catch (error) {
    console.error('Meta Lead tracking failed:', error);
  }
}

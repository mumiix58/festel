import { renderContactEmail } from '../lib/email-template.mjs';
const failureMessage = 'Es gab einen Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.';
const json = (status, body, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers }
});

export default async function sendEmail(request) {
  if (request.method !== 'POST') return json(405, { message: 'Method not allowed' }, { Allow: 'POST' });
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { message: 'JSON required' });
  }
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json(403, { message: 'Forbidden' });

  let input;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 20000) return json(413, { message: 'Nachricht zu lang.' });
    input = JSON.parse(raw);
  } catch {
    return json(400, { message: 'Ungültige Anfrage.' });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, { message: 'Ungültige Anfrage.' });
  if (!['contact', 'booking'].includes(input.type)) return json(400, { message: 'Ungültiges Formular.' });

  const limits = { from_name: 200, from_email: 254, subject: 200, message: 10000, phone: 100, eventType: 200, date: 40, start_time: 10, end_time: 10, guests: 10 };
  const fields = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > limit) return json(400, { message: 'Bitte prüfen Sie Ihre Eingaben.' });
    fields[key] = value.trim();
  }
  const required = input.type === 'booking'
    ? ['from_name', 'from_email', 'phone', 'eventType', 'date', 'start_time', 'end_time', 'guests']
    : ['from_name', 'from_email', 'subject', 'message'];
  if (required.some(key => !fields[key]) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(fields.from_email)
    || /[\r\n]/.test(fields.subject + fields.from_name + fields.eventType)
    || (input.type === 'booking' && !/^[1-9]\d*$/.test(fields.guests))) {
    return json(400, { message: 'Bitte füllen Sie alle Pflichtfelder korrekt aus.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || 'catering@festlmacher.at';
  if (!apiKey || !from) {
    console.error('Contact email configuration missing: RESEND_API_KEY or RESEND_FROM_EMAIL');
    return json(503, { message: failureMessage });
  }

  const subject = input.type === 'booking' ? `Terminanfrage: ${fields.eventType}` : fields.subject;
  const text = [
    input.type === 'booking' ? 'Neue Terminanfrage' : 'Neue Kontaktanfrage',
    `Name: ${fields.from_name}`, `E-Mail: ${fields.from_email}`,
    `Betreff: ${subject}`, `Telefon: ${fields.phone || '–'}`,
    `Veranstaltung: ${fields.eventType || '–'}`, `Datum: ${fields.date || '–'}`,
    `Beginn: ${fields.start_time || '–'}`, `Ende: ${fields.end_time || '–'}`,
    `Gäste: ${fields.guests || '–'}`, '', 'Nachricht:', fields.message || 'Keine Nachricht'
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: fields.from_email, subject, text, html: renderContactEmail({ ...fields, name: fields.from_name, email: fields.from_email, subject }) }),
      signal: AbortSignal.timeout(10000)
    });
    const result = await response.json();
    if (!response.ok || typeof result?.id !== 'string' || !result.id) {
      console.error('Resend rejected contact email', response.status);
      return json(502, { message: failureMessage });
    }
    return json(200, { success: true });
  } catch {
    console.error('Resend contact email request failed');
    return json(502, { message: failureMessage });
  }
}

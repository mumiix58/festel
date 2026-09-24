import { test, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import sendEmail from '../netlify/functions/send-email.mjs';

const originalEnv = { ...process.env };
afterEach(() => { mock.restoreAll(); process.env = { ...originalEnv }; });
const contact = { type: 'contact', from_name: 'Test User', from_email: 'visitor@example.com', subject: 'Catering', message: 'Test message', date: '2026-10-10', start_time: '18:00', end_time: '23:00' };
const request = (input = contact, options = {}) => new Request('https://example.com/.netlify/functions/send-email', {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(input), ...options
});
function configure() {
  process.env.RESEND_API_KEY = 'test-key';
  process.env.RESEND_FROM_EMAIL = 'Forms <forms@example.com>';
  delete process.env.CONTACT_TO_EMAIL;
}

test('contact sends all event details, fixed recipient and visitor reply-to', async () => {
  configure();
  const provider = mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    const email = JSON.parse(options.body);
    assert.deepEqual(email.to, ['info@cateringandmore.at']);
    assert.equal(email.from, 'Forms <forms@example.com>');
    assert.equal(email.reply_to, contact.from_email);
    for (const value of Object.values(contact).slice(1)) assert.ok(email.text.includes(value));
    return Response.json({ id: 'email-id' });
  });
  const response = await sendEmail(request({ ...contact, to_email: 'attacker@example.com' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(provider.mock.callCount(), 1);
});

test('booking includes phone, service, guests and optional message', async () => {
  configure();
  process.env.CONTACT_TO_EMAIL = 'configured@example.com';
  mock.method(globalThis, 'fetch', async (_, options) => {
    const email = JSON.parse(options.body);
    assert.deepEqual(email.to, ['configured@example.com']);
    assert.equal(email.subject, 'Terminanfrage: Hochzeit');
    for (const value of ['+43 12345', 'Hochzeit', '50', 'Keine Nachricht']) assert.ok(email.text.includes(value));
    return Response.json({ id: 'booking-id' });
  });
  assert.equal((await sendEmail(request({ ...contact, type: 'booking', phone: '+43 12345', eventType: 'Hochzeit', guests: '50', message: '' }))).status, 200);
});

test('invalid submissions never contact provider', async () => {
  configure();
  const provider = mock.method(globalThis, 'fetch', () => { throw new Error('Should not send'); });
  for (const invalid of [null, [], {}, { ...contact, from_email: 'invalid' }, { ...contact, from_name: ' ' }, { ...contact, message: '' }, { ...contact, message: 'x'.repeat(10001) }, { ...contact, subject: 'a\r\nb' }, { ...contact, type: 'other' }, { ...contact, type: 'booking', guests: '-1' }]) {
    assert.equal((await sendEmail(request(invalid))).status, 400);
  }
  assert.equal((await sendEmail(request(contact, { body: '{' }))).status, 400);
  assert.equal((await sendEmail(request(contact, { body: 'x'.repeat(20001) }))).status, 413);
  assert.equal(provider.mock.callCount(), 0);
});

test('method, content type, origin and missing configuration are rejected', async () => {
  assert.equal((await sendEmail(new Request('https://example.com'))).status, 405);
  assert.equal((await sendEmail(request(contact, { headers: { 'Content-Type': 'text/plain' } }))).status, 415);
  assert.equal((await sendEmail(request(contact, { headers: { 'Content-Type': 'application/json', Origin: 'https://other.example' } }))).status, 403);
  configure();
  delete process.env.RESEND_API_KEY;
  assert.equal((await sendEmail(request())).status, 503);
  configure();
  delete process.env.RESEND_FROM_EMAIL;
  assert.equal((await sendEmail(request())).status, 503);
});

test('provider rejection, malformed responses and network failure never show success', async () => {
  configure();
  for (const result of [() => Response.json({ message: 'private detail' }, { status: 403 }), () => Response.json({}), () => new Response('not json'), () => { throw new Error('network failure'); }]) {
    mock.method(globalThis, 'fetch', async () => result());
    const response = await sendEmail(request());
    assert.equal(response.status, 502);
    const body = await response.json();
    assert.equal(body.success, undefined);
    assert.ok(!JSON.stringify(body).includes('private detail'));
    mock.restoreAll();
  }
});

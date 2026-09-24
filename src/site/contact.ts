import { publicBackend } from "./data";
export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  event_start: string;
  event_end: string;
}
export interface ContactAttempt {
  id: string;
  saved: boolean;
}
export async function submitContact(
  payload: ContactPayload,
  attempt: ContactAttempt,
  request: typeof fetch = fetch,
) {
  const headers = {
    "Content-Type": "application/json",
    apikey: publicBackend.anonKey,
    Authorization: `Bearer ${publicBackend.anonKey}`,
  };
  if (!attempt.saved) {
    const { phone, ...record } = payload;
    const stored = {
      ...record,
      id: attempt.id,
      message: payload.message + (phone ? "\n\nTelefon: " + phone : ""),
    };
    const response = await request(
      `${publicBackend.url}/rest/v1/contact_submissions`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(stored),
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!response.ok)
      throw new Error("Anfrage konnte nicht gespeichert werden.");
    attempt.saved = true;
  }
  const response = await request(
    `${publicBackend.url}/functions/v1/send-contact-email`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    },
  );
  const result = await response.json();
  if (!response.ok || result.success !== true)
    throw new Error("E-Mail konnte nicht übermittelt werden.");
  return result;
}

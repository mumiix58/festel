export interface EmailParams {
  from_name: string;
  from_email: string;
  subject?: string;
  message: string;
  phone?: string;
  eventType?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  guests?: string;
}

export const sendEmail = async (templateParams: EmailParams, type: 'contact' | 'booking' = 'contact') => {
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...templateParams, type }),
      signal: AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok || result?.success !== true) throw new Error('Email not accepted');
    return result;
  } catch {
    throw new Error(
      'Es gab einen Fehler beim Senden der Nachricht. ' +
      'Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch unter +43 (0)699 – 1600 2800.'
    );
  }
};

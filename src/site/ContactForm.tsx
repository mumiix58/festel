import { FormEvent, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { submitContact, ContactAttempt, ContactPayload } from "./contact";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const pending = useRef<{
    fingerprint: string;
    attempt: ContactAttempt;
  } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get("website")) return;
    const start = String(values.get("event_start") || "");
    const end = String(values.get("event_end") || "");
    if (start && end && end < start) {
      setError("Das Ende muss nach dem Beginn liegen.");
      setState("error");
      return;
    }
    setState("sending");
    setError("");
    const message =
      String(values.get("message") || "") +
      (values.get("guests") ? `\n\nGästeanzahl: ${values.get("guests")}` : "");
    const body: ContactPayload = {
      name: String(values.get("name")),
      email: String(values.get("email")),
      phone: String(values.get("phone") || ""),
      subject: String(values.get("subject")),
      message,
      event_start: start ? new Date(start).toISOString() : "",
      event_end: end ? new Date(end).toISOString() : "",
    };
    try {
      const fingerprint = JSON.stringify(body);
      if (pending.current?.fingerprint !== fingerprint)
        pending.current = {
          fingerprint,
          attempt: { id: crypto.randomUUID(), saved: false },
        };
      await submitContact(body, pending.current.attempt);
      pending.current = null;
      setState("success");
      form.reset();
    } catch {
      setState("error");
      setError(
        "Ihre Nachricht konnte nicht gesendet werden. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
      );
    }
  }
  return (
    <form className="fm-form" onSubmit={submit}>
      <div className="fm-eyebrow">IHRE VERANSTALTUNG</div>
      <h2>Erzählen Sie uns von Ihrer Idee.</h2>
      <p>
        Die mit * markierten Felder helfen uns, Ihre Anfrage zu beantworten.
      </p>
      <div className="fm-form-grid">
        <label>
          Name *
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Vor- und Nachname"
          />
        </label>
        <label>
          E-Mail *
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="name@beispiel.at"
          />
        </label>
        <label>
          Telefon
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={50}
            placeholder="Für eine persönliche Rückfrage"
          />
        </label>
        <label>
          Anlass *
          <select name="subject" required defaultValue="">
            <option value="" disabled>
              Bitte auswählen
            </option>
            <option>Hochzeit</option>
            <option>Firmenveranstaltung</option>
            <option>Private Feier</option>
            <option>Equipment & Ausstattung</option>
            <option>Sonstige Anfrage</option>
          </select>
        </label>
        <label>
          Beginn *<input name="event_start" type="datetime-local" required />
        </label>
        <label>
          Ende *<input name="event_end" type="datetime-local" required />
        </label>
        <label className="fm-wide">
          Ungefähre Gästeanzahl
          <input
            name="guests"
            type="number"
            min="1"
            max="100000"
            placeholder="z. B. 80"
          />
        </label>
        <label className="fm-wide">
          Ihre Nachricht *
          <textarea
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={8000}
            placeholder="Was planen Sie? Teilen Sie uns gerne Ort, Wünsche und offene Fragen mit."
          />
        </label>
      </div>
      <label className="fm-trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="fm-consent">
        <input type="checkbox" required />{" "}
        <span>
          Ich habe die <Link to="/datenschutz">Datenschutzhinweise</Link>{" "}
          gelesen und stimme der Verarbeitung meiner Angaben zur Bearbeitung
          meiner Anfrage zu. *
        </span>
      </label>
      <button
        className="fm-button"
        disabled={state === "sending"}
        type="submit"
      >
        {state === "sending" ? "Wird gesendet …" : "Anfrage senden"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <div aria-live="polite" role="status">
        {state === "success" && (
          <p className="fm-success">
            Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt. Wir melden
            uns bei Ihnen.
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="fm-error">
          {error}
        </p>
      )}
    </form>
  );
}

import { FormEvent, useEffect, useState, useRef } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { publicBackend, initialData, RecordData, useSiteData } from "./data";
const cms = createClient(publicBackend.url, publicBackend.anonKey);
const sections: Record<string, string> = {
  company_info: "Unternehmen",
  contact_info: "Kontaktinformationen",
  slides: "Startseitenbilder",
  services: "Leistungen",
  about_content: "Über uns",
  catering_services: "Catering",
  menu_categories: "Menükategorien",
  menu_items: "Speisen",
  equipment: "Equipment",
  gallery: "Galerie",
  sustainability_content: "Nachhaltigkeit",
  faq_items: "FAQ",
  blog_posts: "Blog",
  pages: "Rechtliche Seiten",
  footer_links: "Footer-Links",
  contact_submissions: "Kontaktanfragen",
};
const fieldLabels: Record<string, string> = {
  title: "Titel",
  name: "Name",
  description: "Beschreibung",
  content: "Inhalt",
  image_url: "Bild-URL",
  logo_url: "Logo-URL",
  order: "Reihenfolge",
  published: "Veröffentlicht",
  slug: "URL-Kennung",
  category: "Kategorie",
  category_id: "Menükategorie",
  question: "Frage",
  answer: "Antwort",
  section: "Abschnitt",
  type: "Typ",
  value: "Wert",
  tagline: "Untertitel",
  subtitle: "Untertitel",
  price: "Preis",
  meta_title: "SEO-Titel",
  meta_description: "SEO-Beschreibung",
  meta_keywords: "Suchbegriffe",
  url: "Link-Adresse",
};
const protectedFields = new Set(["id", "created_at", "updated_at"]);
export default function CmsAdmin() {
  const siteData = useSiteData();
  const route = useLocation().pathname.split("/")[2];
  const requestVersion = useRef(0);
  const [session, setSession] = useState<Session | null>(null),
    [loading, setLoading] = useState(true),
    [section, setSection] = useState(
      sections[route]
        ? route
        : route === "blog"
          ? "blog_posts"
          : route === "faq"
            ? "faq_items"
            : "company_info",
    ),
    [rows, setRows] = useState<RecordData[]>([]),
    [draft, setDraft] = useState<RecordData | null>(null),
    [isNew, setIsNew] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    void cms.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = cms.auth.onAuthStateChange((_event, current) =>
      setSession(current),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  async function load() {
    const version = ++requestVersion.current;
    setBusy(true);
    setDraft(null);
    setError("");
    const { data, error } = await cms.from(section).select("*").limit(1000);
    if (version !== requestVersion.current) return;
    if (error) {
      setError(
        "Die Daten konnten nicht geladen werden. Bitte prüfen Sie Ihre Zugriffsberechtigung.",
      );
      setRows([]);
    } else setRows(data || []);
    setBusy(false);
  }
  useEffect(() => {
    if (session) void load();
  }, [session?.user.id, section]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    const { error } = await cms.auth.signInWithPassword({
      email: String(data.get("email")),
      password: String(data.get("password")),
    });
    if (error)
      setError("Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.");
    setBusy(false);
  }
  function add() {
    const template = rows[0] || initialData[section]?.[0];
    if (!template) {
      setError("Für diesen Bereich ist noch keine Vorlage verfügbar.");
      return;
    }
    setDraft(
      Object.fromEntries(
        Object.entries(template)
          .filter(([key]) => !protectedFields.has(key))
          .map(([key, value]) => [
            key,
            typeof value === "boolean"
              ? false
              : typeof value === "number"
                ? 0
                : value === null
                  ? null
                  : "",
          ]),
      ) as RecordData,
    );
    setIsNew(true);
    setNotice("");
    setError("");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError("");
    setNotice("");
    const values = Object.fromEntries(
      Object.entries(draft).filter(([key]) => !protectedFields.has(key)),
    );
    if (
      section === "blog_posts" &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(values.slug))
    ) {
      setError(
        "Die URL-Kennung darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.",
      );
      setBusy(false);
      return;
    }
    const result = isNew
      ? await cms.from(section).insert(values).select("id")
      : await cms.from(section).update(values).eq("id", draft.id).select("id");
    if (result.error || !result.data?.length)
      setError(
        "Speichern fehlgeschlagen. Bitte prüfen Sie Felder und Zugriffsberechtigung.",
      );
    else {
      window.dispatchEvent(new Event("festel:content-updated"));
      await load();
      setNotice(
        "Gespeichert. Die Website lädt die aktuellen Inhalte automatisch.",
      );
    }
    setBusy(false);
  }
  async function remove() {
    if (!draft || isNew || !window.confirm("Diesen Eintrag dauerhaft löschen?"))
      return;
    setBusy(true);
    setError("");
    const result = await cms
      .from(section)
      .delete()
      .eq("id", draft.id)
      .select("id");
    if (result.error || !result.data?.length) {
      setError("Löschen fehlgeschlagen. Bitte prüfen Sie Ihre Berechtigung.");
      setBusy(false);
    } else {
      window.dispatchEvent(new Event("festel:content-updated"));
      await load();
      setNotice("Eintrag gelöscht.");
    }
  }
  async function upload(file: File) {
    if (!draft) return;
    setBusy(true);
    setError("");
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      setError("Bitte JPG, PNG oder WebP bis 10 MB verwenden.");
      setBusy(false);
      return;
    }
    const folder = section === "company_info" ? "logos" : section;
    const ext = file.type.split("/")[1];
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await cms.storage
      .from("images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error)
      setError("Upload fehlgeschlagen. Bitte prüfen Sie Ihre Berechtigung.");
    else {
      const { data } = cms.storage.from("images").getPublicUrl(path);
      setDraft({
        ...draft,
        [section === "company_info" ? "logo_url" : "image_url"]: data.publicUrl,
      });
      setNotice(
        "Bild hochgeladen. Speichern Sie den Datensatz, um es zu verwenden.",
      );
    }
    setBusy(false);
  }
  return (
    <div className="fm-admin">
      <Helmet>
        <title>Verwaltung | FEST’LMACHER</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="fm-admin-shell">
        <header>
          <h1>FEST’LMACHER · Verwaltung</h1>
          <div className="fm-admin-actions">
            <Link to="/">Zur Website ↗</Link>
            {session && (
              <button
                onClick={async () => {
                  await cms.auth.signOut();
                  setRows([]);
                  setDraft(null);
                }}
              >
                Abmelden
              </button>
            )}
          </div>
        </header>
        {loading ? (
          <p>Wird geladen …</p>
        ) : !session ? (
          <form className="fm-admin-login" onSubmit={login}>
            <h2>Anmelden</h2>
            <p>
              Verwenden Sie Ihren bestehenden Zugang zur Website-Verwaltung.
            </p>
            <label>
              E-Mail
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Passwort
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            <button className="fm-button" disabled={busy}>
              {busy ? "Anmeldung …" : "Anmelden"}
            </button>
            {error && (
              <p role="alert" className="fm-error">
                {error}
              </p>
            )}
          </form>
        ) : (
          <>
            <div className="fm-admin-grid">
              <nav aria-label="Verwaltungsbereiche">
                {Object.entries(sections).map(([key, label]) => (
                  <button
                    key={key}
                    aria-current={section === key}
                    onClick={() => {
                      setSection(key);
                      setNotice("");
                    }}
                  >
                    {label}
                  </button>
                ))}
              </nav>
              <section>
                <div className="fm-admin-actions">
                  <h2>{sections[section]}</h2>
                  {section !== "contact_submissions" && (
                    <button className="fm-button" disabled={busy} onClick={add}>
                      Hinzufügen
                    </button>
                  )}
                  <button disabled={busy} onClick={() => void load()}>
                    Aktualisieren
                  </button>
                </div>
                {error && (
                  <p role="alert" className="fm-error">
                    {error}
                  </p>
                )}
                {notice && (
                  <p role="status" className="fm-success">
                    {notice}
                  </p>
                )}
                {busy && !draft ? (
                  <p>Wird geladen …</p>
                ) : draft ? (
                  <article>
                    {section === "contact_submissions" ? (
                      <>
                        <h3>{draft.subject}</h3>
                        <p>
                          {draft.name} · {draft.email}
                        </p>
                        <p style={{ whiteSpace: "pre-wrap" }}>
                          {draft.message}
                        </p>
                        <a
                          className="fm-button"
                          href={
                            "mailto:" +
                            encodeURIComponent(draft.email) +
                            "?subject=" +
                            encodeURIComponent("Re: " + draft.subject)
                          }
                        >
                          Anfrage beantworten
                        </a>
                        <button onClick={() => setDraft(null)}>Zurück</button>
                      </>
                    ) : (
                      <form onSubmit={save}>
                        <h3>
                          {isNew ? "Neuer Eintrag" : "Eintrag bearbeiten"}
                        </h3>
                        {Object.entries(draft)
                          .filter(([key]) => !protectedFields.has(key))
                          .map(([key, value]) => (
                            <label key={key}>
                              {fieldLabels[key] || key}
                              {typeof value === "boolean" ? (
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      [key]: e.target.checked,
                                    })
                                  }
                                />
                              ) : key === "category_id" ? (
                                <select
                                  value={value || ""}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      [key]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Bitte auswählen</option>
                                  {siteData.menu_categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.title}
                                    </option>
                                  ))}
                                </select>
                              ) : [
                                  "content",
                                  "description",
                                  "answer",
                                  "meta_description",
                                  "value",
                                ].includes(key) ? (
                                <textarea
                                  rows={key === "content" ? 14 : 4}
                                  value={value ?? ""}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      [key]: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <input
                                  required={[
                                    "title",
                                    "name",
                                    "slug",
                                    "question",
                                    "url",
                                  ].includes(key)}
                                  type={
                                    typeof value === "number" || key === "price"
                                      ? "number"
                                      : "text"
                                  }
                                  step={key === "price" ? "0.01" : undefined}
                                  value={value ?? ""}
                                  onChange={(e) =>
                                    setDraft({
                                      ...draft,
                                      [key]:
                                        key === "price"
                                          ? e.target.value === ""
                                            ? null
                                            : Number(e.target.value)
                                          : typeof value === "number"
                                            ? Number(e.target.value)
                                            : e.target.value,
                                    })
                                  }
                                />
                              )}
                            </label>
                          ))}
                        {("image_url" in draft || "logo_url" in draft) && (
                          <label>
                            Bild hochladen
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) void upload(file);
                              }}
                            />
                          </label>
                        )}
                        <div className="fm-admin-actions">
                          <button className="fm-button" disabled={busy}>
                            {busy
                              ? "Wird gespeichert …"
                              : "Änderungen speichern"}
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => setDraft(null)}
                          >
                            Abbrechen
                          </button>
                          {!isNew && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void remove()}
                            >
                              Eintrag löschen
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </article>
                ) : (
                  <div className="fm-record-list">
                    {rows.length === 0 ? (
                      <p>Keine Einträge vorhanden.</p>
                    ) : (
                      rows.map((row) => (
                        <button
                          key={row.id}
                          onClick={() => {
                            setDraft({ ...row });
                            setIsNew(false);
                            setNotice("");
                          }}
                        >
                          <strong>
                            {row.title ||
                              row.name ||
                              row.question ||
                              row.subject ||
                              row.type ||
                              row.id}
                          </strong>
                          {row.published !== undefined && (
                            <small>
                              {row.published ? "Veröffentlicht" : "Entwurf"}
                            </small>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

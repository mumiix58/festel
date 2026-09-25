import { PageFAQ } from "./PageFAQ";
import { pageFAQs } from "../content/page-faq";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowUpRight,
  Menu,
  X,
  Phone,
  ArrowRight,
  Check,
  Leaf,
} from "lucide-react";
import {
  SITE_LOGO,
  SITE_NAME,
  seoPages,
  canonicalPath,
  canonicalUrl,
  pageGraph,
  serializeJsonLd,
  plainText,
  SeoPage,
} from "../lib/seo";
import {
  useSiteData,
  ordered,
  uniqueServices,
  imageUrl,
  plainContent,
  RecordData,
} from "./data";
import { ContactForm } from "./ContactForm";

const navigation = [
  ["/services", "Leistungen"],
  ["/catering", "Catering"],
  ["/equipment", "Equipment"],
  ["/gallery", "Galerie"],
  ["/about", "Über uns"],
];
const date = (value: string) =>
  new Date(value).toLocaleDateString("de-AT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Vienna",
  });
const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => <h2>{children}</h2>,
      img: ({ src, alt }) =>
        imageUrl(src || "") ? (
          <img src={imageUrl(src || "")} alt={alt || ""} loading="lazy" />
        ) : (
          <span>{alt || ""}</span>
        ),
    }}
  >
    {plainContent(children)}
  </ReactMarkdown>
);
const Button = ({
  to = "/contact",
  children = "Veranstaltung anfragen",
  light = false,
}: {
  to?: string;
  children?: React.ReactNode;
  light?: boolean;
}) => (
  <Link className={`fm-button ${light ? "fm-button-light" : ""}`} to={to}>
    {children}
    <ArrowUpRight size={18} aria-hidden="true" />
  </Link>
);
function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="fm-page-intro fm-wrap">
      <span className="fm-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
function CTA() {
  return (
    <>
      <PageFAQ />
      <section className="fm-cta">
        <div className="fm-wrap fm-cta-inner">
          <div>
            <span className="fm-eyebrow">AUS IHRER IDEE WIRD EIN FEST</span>
            <h2>
              Was dürfen wir
              <br />
              für Sie möglich machen?
            </h2>
          </div>
          <div>
            <p>
              Ein erster Kontakt. Viele Möglichkeiten.
              <br />
              Gemeinsam planen wir Ihre Veranstaltung.
            </p>
            <Button light />
          </div>
        </div>
      </section>
    </>
  );
}
function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const data = useSiteData();
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.focus();
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [open]);
  return (
    <>
      <a className="fm-skip" href="#main-content">
        Zum Inhalt springen
      </a>
      <div className="fm-topbar">
        <div className="fm-wrap">
          <span>WIEN · CATERING & EVENTSERVICE</span>
          <a href="tel:+4369916002800">
            <Phone size={12} aria-hidden="true" /> +43 699 1600 2800
          </a>
        </div>
      </div>
      <header className="fm-header">
        <div className="fm-wrap fm-nav">
          <Link
            className="fm-logo"
            to="/"
            aria-label="FEST’LMACHER – Startseite"
          >
            <img
              src={data.company_info[0]?.logo_url || SITE_LOGO}
              width="220"
              height="100"
              alt="FEST’LMACHER catering and more"
            />
          </Link>
          <nav className="fm-desktop-nav" aria-label="Hauptnavigation">
            {navigation.map(([url, label]) => (
              <Link
                key={url}
                to={url}
                aria-current={
                  canonicalPath(location.pathname) === url ? "page" : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="fm-nav-actions">
            <Link className="fm-nav-cta" to="/contact">
              Anfrage senden <ArrowUpRight size={15} />
            </Link>
            <button
              ref={menuRef}
              className="fm-menu-button"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-controls="mobile-navigation"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          id="mobile-navigation"
          className="fm-mobile-nav"
          aria-label="Mobile Navigation"
          hidden={!open}
        >
          {[
            ...navigation,
            ["/sustainability", "Nachhaltigkeit"],
            ["/references", "Referenzen"],
            ["/faq", "FAQ"],
            ["/blog", "Blog"],
            ["/contact", "Kontakt"],
          ].map(([url, label]) => (
            <Link key={url} to={url}>
              {label}
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
function SiteFooter() {
  const data = useSiteData();
  return (
    <footer className="fm-footer">
      <div className="fm-wrap fm-footer-grid">
        <div>
          <img
            src={data.company_info[0]?.logo_url || SITE_LOGO}
            width="220"
            height="100"
            alt="FEST’LMACHER catering and more"
          />
          <p>
            Gutes Essen. Persönlicher Service.
            <br />
            Besondere Momente in Wien.
          </p>
        </div>
        <div>
          <h2>Entdecken</h2>
          {[
            ...navigation,
            ["/sustainability", "Bio & Nachhaltigkeit"],
            ["/references", "Referenzen"],
            ["/blog", "Blog"],
            ["/faq", "Häufige Fragen"],
          ].map(([url, label]) => (
            <Link key={url} to={url}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h2>Kontakt</h2>
          <a href="tel:+4369916002800">+43 699 1600 2800</a>
          <a href="mailto:info@cateringandmore.at">info@cateringandmore.at</a>
          <p>{data.contact_info.find((r) => r.type === "address")?.value}</p>
          <p>{data.contact_info.find((r) => r.type === "hours")?.value}</p>
        </div>
      </div>
      <div className="fm-wrap fm-footer-bottom">
        <span>© {new Date().getFullYear()} FEST’LMACHER</span>
        <div>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <Link to="/agb">AGB</Link>
        </div>
      </div>
    </footer>
  );
}
function ServiceCards({ limit }: { limit?: number }) {
  const data = useSiteData();
  return (
    <div className="fm-cards">
      {uniqueServices(data.services)
        .slice(0, limit)
        .map((service, index) => (
          <article className="fm-service-card" key={service.id}>
            <Link
              to={/Catering/i.test(service.title) ? "/catering" : "/services"}
              className="fm-image-link"
            >
              <img
                src={imageUrl(service.image_url, 750)}
                alt={service.title}
                loading="lazy"
                width="750"
                height="580"
              />
              <span className="fm-image-arrow">
                <ArrowUpRight size={22} />
              </span>
            </Link>
            <div className="fm-card-title">
              <h3>{service.title}</h3>
              <span>0{index + 1}</span>
            </div>
            <p>{service.description.replace(/\s11$/, "")}</p>
          </article>
        ))}
    </div>
  );
}
function Home() {
  const data = useSiteData();
  const hero =
    data.slides.find((r) => r.title === "Exquisites Catering") ||
    data.slides[0];
  return (
    <>
      <section className="fm-hero">
        <div className="fm-hero-copy">
          <span className="fm-eyebrow">FEST’LMACHER · CATERING IN WIEN</span>
          <h1>
            Für Momente,
            <br />
            die <em>bleiben.</em>
          </h1>
          <p>
            Vom ersten Aperitif bis zum letzten gemeinsamen Lachen. Wir bringen
            Geschmack, Gastlichkeit und Ihre Ideen an einen Tisch.
          </p>
          <div className="fm-hero-actions">
            <Button />
            <Link className="fm-text-link" to="/catering">
              Catering entdecken <ArrowRight size={18} />
            </Link>
          </div>
          <div className="fm-hero-note">
            <span className="fm-small-rule" />
            Persönlich geplant. Mit Liebe serviert.
          </div>
        </div>
        <div className="fm-hero-image">
          <img
            src={imageUrl(hero?.image_url, 1600)}
            alt="Ein liebevoll angerichtetes Catering-Buffet"
            width="1200"
            height="1400"
            {...{ fetchpriority: "high" }}
          />
          <div className="fm-photo-note">
            <span>CATERING & MORE</span>
            <p>
              Ihr Anlass.
              <br />
              Unsere Leidenschaft.
            </p>
          </div>
        </div>
      </section>
      <div className="fm-occasion-strip">
        <div className="fm-wrap">
          <span>Hochzeiten</span>
          <i>✳</i>
          <span>Firmenveranstaltungen</span>
          <i>✳</i>
          <span>Private Feiern</span>
          <i>✳</i>
          <span>Eventausstattung</span>
        </div>
      </div>
      <section className="fm-section fm-wrap">
        <div className="fm-section-heading">
          <div>
            <span className="fm-eyebrow">GASTGEBEN LEICHT GEMACHT</span>
            <h2>
              Alles für Ihr Fest.
              <br />
              <em>Aus einer Hand.</em>
            </h2>
          </div>
          <p>
            Gutes Essen verbindet. Mit persönlicher Beratung, passendem Service
            und durchdachter Planung machen wir Raum für Ihre Gäste.
          </p>
        </div>
        <ServiceCards limit={3} />
      </section>
      <section className="fm-story">
        <div className="fm-wrap fm-story-grid">
          <div className="fm-story-photo">
            <img
              src={imageUrl(
                data.gallery.find((r) => r.category === "Hochzeiten")
                  ?.image_url || data.gallery[0]?.image_url,
                1000,
              )}
              alt="Festlich gedeckter Tisch für eine Veranstaltung"
              width="900"
              height="1100"
              loading="lazy"
            />
          </div>
          <div className="fm-story-copy">
            <span className="fm-eyebrow">MEHR ALS GUTES ESSEN</span>
            <h2>
              Sie genießen.
              <br />
              <em>Wir kümmern uns.</em>
            </h2>
            <p>
              {data.about_content.find((r) => r.section === "mission")?.content}
            </p>
            <div className="fm-benefits">
              <span>
                <Check />
                Individuelle Menüplanung
              </span>
              <span>
                <Check />
                Persönliche Abstimmung
              </span>
              <span>
                <Check />
                Catering, Service & Equipment
              </span>
            </div>
            <Link className="fm-text-link" to="/about">
              Lernen Sie uns kennen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="fm-section fm-wrap">
        <div className="fm-section-heading">
          <div>
            <span className="fm-eyebrow">VON DER IDEE ZUM ERLEBNIS</span>
            <h2>
              In drei Schritten
              <br />
              zu Ihrem Fest.
            </h2>
          </div>
          <Link className="fm-text-link" to="/faq">
            Häufige Fragen <ArrowRight size={18} />
          </Link>
        </div>
        <div className="fm-process">
          {[
            [
              "01",
              "Ihre Idee",
              "Erzählen Sie uns von Ihrem Anlass, Ihren Gästen und Ihren Wünschen.",
            ],
            [
              "02",
              "Unser Vorschlag",
              "Wir stimmen Speisen, Ausstattung und Ablauf persönlich mit Ihnen ab.",
            ],
            [
              "03",
              "Ihr besonderer Tag",
              "Sie empfangen Ihre Gäste. Wir begleiten Ihre Veranstaltung.",
            ],
          ].map(([n, title, text]) => (
            <article key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="fm-gallery-teaser fm-wrap">
        <div className="fm-section-heading">
          <div>
            <span className="fm-eyebrow">EINBLICKE</span>
            <h2>So kann Ihr Fest aussehen.</h2>
          </div>
          <Link className="fm-text-link" to="/gallery">
            Zur Galerie <ArrowRight size={18} />
          </Link>
        </div>
        <div className="fm-teaser-grid">
          {data.gallery.slice(0, 4).map((item) => (
            <Link key={item.id} to="/gallery">
              <img
                src={imageUrl(item.image_url, 650)}
                alt={item.title}
                width="650"
                height="750"
                loading="lazy"
              />
              <span>{item.category}</span>
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
function InformationPage({ type }: { type: "about" | "sustainability" }) {
  const data = useSiteData();
  const rows = ordered(
    data[type === "about" ? "about_content" : "sustainability_content"],
  );
  return (
    <>
      <PageIntro
        eyebrow={
          type === "about"
            ? "DIE MENSCHEN HINTER IHREM FEST"
            : "BEWUSST GENIESSEN"
        }
        title={
          type === "about"
            ? "Gastlichkeit ist unsere Leidenschaft."
            : "Guter Geschmack. Mit Verantwortung."
        }
        description={
          type === "about"
            ? "Lernen Sie FEST’LMACHER und unseren Anspruch an Catering und Eventservice kennen."
            : "Unser Ansatz für regionale Zutaten, bewussten Einkauf und eine durchdachte Veranstaltungsplanung."
        }
      />
      <div className="fm-wrap fm-editorial">
        {rows.map((row) => (
          <section
            key={row.id}
            className={row.image_url ? "fm-editorial-row" : "fm-editorial-text"}
          >
            {row.image_url && (
              <img
                src={imageUrl(row.image_url, 1000)}
                alt={row.title}
                width="1000"
                height="800"
                loading="lazy"
              />
            )}
            <div>
              {type === "sustainability" && <Leaf className="fm-leaf" />}
              <h2>{row.title}</h2>
              <p>{row.content}</p>
            </div>
          </section>
        ))}
      </div>
      <CTA />
    </>
  );
}
function Services() {
  return (
    <>
      <PageIntro
        eyebrow="LEISTUNGEN"
        title="Ihr Anlass. Unsere Möglichkeiten."
        description="Vom kulinarischen Konzept bis zur Eventplanung: Entdecken Sie unsere Leistungen und sprechen Sie mit uns über Ihre Wünsche."
      />
      <section className="fm-wrap fm-section-bottom">
        <ServiceCards />
      </section>
      <CTA />
    </>
  );
}
function Catering() {
  const data = useSiteData();
  return (
    <>
      <PageIntro
        eyebrow="CATERING & MORE"
        title="Geschmack, der in Erinnerung bleibt."
        description="Buffet, Live-Cooking oder Flying Service: Wir stimmen das kulinarische Konzept auf Ihren Anlass ab."
      />
      <section className="fm-wrap fm-service-list">
        {ordered(data.catering_services)
          .filter((r) => r.type === "main")
          .map((item, i) => (
            <article key={item.id}>
              <span className="fm-eyebrow">0{i + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </article>
          ))}
      </section>
      <section className="fm-section fm-wrap">
        <div className="fm-section-heading">
          <div>
            <span className="fm-eyebrow">KULINARISCHE INSPIRATION</span>
            <h2>
              Ein Vorgeschmack
              <br />
              auf Ihre Veranstaltung.
            </h2>
          </div>
          <p>
            Die folgenden Speisen geben Ihnen einen Einblick. Ihr Angebot
            stellen wir persönlich mit Ihnen zusammen.
          </p>
        </div>
        <div className="fm-cards">
          {ordered(data.menu_categories).map((category) => (
            <article className="fm-menu-card" key={category.id}>
              <img
                src={imageUrl(category.image_url, 800)}
                alt={category.title}
                width="800"
                height="600"
                loading="lazy"
              />
              <div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <ul>
                  {ordered(data.menu_items)
                    .filter((item) => item.category_id === category.id)
                    .map((item) => (
                      <li key={item.id}>
                        <strong>{item.name}</strong>
                        <p>{item.description}</p>
                        {item.price !== null && item.price !== undefined && (
                          <span>
                            {Number(item.price).toLocaleString("de-AT", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
        <div className="fm-additional">
          {ordered(data.catering_services)
            .filter((r) => r.type === "additional")
            .map((item) => (
              <article key={item.id}>
                <Check />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
function Gallery({
  equipment = false,
  references = false,
}: {
  equipment?: boolean;
  references?: boolean;
}) {
  const data = useSiteData();
  const items = data[equipment ? "equipment" : "gallery"];
  const [category, setCategory] = useState("Alle");
  const [selected, setSelected] = useState<RecordData | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const categories = [
    "Alle",
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ];
  const shown =
    category === "Alle"
      ? items
      : items.filter((item) => item.category === category);
  useEffect(() => {
    setCategory("Alle");
    setSelected(null);
  }, [equipment, references]);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  function close() {
    setSelected(null);
    lastTrigger.current?.focus();
  }
  return (
    <>
      <PageIntro
        eyebrow={
          equipment
            ? "EQUIPMENT & AUSSTATTUNG"
            : references
              ? "REFERENZEN"
              : "GALERIE"
        }
        title={
          equipment
            ? "Der passende Rahmen für Ihr Fest."
            : references
              ? "Einblicke in besondere Momente."
              : "Bilder sagen mehr als Worte."
        }
        description={
          equipment
            ? "Tische, Stühle, Geschirr und mehr: Entdecken Sie unsere Ausstattung und fragen Sie die Verfügbarkeit für Ihren Termin an."
            : "Entdecken Sie Eindrücke aus Hochzeiten, Firmenveranstaltungen und privaten Feiern."
        }
      />
      <section className="fm-wrap fm-section-bottom">
        <div
          className="fm-filter"
          role="group"
          aria-label="Kategorie auswählen"
        >
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="fm-result-count" aria-live="polite">
          {shown.length} {equipment ? "Artikel" : "Bilder"}
        </p>
        <div className="fm-gallery-grid">
          {shown.map((item) => (
            <article key={item.id}>
              <button
                onClick={(event) => {
                  lastTrigger.current = event.currentTarget;
                  setSelected(item);
                }}
                aria-label={`${item.title || item.name} vergrößern`}
              >
                <img
                  src={imageUrl(item.image_url, 750)}
                  alt={item.title || item.name}
                  width="750"
                  height="650"
                  loading="lazy"
                />
                <span className="fm-image-arrow">
                  <ArrowUpRight />
                </span>
              </button>
              <div>
                <span className="fm-eyebrow">{item.category}</span>
                <h2>{item.title || item.name}</h2>
                {item.description && <p>{item.description}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
      <dialog
        ref={dialog}
        className="fm-lightbox"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-label={selected?.title || selected?.name || "Bildansicht"}
      >
        <button
          className="fm-lightbox-close"
          onClick={close}
          aria-label="Bildansicht schließen"
        >
          <X />
        </button>
        {selected && (
          <figure>
            <img
              src={imageUrl(selected.image_url, 1800)}
              alt={selected.title || selected.name}
            />
            <figcaption>{selected.title || selected.name}</figcaption>
          </figure>
        )}
      </dialog>
      <CTA />
    </>
  );
}
function FAQ() {
  const data = useSiteData();
  const [search, setSearch] = useState("");
  const questions = ordered(data.faq_items).filter((item) =>
    (item.question + " " + item.answer)
      .toLocaleLowerCase("de")
      .includes(search.toLocaleLowerCase("de")),
  );
  return (
    <>
      <PageIntro
        eyebrow="GUT ZU WISSEN"
        title="Ihre Fragen. Unsere Antworten."
        description="Von der ersten Planung bis zum Veranstaltungstag: Hier finden Sie Antworten auf häufige Fragen."
      />
      <section className="fm-wrap fm-faq">
        <label className="fm-search">
          Fragen durchsuchen
          <input
            type="search"
            placeholder="z. B. Allergien oder Buchung"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div aria-live="polite" className="fm-result-count">
          {questions.length} Fragen
        </div>
        {questions.map((item) => (
          <details key={item.id}>
            <summary>
              {item.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
        {!questions.length && (
          <p>
            Keine passende Frage gefunden.{" "}
            <Link to="/contact">Schreiben Sie uns gerne.</Link>
          </p>
        )}
      </section>
      <CTA />
    </>
  );
}
function Blog({ slug }: { slug?: string }) {
  const data = useSiteData();
  const [search, setSearch] = useState("");
  const posts = data.blog_posts
    .filter((p) => p.published)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) return <Missing />;
    return (
      <article className="fm-blog-article fm-wrap">
        <nav className="fm-breadcrumb" aria-label="Brotkrümelnavigation">
          <Link to="/">Startseite</Link>
          <span>/</span>
          <Link to="/blog">Blog</Link>
        </nav>
        <span className="fm-eyebrow">
          BLOG · <time dateTime={post.created_at}>{date(post.created_at)}</time>
        </span>
        <h1>{post.title}</h1>
        {post.image_url && (
          <img
            className="fm-blog-cover"
            src={imageUrl(post.image_url, 1400)}
            alt={post.title}
          />
        )}
        <div className="fm-prose">
          <Markdown>{post.content.replace(/^# [^\n]+\n+/, "")}</Markdown>
        </div>
        <Link className="fm-text-link" to="/blog">
          ← Alle Beiträge
        </Link>
      </article>
    );
  }
  const shown = posts.filter((p) =>
    (p.title + " " + p.content)
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase()),
  );
  return (
    <>
      <PageIntro
        eyebrow="BEITRÄGE & ARTIKEL"
        title="Unser Blog."
        description="Alle Beiträge aus unserem Blogarchiv."
      />
      <section className="fm-wrap fm-section-bottom">
        <label className="fm-search">
          Beiträge durchsuchen
          <input
            type="search"
            value={search}
            placeholder="Suchbegriff eingeben"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <p className="fm-result-count" aria-live="polite">
          {shown.length} Beiträge
        </p>
        <div className="fm-blog-grid">
          {shown.map((post) => (
            <article key={post.id}>
              {post.image_url && (
                <Link to={"/blog/" + post.slug}>
                  <img
                    src={imageUrl(post.image_url, 750)}
                    alt={post.title}
                    width="750"
                    height="500"
                    loading="lazy"
                  />
                </Link>
              )}
              <div>
                <time className="fm-eyebrow" dateTime={post.created_at}>
                  {date(post.created_at)}
                </time>
                <h2>
                  <Link to={"/blog/" + post.slug}>{post.title}</Link>
                </h2>
                <p>
                  {plainText(
                    post.meta_description ||
                      post.content.replace(/^# [^\n]+\n+/, ""),
                  ).slice(0, 160)}
                </p>
                <Link className="fm-text-link" to={"/blog/" + post.slug}>
                  Weiterlesen <ArrowUpRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {!shown.length && <p>Keine Beiträge zu diesem Suchbegriff gefunden.</p>}
      </section>
    </>
  );
}
function Contact() {
  const data = useSiteData();
  return (
    <>
      <PageIntro
        eyebrow="KONTAKT & ANFRAGE"
        title="Jedes besondere Fest beginnt mit einer Idee."
        description="Wir freuen uns darauf, Ihre kennenzulernen. Schreiben Sie uns oder rufen Sie direkt an."
      />
      <section className="fm-wrap fm-contact-grid">
        <aside>
          <span className="fm-eyebrow">PERSÖNLICH FÜR SIE DA</span>
          <h2>
            Lassen Sie uns
            <br />
            ins Gespräch kommen.
          </h2>
          <a className="fm-contact-phone" href="tel:+4369916002800">
            +43 699 1600 2800
          </a>
          <a href="mailto:info@cateringandmore.at">info@cateringandmore.at</a>
          <div className="fm-contact-address">
            <h3>Sie finden uns in Wien</h3>
            <p>{data.contact_info.find((r) => r.type === "address")?.value}</p>
            <p>{data.contact_info.find((r) => r.type === "hours")?.value}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Handelskai+265+1020+Wien"
              target="_blank"
              rel="noopener noreferrer"
              className="fm-text-link"
            >
              Route planen <ArrowUpRight size={15} />
            </a>
          </div>
        </aside>
        <ContactForm />
      </section>
    </>
  );
}
function Legal({ slug }: { slug: string }) {
  const data = useSiteData();
  const page = data.pages.find((p) => p.slug === slug);
  return (
    <article className="fm-wrap fm-legal">
      <h1>{page?.title || slug}</h1>
      <div className="fm-prose">
        <Markdown>
          {page?.content ||
            "Dieser Inhalt ist derzeit nicht verfügbar. Bitte kontaktieren Sie uns."}
        </Markdown>
      </div>
    </article>
  );
}
function Missing() {
  return (
    <section className="fm-wrap fm-missing">
      <span className="fm-eyebrow">404 · SEITE NICHT GEFUNDEN</span>
      <h1>
        Hier geht es leider
        <br />
        nicht weiter.
      </h1>
      <p>
        Vielleicht wurde die Seite verschoben. Entdecken Sie unser Catering oder
        kontaktieren Sie uns direkt.
      </p>
      <Button to="/">Zur Startseite</Button>
    </section>
  );
}
function CurrentSEO({ path }: { path: string }) {
  const data = useSiteData();
  const source = seoPages.find((p) => p.path === path);
  const post = path.startsWith("/blog/")
    ? data.blog_posts.find((p) => p.published && p.slug === path.slice(6))
    : undefined;
  const page: SeoPage = post
    ? {
        path,
        label: post.title,
        title: post.meta_title || post.title,
        description: plainText(post.meta_description || post.content).slice(
          0,
          160,
        ),
        article: {
          ...post,
          body: post.content,
          description: post.meta_description,
        } as any,
      }
    : source || {
        path,
        label: "Seite nicht gefunden",
        title: "Seite nicht gefunden | " + SITE_NAME,
        description: "Die gesuchte Seite wurde nicht gefunden.",
      };
  const excluded = path.startsWith("/blog/") ? !post : !source;
  const faqs = path === "/faq" ? ordered(data.faq_items) : pageFAQs[path] || [];
  const graph = pageGraph(page, faqs as any);
  const company = graph["@graph"][0] as any;
  company.name = data.company_info[0]?.name || SITE_NAME;
  company.logo = data.company_info[0]?.logo_url || SITE_LOGO;
  company.image = company.logo;
  return (
    <Helmet>
      <html lang="de-AT" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta
        name="robots"
        content={
          excluded ? "noindex,follow" : "index,follow,max-image-preview:large"
        }
      />
      <link rel="canonical" href={canonicalUrl(path)} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="de_AT" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:url" content={canonicalUrl(path)} />
      <meta property="og:type" content={post ? "article" : "website"} />
      <meta property="og:image" content={post?.image_url || company.logo} />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={post?.image_url || company.logo} />
      <script type="application/ld+json" id="seo-graph">
        {serializeJsonLd(excluded ? {} : graph)}
      </script>
    </Helmet>
  );
}
export function PublicSite() {
  const location = useLocation();
  const path = canonicalPath(location.pathname);
  let content;
  if (path === "/") content = <Home />;
  else if (path === "/about" || path === "/sustainability")
    content = (
      <InformationPage type={path.slice(1) as "about" | "sustainability"} />
    );
  else if (path === "/services") content = <Services />;
  else if (path === "/catering") content = <Catering />;
  else if (path === "/equipment") content = <Gallery equipment />;
  else if (path === "/gallery") content = <Gallery />;
  else if (path === "/references") content = <Gallery references />;
  else if (path === "/faq") content = <FAQ />;
  else if (path === "/contact") content = <Contact />;
  else if (path === "/blog") content = <Blog />;
  else if (path.startsWith("/blog/")) content = <Blog slug={path.slice(6)} />;
  else if (["/impressum", "/datenschutz", "/agb"].includes(path))
    content = <Legal slug={path.slice(1)} />;
  else content = <Missing />;
  return (
    <div className="fm-site">
      <CurrentSEO path={path} />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {content}
        {path === "/contact" && <PageFAQ />}
      </main>
      <SiteFooter />
    </div>
  );
}

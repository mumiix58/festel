import publishedPosts from "../content/blog.json";
export const SITE_URL = "https://cateringandmore.at";
export const SITE_NAME = "FEST'LMACHER";
export const SITE_LOGO =
  "https://jlesdhrfqsqsotwmhysn.supabase.co/storage/v1/object/public/images/logos/lzmx1xerz7o.jpg";
export const plainText = (value: string) =>
  value
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#*`_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
export const blogPosts = publishedPosts
  .filter((p) => p.published)
  .map((p) => ({
    ...p,
    body: p.content.replace(/^# [^\n]+\n+/, ""),
    description: plainText(
      p.meta_description || p.content.replace(/^# [^\n]+\n+/, ""),
    ).slice(0, 160),
  }))
  .sort((a, b) => b.created_at.localeCompare(a.created_at));
export interface SeoPage {
  path: string;
  label: string;
  title: string;
  description: string;
  type?: string;
  service?: string;
  noindex?: boolean;
  article?: (typeof blogPosts)[number];
}
export const seoPages: SeoPage[] = [
  {
    path: "/",
    label: "Startseite",
    title: "Catering Wien für Hochzeiten & Firmenfeiern | FEST'LMACHER",
    description:
      "Catering und Eventservice in Wien: individuelle Menüs, Buffets und persönliche Planung für Hochzeiten, Firmenfeiern und private Veranstaltungen.",
  },
  {
    path: "/about",
    label: "Über uns",
    title: "Über uns – Catering & Eventservice Wien | FEST'LMACHER",
    description:
      "Lernen Sie FEST'LMACHER kennen: Ihr Team für Catering, persönliche Beratung und die Planung Ihrer Veranstaltung in Wien.",
    type: "AboutPage",
  },
  {
    path: "/services",
    label: "Dienstleistungen",
    title: "Catering & Event-Dienstleistungen Wien | FEST'LMACHER",
    description:
      "Catering, Eventplanung und Service für Hochzeiten, Firmenveranstaltungen und private Feiern in Wien. Entdecken Sie unsere Leistungen.",
    service: "Catering und Eventservice",
  },
  {
    path: "/catering",
    label: "Catering & More",
    title: "Catering & Veranstaltungsausstattung Wien | FEST'LMACHER",
    description:
      "Speisen, Service und die passende Ausstattung für Ihre Veranstaltung in Wien. Planen Sie Ihr Catering individuell mit unserem Team.",
    service: "Catering",
  },
  {
    path: "/equipment",
    label: "Equipment",
    title: "Event-Equipment & Ausstattung Wien | FEST'LMACHER",
    description:
      "Geschirr, Besteck und Gläser für Ihre Veranstaltung. Entdecken Sie unsere Event-Ausstattung und fragen Sie ein individuelles Angebot an.",
    service: "Veranstaltungsausstattung",
  },
  {
    path: "/sustainability",
    label: "Bio & Nachhaltigkeit",
    title: "Bio & Nachhaltigkeit beim Catering | FEST'LMACHER Wien",
    description:
      "Erfahren Sie mehr über unseren Ansatz zu Bio und Nachhaltigkeit beim Catering und sprechen Sie mit uns über Ihre Wünsche.",
  },
  {
    path: "/faq",
    label: "Häufige Fragen",
    title: "Catering FAQ: Buchung, Planung & Angebote | FEST'LMACHER",
    description:
      "Antworten auf häufige Fragen zu Catering, Buchung, Probeessen, Allergien und Veranstaltungsplanung bei FEST’LMACHER in Wien.",
    type: "FAQPage",
  },
  {
    path: "/references",
    label: "Referenzen",
    title: "Catering-Referenzen & Veranstaltungen | FEST'LMACHER",
    description:
      "Einblicke in unsere Catering-Projekte und Veranstaltungen. Entdecken Sie Referenzen und Ideen für Ihre eigene Feier.",
    type: "CollectionPage",
  },
  {
    path: "/contact",
    label: "Kontakt",
    title: "Catering in Wien anfragen & Kontakt | FEST'LMACHER",
    description:
      "Fragen Sie Catering für Ihre Veranstaltung in Wien an. Senden Sie uns Ihre Wünsche und den Veranstaltungszeitraum über das Kontaktformular.",
    type: "ContactPage",
  },
  {
    path: "/impressum",
    label: "Impressum",
    title: "Impressum | FEST'LMACHER",
    description:
      "Unternehmens- und Kontaktangaben von FEST’LMACHER. Informationen zum Betreiber dieser Website.",
  },
  {
    path: "/datenschutz",
    label: "Datenschutz",
    title: "Datenschutz | FEST'LMACHER",
    description:
      "Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten auf der Website von FEST’LMACHER.",
  },
  {
    path: "/agb",
    label: "AGB",
    title: "Allgemeine Geschäftsbedingungen | FEST'LMACHER",
    description:
      "Allgemeine Geschäftsbedingungen und Vertragsinformationen von FEST’LMACHER.",
  },
];
seoPages.push(
  {
    path: "/gallery",
    label: "Galerie",
    title: "Galerie: Catering & Veranstaltungen Wien | FEST’LMACHER",
    description:
      "Bilder von Hochzeiten, Firmenveranstaltungen, Catering und Eventausstattung.",
    type: "CollectionPage",
  },
  {
    path: "/blog",
    label: "Blog",
    title: "Blog & Beiträge | FEST’LMACHER",
    description: "Alle veröffentlichten Beiträge im Blog von FEST’LMACHER.",
    type: "CollectionPage",
  },
  ...blogPosts.map((post) => ({
    path: "/blog/" + post.slug,
    label: post.title,
    title: post.meta_title || post.title,
    description: post.description,
    article: post,
  })),
);
export const seoAliases: Record<string, string> = {
  "/uber-uns": "/about",
  "/dienstleistungen": "/services",
  "/catering-and-more/equipment": "/equipment",
  "/catering-and-more": "/catering",
  "/bio-nachhaltigkeit": "/sustainability",
  "/sss": "/faq",
  "/referenzen": "/references",
  "/kontakt": "/contact",
  "/nachhaltigkeit": "/sustainability",
  "/termin": "/contact",
};
export const normalizePath = (value: string) =>
  "/" + value.split(/[?#]/)[0].split("/").filter(Boolean).join("/");
export const canonicalPath = (value: string) =>
  seoAliases[normalizePath(value)] || normalizePath(value);
export const canonicalUrl = (value: string) => SITE_URL + canonicalPath(value);
export const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
export const business = {
  "@type": "FoodEstablishment",
  "@id": SITE_URL + "/#organization",
  name: SITE_NAME,
  url: SITE_URL + "/",
  logo: SITE_LOGO,
  image: SITE_LOGO,
  telephone: "+4369916002800",
  email: "info@cateringandmore.at",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Handelskai 265",
    addressLocality: "Wien",
    postalCode: "1020",
    addressCountry: "AT",
  },
};
export function pageGraph(
  page: SeoPage,
  faqs: { question: string; answer: string }[] = [],
) {
  const url = canonicalUrl(page.path);
  const baseType = page.type || "WebPage";
  const type = faqs.length
    ? baseType === "FAQPage"
      ? "FAQPage"
      : [baseType, "FAQPage"]
    : baseType === "FAQPage"
      ? "WebPage"
      : baseType;
  const webPage = {
    "@type": type,
    "@id": url + "#webpage",
    url,
    name: page.title,
    description: page.description,
    inLanguage: "de-AT",
    isPartOf: { "@id": SITE_URL + "/#website" },
    about: { "@id": SITE_URL + "/#organization" },
    ...(page.path !== "/"
      ? { breadcrumb: { "@id": url + "#breadcrumb" } }
      : {}),
    ...(faqs.length
      ? {
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : {}),
  };
  const graph: object[] = [
    { ...business },
    {
      "@type": "WebSite",
      "@id": SITE_URL + "/#website",
      url: SITE_URL + "/",
      name: SITE_NAME,
      inLanguage: "de-AT",
      publisher: { "@id": SITE_URL + "/#organization" },
    },
    webPage,
  ];
  if (page.path !== "/")
    graph.push({
      "@type": "BreadcrumbList",
      "@id": url + "#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Startseite",
          item: SITE_URL + "/",
        },
        ...(page.path.startsWith("/blog/")
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: SITE_URL + "/blog",
              },
            ]
          : []),
        ...(page.path.startsWith("/catering-and-more/")
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: "Catering & More",
                item: SITE_URL + "/catering-and-more",
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position:
            page.path.startsWith("/catering-and-more/") ||
            page.path.startsWith("/blog/")
              ? 3
              : 2,
          name: page.label,
          item: url,
        },
      ],
    });
  if (page.article) {
    const post = page.article;
    graph.push({
      "@type": "BlogPosting",
      "@id": url + "#article",
      headline: post.title,
      description: post.description,
      url,
      datePublished: post.created_at,
      dateModified: post.updated_at,
      publisher: { "@id": SITE_URL + "/#organization" },
      mainEntityOfPage: { "@id": url + "#webpage" },
      ...(post.image_url ? { image: post.image_url } : {}),
    });
  }
  if (page.service)
    graph.push({
      "@type": "Service",
      "@id": url + "#service",
      url,
      name: page.service,
      serviceType: page.service,
      description: page.description,
      provider: { "@id": SITE_URL + "/#organization" },
      areaServed: { "@type": "City", name: "Wien" },
      mainEntityOfPage: { "@id": url + "#webpage" },
    });
  return { "@context": "https://schema.org", "@graph": graph };
}

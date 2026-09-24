import { seoPages, canonicalUrl } from "../../src/lib/seo";
import { publicBackend } from "../../src/site/data";
export async function handler() {
  try {
    const response = await fetch(
      `${publicBackend.url}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true`,
      {
        headers: {
          apikey: publicBackend.anonKey,
          Authorization: `Bearer ${publicBackend.anonKey}`,
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error("Unavailable");
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error("Invalid data");
    const paths = [
      ...seoPages
        .filter((p) => !p.path.startsWith("/blog/") && !p.noindex)
        .map((p) => p.path),
      ...posts
        .filter((p) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))
        .map((p) => "/blog/" + p.slug),
    ];
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public,max-age=0,must-revalidate",
      },
      body:
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        [...new Set(paths)]
          .map((path) => `<url><loc>${canonicalUrl(path)}</loc></url>`)
          .join("") +
        "</urlset>",
    };
  } catch {
    return {
      statusCode: 503,
      headers: { "Retry-After": "60" },
      body: "Sitemap temporarily unavailable",
    };
  }
}

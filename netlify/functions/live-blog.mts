import serverShell from "../../.seo/shell.mjs";
import { renderPage } from "../../src/site/prerender";
import { initialData, publicBackend } from "../../src/site/data";
import { serializeJsonLd } from "../../src/lib/seo";
export async function handler(event: {
  queryStringParameters?: Record<string, string>;
}) {
  const slug = (event.queryStringParameters?.slug || "").replace(/\/$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
    return { statusCode: 404, body: "Not found" };
  try {
    const response = await fetch(
      `${publicBackend.url}/rest/v1/blog_posts?select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}`,
      {
        headers: {
          apikey: publicBackend.anonKey,
          Authorization: `Bearer ${publicBackend.anonKey}`,
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) throw new Error("Content unavailable");
    const posts = await response.json();
    const exists = Array.isArray(posts) && posts.length === 1;
    const data = {
      ...initialData,
      blog_posts: exists
        ? [posts[0], ...initialData.blog_posts.filter((p) => p.slug !== slug)]
        : initialData.blog_posts.filter((p) => p.slug !== slug),
    };
    const page = renderPage(exists ? "/blog/" + slug : "/404", data);
    const base = serverShell;
    const body = base
      .replace("</head>", page.head + "</head>")
      .replace(
        '<div id="root"></div>',
        `<div id="root">${page.html}</div><script type="application/json" id="site-data">${serializeJsonLd({ blog_posts: data.blog_posts })}</script>`,
      );
    return {
      statusCode: exists ? 200 : 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public,max-age=0,must-revalidate",
      },
      body,
    };
  } catch {
    return {
      statusCode: 503,
      headers: {
        "Retry-After": "60",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: "Der Inhalt ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.",
    };
  }
}

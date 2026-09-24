import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
const { outputFiles } = await build({
  entryPoints: ["src/lib/seo.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
});
const code = outputFiles[0].text;
const seo = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
const faqs = JSON.parse(await readFile("src/content/faq.json", "utf8")).filter(
  (f) => f.isActive,
);
test("canonical URLs normalize aliases, query strings and trailing slashes", () => {
  assert.equal(
    seo.canonicalUrl("/sss/?utm_source=test"),
    seo.SITE_URL + "/faq",
  );
  assert.equal(seo.canonicalUrl("/"), seo.SITE_URL + "/");
});
test("FAQ graph matches all visible answers; business and service types are valid", () => {
  const graph = seo.pageGraph(
    seo.seoPages.find((p) => p.path === "/faq"),
    faqs,
  )["@graph"];
  const faq = graph.find((n) => n["@type"] === "FAQPage");
  assert.deepEqual(
    faq.mainEntity.map((n) => [n.name, n.acceptedAnswer.text]),
    faqs.map((f) => [f.question, f.answer]),
  );
  assert.equal(
    graph.filter((n) => n["@id"].endsWith("#organization")).length,
    1,
  );
  assert.equal(graph[0]["@type"], "FoodEstablishment");
  assert.equal(
    seo.pageGraph(seo.seoPages.find((p) => p.service))["@graph"].at(-1)[
      "@type"
    ],
    "Service",
  );
  assert.ok(!JSON.stringify(graph).includes("SearchAction"));
});
test("JSON-LD safely escapes script-closing user content", () => {
  const value = { text: '</script><script>alert("x")</script>&' };
  assert.ok(!seo.serializeJsonLd(value).includes("<"));
  assert.deepEqual(JSON.parse(seo.serializeJsonLd(value)), value);
});
test("built pages have distinct initial metadata, one canonical and one schema graph", async () => {
  const titles = new Set();
  for (const page of seo.seoPages) {
    const html = await readFile(
      "dist" + (page.path === "/" ? "" : page.path) + "/index.html",
      "utf8",
    );
    assert.equal((html.match(/<title\b[^>]*>/g) || []).length, 1);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/type="application\/ld\+json"/g) || []).length, 1);
    assert.ok(html.includes('href="' + seo.canonicalUrl(page.path) + '"'));
    assert.ok(html.includes("<h1>"));
    if (!page.article) titles.add(html.match(/<title[^>]*>(.*?)<\/title>/)[1]);
  }
  assert.equal(titles.size, seo.seoPages.filter((p) => !p.article).length);
  const faqHTML = await readFile("dist/faq/index.html", "utf8");
  assert.equal((faqHTML.match(/<details>/g) || []).length, faqs.length);
});
test("sitemap preserves live URLs and routing has dynamic published-blog validation and a 404 fallback", async () => {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.equal((sitemap.match(/<loc>/g) || []).length, seo.seoPages.length);
  assert.ok(!sitemap.includes("lastmod"));
  for (const page of seo.seoPages)
    assert.ok(
      sitemap.includes("<loc>" + seo.canonicalUrl(page.path) + "</loc>"),
    );
  const rules = await readFile("dist/_redirects", "utf8");
  assert.ok(rules.includes("/sss /faq 301!"));
  assert.ok(
    rules.includes("/blog/* /.netlify/functions/live-blog?slug=:splat 200!"),
  );
  assert.ok(rules.endsWith("/* /404.html 404\n"));
  assert.ok(
    (await readFile("dist/404.html", "utf8")).includes("noindex,follow"),
  );
});

test("all published blog URLs and full articles survive the merge", async () => {
  const source = JSON.parse(await readFile("src/content/blog.json", "utf8"));
  assert.equal(seo.blogPosts.length, source.filter((p) => p.published).length);
  for (const post of seo.blogPosts) {
    const page = seo.seoPages.find((p) => p.path === "/blog/" + post.slug);
    assert.ok(page);
    const article = seo
      .pageGraph(page)
      ["@graph"].find((n) => n["@type"] === "BlogPosting");
    assert.equal(article.headline, post.title);
    assert.equal(article.datePublished, post.created_at);
    const html = await readFile(
      "dist/blog/" + post.slug + "/index.html",
      "utf8",
    );
    assert.ok(html.includes("BlogPosting"));
    assert.ok(html.length > 3000);
  }
});

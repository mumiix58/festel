import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
await mkdir("node_modules/.cache", { recursive: true });
async function module(entry, name) {
  const file = "node_modules/.cache/" + name + ".cjs";
  await build({
    entryPoints: [entry],
    bundle: true,
    outfile: file,
    format: "cjs",
    platform: "node",
    external: [
      "react",
      "react-dom",
      "react-dom/*",
      "react-helmet-async",
      "react-router-dom",
      "react-router-dom/*",
    ],
    jsx: "automatic",
  });
  return import(pathToFileURL(process.cwd() + "/" + file).href);
}
const contact = await module("src/site/contact.ts", "contact-test");
const blog = await module("netlify/functions/live-blog.mts", "blog-test");
const sitemap = await module(
  "netlify/functions/site-sitemap.mts",
  "sitemap-test",
);
const snapshot = JSON.parse(
  await readFile("src/content/live-site.json", "utf8"),
);
const payload = {
  name: "Test",
  email: "test@example.com",
  phone: "123",
  subject: "Test",
  message: "Test message",
  event_start: "2026-12-01T12:00:00Z",
  event_end: "2026-12-01T14:00:00Z",
};
test("contact saves once and retains reply contact fields when retrying email", async () => {
  const calls = [];
  const attempt = { id: "test-id", saved: false };
  await assert.rejects(
    contact.submitContact(payload, attempt, async (url, options) => {
      calls.push([url, JSON.parse(options.body)]);
      return url.includes("/rest/")
        ? new Response("", { status: 201 })
        : new Response('{"error":"failure"}', { status: 502 });
    }),
  );
  assert.equal(attempt.saved, true);
  assert.equal(calls.length, 2);
  await contact.submitContact(payload, attempt, async (url, options) => {
    calls.push([url, JSON.parse(options.body)]);
    return new Response('{"success":true,"id":"test"}');
  });
  assert.equal(calls.length, 3);
  assert.ok(calls[2][0].endsWith("/send-contact-email"));
  assert.equal(calls[2][1].email, payload.email);
  assert.ok(calls[0][1].message.includes("Telefon: 123"));
  assert.equal(calls[0][1].id, "test-id");
  assert.ok(!("recipientEmail" in calls[2][1]));
});
test("database rejection never sends email or reports success", async () => {
  let calls = 0;
  const attempt = { id: "test-id", saved: false };
  await assert.rejects(
    contact.submitContact(payload, attempt, async () => {
      calls++;
      return new Response("", { status: 403 });
    }),
  );
  assert.equal(calls, 1);
  assert.equal(attempt.saved, false);
});
test("public SSR includes full gallery, FAQ, menu and legal content", async () => {
  const gallery = await readFile("dist/gallery/index.html", "utf8");
  for (const image of snapshot.gallery)
    assert.ok(
      gallery.includes(
        image.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;"),
      ),
    );
  const faq = await readFile("dist/faq/index.html", "utf8");
  assert.equal(
    (faq.match(/<details>/g) || []).length,
    snapshot.faq_items.length,
  );
  const catering = await readFile("dist/catering/index.html", "utf8");
  for (const item of snapshot.menu_items)
    assert.ok(catering.includes(item.name));
  const legal = await readFile("dist/impressum/index.html", "utf8");
  assert.ok(legal.includes("FN 136072g"));
  assert.ok(!legal.includes("[Firmenbuchnummer]"));
  for (const path of [
    "about",
    "services",
    "equipment",
    "sustainability",
    "references",
    "contact",
    "blog",
  ]) {
    const html = await readFile(`dist/${path}/index.html`, "utf8");
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(!html.includes("Laden..."));
  }
});
test("live blog handles new published articles, missing slugs and backend errors correctly", async () => {
  const original = global.fetch;
  try {
    global.fetch = async () =>
      new Response(
        JSON.stringify([
          {
            ...snapshot.blog_posts[0],
            slug: "new-published-article",
            title: "New article",
            content: "A fresh published article.",
          },
        ]),
      );
    const found = await blog.handler({
      queryStringParameters: { slug: "new-published-article" },
    });
    assert.equal(found.statusCode, 200);
    assert.ok(found.body.includes("A fresh published article."));
    assert.ok(found.body.includes("BlogPosting"));
    assert.ok(found.body.includes("site-data"));
    global.fetch = async () => new Response("[]");
    const missing = await blog.handler({
      queryStringParameters: { slug: "missing" },
    });
    assert.equal(missing.statusCode, 404);
    assert.ok(missing.body.includes("noindex,follow"));
    global.fetch = async () => new Response("", { status: 500 });
    assert.equal(
      (await blog.handler({ queryStringParameters: { slug: "missing" } }))
        .statusCode,
      503,
    );
  } finally {
    global.fetch = original;
  }
});
test("dynamic sitemap uses current published posts, not old snapshot slugs", async () => {
  const original = global.fetch;
  try {
    global.fetch = async () => new Response('[{"slug":"brand-new-post"}]');
    const result = await sitemap.handler();
    assert.equal(result.statusCode, 200);
    assert.ok(result.body.includes("/blog/brand-new-post"));
    assert.ok(!result.body.includes("/blog/turkey"));
    assert.ok(result.body.includes("/gallery"));
  } finally {
    global.fetch = original;
  }
});

test('each commercial page has its own visible FAQ and exactly matching schema answers', async () => {
  const { pageFAQs } = await module('src/content/page-faq.ts', 'page-faq-test');
  assert.equal(Object.keys(pageFAQs).length, 9);
  for (const [path, questions] of Object.entries(pageFAQs)) {
    const html = await readFile('dist' + (path === '/' ? '' : path) + '/index.html', 'utf8');
    assert.equal((html.match(/id="page-faq-title"/g) || []).length, 1, path);
    assert.equal((html.match(/<details>/g) || []).length, questions.length, path);
    const match = html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    const graph = JSON.parse(match[1])['@graph'];
    const faq = graph.find(node => [node['@type']].flat().includes('FAQPage'));
    assert.deepEqual(faq.mainEntity.map(item => ({question:item.name,answer:item.acceptedAnswer.text})), questions, path);
    for (const item of questions) {
      const escape = value => value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
      assert.ok(html.includes('<p>' + escape(item.answer) + '</p>'), path + ': visible answer');
    }
  }
});

import { readFile, writeFile } from "node:fs/promises";
const backend = JSON.parse(
  await readFile("src/content/public-backend.json", "utf8"),
);
const previous = JSON.parse(
  await readFile("src/content/live-site.json", "utf8"),
);
const records = await Promise.all(
  Object.keys(previous).map(async (table) => {
    const query =
      table === "blog_posts" ? "select=*&published=eq.true" : "select=*";
    const response = await fetch(`${backend.url}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: backend.anonKey,
        Authorization: `Bearer ${backend.anonKey}`,
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok)
      throw new Error(
        `Cannot synchronize ${table}: HTTP ${response.status}. Build stopped to avoid publishing stale or incomplete content.`,
      );
    const rows = await response.json();
    if (
      !Array.isArray(rows) ||
      rows.some((r) => !r || typeof r.id !== "string")
    )
      throw new Error("Invalid content: " + table);
    return [table, rows];
  }),
);
const data = Object.fromEntries(records);
await writeFile(
  "src/content/live-site.json",
  JSON.stringify(data, null, 2) + "\n",
);
await writeFile(
  "src/content/blog.json",
  JSON.stringify(data.blog_posts, null, 2) + "\n",
);
await writeFile(
  "src/content/faq.json",
  JSON.stringify(
    data.faq_items.map((f) => ({ ...f, isActive: true })),
    null,
    2,
  ) + "\n",
);
console.log(
  `Synchronized ${records.length} public content tables, ${data.gallery.length} gallery images and ${data.blog_posts.length} published posts.`,
);

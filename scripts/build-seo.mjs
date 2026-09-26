import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
const result = await build({
  entryPoints: ["src/lib/seo.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
});
const { seoPages, seoAliases, canonicalUrl } = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
const renderer = "node_modules/.cache/festel-seo-render.cjs";
await mkdir("node_modules/.cache", { recursive: true });
await build({
  entryPoints: ["src/site/prerender.tsx"],
  bundle: true,
  outfile: renderer,
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
const { renderPage } = await import(
  pathToFileURL(process.cwd() + "/" + renderer).href
);
const base = (await readFile("dist/index.html", "utf8"))
  .replace(/<title>[\s\S]*?<\/title>/gi, "")
  .replace(
    /<meta\b(?=[^>]*(?:name=["'](?:description|keywords|robots|twitter:[^"']+)|property=["']og:))[^>]*>/gi,
    "",
  )
  .replace(/<link\b(?=[^>]*rel=["']canonical)[^>]*>/gi, "")
  .replace('<html lang="de">', '<html lang="de-AT">');
function document(path) {
  const page = renderPage(path);
  return base
    .replace("</head>", page.head + "\n</head>")
    .replace('<div id="root"></div>', `<div id="root">${page.html}</div>`);
}
try {
  await mkdir(".seo", { recursive: true });
  await writeFile(".seo/shell.mjs", "export default " + JSON.stringify(base) + ";\n");
  for (const page of seoPages) {
    const dir = "dist" + (page.path === "/" ? "" : page.path);
    await mkdir(dir, { recursive: true });
    await writeFile(dir + "/index.html", document(page.path));
  }
  await writeFile("dist/404.html", document("/404"));
  await writeFile(
    "dist/admin.html",
    base.replace(
      "</head>",
      '<meta name="robots" content="noindex,nofollow"><title>Verwaltung | FEST’LMACHER</title></head>',
    ),
  );
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    seoPages
      .filter((p) => !p.noindex)
      .map((p) => `  <url><loc>${canonicalUrl(p.path)}</loc></url>`)
      .join("\n") +
    "\n</urlset>\n";
  await writeFile("dist/sitemap.xml", sitemap);
  await writeFile("public/sitemap.xml", sitemap);
  const redirects = [
    "/blog /blog/index.html 200!",
    "/blog/* /.netlify/functions/live-blog/:splat 200!",
    ...Object.entries(seoAliases).map(([from, to]) => `${from} ${to} 301!`),
    ...seoPages
      .filter((p) => p.path !== "/")
      .flatMap((p) => [
        `${p.path} ${p.path}/index.html 200`,
      ]),
    "/sitemap.xml /.netlify/functions/site-sitemap 200!",
    "/admin /admin.html 200",
    "/admin/* /admin.html 200",
    "/* /404.html 404",
  ];
  await writeFile("dist/_redirects", redirects.join("\n") + "\n");
  console.log(
    `SEO: ${seoPages.length} complete pages rendered with metadata, schema and sitemap`,
  );
} finally {
  await unlink(renderer);
}

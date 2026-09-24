# SEO implementation and deployment boundary

The repository is based on origin/main 12e6dcf. It is a React/Vite application using the Render/Mongo API. The current production Bolt application uses Supabase and has different routes and a gallery. Do not replace production with this checkout without reconciling those remaining differences.

## Implemented

- A shared route manifest generates per-route initial titles, descriptions, canonical URLs, Open Graph tags, JSON-LD and a sitemap.
- Site/business, page, breadcrumbs, services, FAQ and BlogPosting graphs use stable entity identifiers. The arbitrary footer schema injection was removed to avoid conflicting duplicate entities.
- Eight existing published FAQs are rendered with native details/summary; the same visible questions generate FAQ structured data.
- All 17 published production blog posts were imported on 2026-09-25 into src/content/blog.json. Slugs, original text, images, timestamps and source metadata are retained. The blog index and article routes were added to the navigation. Markdown is rendered without enabling raw HTML.
- Blog article bodies and FAQ answers are present in the built HTML before JavaScript. Other pages have a short visible initial summary and internal links; this is not full server-side rendering of the application.
- All 30 registered pages appear in the sitemap, without fabricated last-modified dates. The sitemap does not contain the old sample blog URLs.
- Netlify route rules provide canonical redirects, admin handling and a 404 catch-all. Dynamic CMS category routes intentionally retain a SPA fallback to avoid breaking categories not present in the build manifest. Unknown dynamic categories still need server-side validation for a true HTTP 404.
- The existing contact/email implementation was retained.

## Content and synchronization limitations

The imported blog is a versioned snapshot, not a connection to the current Supabase blog editor. Future edits in Supabase are not automatically imported into this repository. All 17 existing posts concern radio/Megaradio rather than catering; two share a title. They were preserved rather than silently removed or deindexed. Content relevance, duplicates and malformed external Markdown/image URLs remain an editorial issue requiring a decision.

The sitemap in this checkout describes this checkout, not the different live application. The live gallery and backend/admin integration are not migrated by this change. The existing German routes remain canonical here; English aliases redirect to them. Any production migration needs an explicit complete route/content mapping.

## Validation

Run `npm run build` before `npm run test:seo`; the latter checks generated output. Run `npm run test:email` for the existing email function regression suite. Browser checks verified one canonical, one JSON-LD graph, eight FAQ answers, an expandable answer, working blog navigation and a single H1 plus BlogPosting on an article.

Local HTTP testing used a plain static server, not Netlify's production redirect engine. Netlify rules are structurally checked; production status/redirect behavior still needs live validation after an authorized matching deployment.

Indexing is a Google decision. Search Console access was unavailable, so no crawl exclusions, manual actions or exact reason for the reported four indexed pages could be verified. Technical fixes do not guarantee an index count or rich results.

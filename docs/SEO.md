# Merged website and SEO implementation

The public application now uses the existing production Supabase project (`jlesdhrfqsqsotwmhysn`). The old Render/Mongo components remain in source history/files for reference but are no longer routed by App.tsx. Production has not been replaced by this work.

## Content and routing

- `src/site/` implements the new public website and authenticated content editor.
- `src/content/live-site.json` contains a build snapshot of 16 public content tables. It contains 30 gallery images, 17 published posts, 8 FAQ items, equipment, menus, about/sustainability and the existing legal content.
- `npm run sync:content` refreshes the snapshot from the existing public REST API. Netlify runs it before the build and aborts on API failures instead of publishing an incomplete snapshot.
- The browser starts immediately with the snapshot and refreshes public data from Supabase, retaining successful tables and falling back for failed requests. Content edits trigger a refresh in the same session.
- Existing production paths `/about`, `/services`, `/catering`, `/equipment`, `/sustainability`, `/references`, `/gallery`, `/faq`, `/contact`, `/blog` and published blog slugs are retained. The old repository's German paths have permanent redirects.
- The references page uses the site's published event/gallery photographs. Hard-coded awards, customer quotes and contradictory statistics from the old bundle are not presented as verified claims. Unrelated outbound footer promotions are not part of the new navigation. Original blog posts are preserved without silently deleting or deindexing them.

## Design and interaction

The design uses the real logo, burgundy, cream, editorial typography, responsive navigation and clear inquiry links. It adds gallery/equipment filters, an accessible native image dialog, FAQ/blog search and a responsive contact form. The previous loading dependence on the Render API is removed from the public site. Large admin dependencies load separately.

## Search and rendering

The build renders full public page content and matching metadata/JSON-LD for 31 routes. Organization/business, website, service, breadcrumbs, FAQ and BlogPosting records have stable identifiers. Legal text and complete blog bodies are in the initial HTML. Raw Markdown HTML is not executed.

Netlify routes every blog request through `live-blog` so newly published posts are available before another build, and unpublished/missing posts return HTTP 404. The sitemap function queries current published slugs. Backend failures return 503 instead of incorrectly removing a post with a 404. The server HTML shell is generated into an imported module under `.seo/` and bundled into the function, not exposed as a public empty page.

Non-blog static content in the initial HTML reflects the last build; browser data is refreshed from the CMS. A new Netlify build updates the initial HTML for changes to those pages. Indexing decisions remain Google's; Search Console was unavailable.

## Contact and administration

The form saves to the existing `contact_submissions` table and invokes the existing `send-contact-email` Supabase function. It retains the existing Resend sender and branded template. The visitor cannot set a recipient; delivery defaults to `catering@festlmacher.at` on the server. Successful database saves are not repeated when retrying an email failure in the same form session. Dates are validated and input is preserved after failures.

The CMS uses existing Supabase Auth with email/password, existing database RLS and the existing images bucket. There is no new user registration or permission change. It provides content CRUD, image upload and reading/responding to inquiries. Actual authenticated CMS writes were not tested because an application-admin login was unavailable; the login UI and compile path were checked. Supabase dashboard sign-in is not the same as a website administrator session.

`public-backend.json` contains the existing public anonymous browser key, not a service-role key or a Resend credential. Private submissions and user credentials are never included in the public snapshot. The old Netlify email function remains as a fallback implementation; its template helper has been moved out of the functions entry directory.

## Validation and deployment status

- Production build and all 16 tests: SEO (6), merged site/functions/contact (5), existing email regressions (5).
- Real public Supabase reads: 16-table synchronization plus live blog and sitemap handler requests returned HTTP 200.
- Browser checks: desktop and 390px mobile layout, no horizontal overflow, one canonical/schema/H1, mobile menu, gallery filtering and modal, FAQ search, invalid date rejection/input preservation and admin login UI.
- Netlify function packaging checked with the official zip-it-and-ship-it bundler.
- No new real email was sent in this change. Existing receiving mailbox/MX concerns are not solved by a visual/backend merge.
- GitHub CLI accounts have no write permission to mumiix58/festel (403). No Netlify CLI credential is configured. These changes are committed locally, not pushed or deployed.
- Existing dependency audit findings remain; broad dependency upgrades were not mixed into this merge.

## Page-specific conversational FAQs

Nine commercial pages now include four distinct German questions each (36 total), written around natural planning questions rather than keyword lists. `src/content/page-faq.ts` supplies both the visible expandable answers and FAQPage JSON-LD. Existing page types are retained alongside FAQPage. Questions and answers are present in the initial rendered HTML. The standalone FAQ remains unchanged. Legal pages and unrelated existing blog articles do not receive generic catering FAQs.

The production build and 12 SEO/site tests passed after this addition, including exact visible/schema answer matching across all nine pages. Browser verification confirmed the sustainability FAQ expands correctly. These additions remain local until deployment access is available.

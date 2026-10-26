# Site audit — cacreevoyage.com

Date: 2026-10-26 · Commit audited: `3a98cd1` (main) · Phase 1/2 only. **No code changed.**
Files written: this report, `audit/screenshots/` (screenshots of the live site taken with Edge, so the H.264 videos play as they do for real visitors).

---

## 0. What the site is

**Stack:** Next.js 15.5 (App Router) and Payload 3.43 in one app. Postgres on **Neon** (eu-central-1, scale-to-zero). Media on **Cloudflare R2**. Hosted on **Hostinger** (hcdn CDN, HTTP/1.1). Tailwind, Framer Motion, Swiper. The app defines FR/EN localisation in Payload, and the UI language comes from `?locale=` in the URL.

**What is in the database right now** (Neon, read-only query): 1 tour, 11 destinations, 7 testimonials, **0 FAQ**, **0 articles**, **0 inquiries**, **0 orders**, 44 media files (16 videos, 173 MB). The `hero-switcher` and `hero-gallery` globals are **empty**.

### Pages
| Route | Rendering | Fed by |
|---|---|---|
| `/` | Dynamic | see section list below |
| `/tours` | Dynamic (`force-dynamic`) | `tours` (isAvailable), `subpage-heroes.toursHero` |
| `/tours/[slug]` | Dynamic | `tours` depth 2, `site-settings` |
| `/destinations` | Dynamic | `destinations`, `tours` (for the "Départ prévu" link map), `subpage-heroes.destinationsHero` |
| `/destinations/international`, `/national` | Dynamic | `destinations` by scope. **Hero text is hardcoded** |
| `/destinations/[slug]` | Dynamic | `destinations` + its tours. With no active tour it shows the "inspiration" layout |
| `/sur-mesure` | Dynamic | the form opens WhatsApp only and **saves nothing in the CMS** |
| `/contact`, `/about`, `/blog`, `/cgv`, `/confidentialite`, `/mentions-legales` | Static (built once) | texts are mostly hardcoded in the page files |
| `/checkout` | Static and client-side | posts to `/api/orders` |

### Home page, sections in order (see `audit/screenshots/home-*.png`, `home-scroll-*`)
| # | Section | Component | Source of content |
|---|---|---|---|
| — | Navbar, WhatsApp bubble, cookie banner, starfield (dark) / film grain (light) | `layout.tsx` | Phone/email come from `site-settings`. **Logo, menu and all labels are hardcoded** |
| 1 | Hero: 4 expanding video panels (desktop), swipe carousel (mobile) | `HeroGallery.tsx` | **100% hardcoded** (`HeroGallery.tsx:7-12`): 4 MP4s in `/public`. The `hero-gallery` global exists in the admin but is never read |
| 2 | "Nos Voyages d'Exception" | `FeaturedToursGrid` | `tours` (isFeatured, otherwise the latest) |
| 3 | "Évasions Internationales" and "Trésors du Maroc" swipers, cursor image trail | `DestinationSwiper`, `CursorTrail` | `destinations` (headerMedia: **11 autoplaying videos**). Titles hardcoded |
| 4 | Activities | `HomepageActivities` | `activities-config` global ✅ |
| 5 | "Window" video switcher | `HeroVideoSwitcher` | `hero-switcher` global, which is **empty**, so 4 hardcoded `/public` videos plus frame PNGs are shown |
| 6 | Philosophy plus Google/Trustpilot badges | page.tsx | Text hardcoded in `i18n/dictionaries.ts`. Badges come from `site-settings.reviewBadges` ✅ |
| 7 | FAQ | `FAQAccordion` | `faq`, fetched **client-side**. 0 entries, so the section is hidden |
| 8 | "Prêt à partir ?" CTA | page.tsx | dictionaries.ts |
| 9 | Video testimonials by destination | `DestinationTestimonials` | `testimonials` ✅ |
| 10 | Partners | `PartnersSection` | `partners-config` ✅ |
| 11 | "120+ aventures" review grid | `TestimonialsSection` | `testimonials`. Title hardcoded. **Images broken** (grey cards) |
| 12 | Instagram | `InstagramEmbed` | Elfsight third-party widget (free plan badge visible) |
| 13 | Footer | `Footer` | Contact comes from settings. **Destination lists and "© 2025" hardcoded** |

**Unused code:** 13 components are never imported: `PortalHero`, `HeroGallery3D`, `CinematicPanel`, `AmbientBackground`, `AmbientCanvas`, `CampfireGlow`, `DestinationCarousel`, `MagneticCursor`, `TestimonialsCarousel`, `TrustStats`, `StoryTimeline`, `gradient-heading`, `inspiration-coverflow`. `ReelsShowcase` is imported but never rendered (`page.tsx:6`). The `hero-portal-config` global and `public/hero-frames/` (142 JPGs, 41 MB) belong to the old scroll-canvas hero, which is no longer used.

> Please confirm this picture is right before any fix starts.

---

## 1. Baseline

### Live response times (curl, warm, 3 runs each)
| Page | TTFB | HTML size |
|---|---|---|
| `/` | 0.56–0.75 s (**3.50 s cold**, `x-hcdn-upstream-rt: 3.496`) | **261 KB** (113 KB of it is the serialized Payload data) |
| `/tours`, `/destinations` | 0.31–0.33 s | 49 / 94 KB |
| `/about`, `/contact`, `/blog` (static) | 0.16–0.20 s, CDN `HIT` | 42–54 KB |

The dynamic pages are sent with `Cache-Control: private, no-cache, no-store` (`x-hcdn-cache-status: DYNAMIC`), so every visit hits Node and then Neon. The 3.5 s cold hit matches Neon waking up: `compute_last_active_at` = 13:59:25, which is my first request.

### `npm run build` (passes, lint and types OK)
```
ƒ /                        19.5 kB   200 kB
ƒ /tours                    3.9 kB   155 kB
ƒ /tours/[slug]            14.2 kB   169 kB
ƒ /destinations             1.75 kB  113 kB
ƒ /destinations/[slug]      3.27 kB  141 kB
ƒ /sur-mesure               4.66 kB  151 kB
○ /about /contact /blog /cgv …  ~107 kB
○ /sitemap.xml /robots.txt   (built once, never refreshed)
Shared by all: 103 kB
```
Everything public except the legal and info pages is **Dynamic**. Causes: `searchParams` (the locale) on every page, plus `export const dynamic = 'force-dynamic'` on 7 routes.

### Home page JS (gzip, from the build manifest): 197 KB
React/Next runtime 98 KB · **framer-motion 39 KB** (chunk 6120, used in 32 files, no `LazyMotion`) · **Swiper and lucide 25 KB** · page 14.5 KB.

### Lighthouse, mobile (Edge, simulated throttling)
| Page | Perf | FCP | LCP | TBT | CLS | Weight | Video |
|---|---|---|---|---|---|---|---|
| `/` | **25** | **18.0 s** | **35.8 s** | 3,510 ms | 0 | **104.7 MB** | 103.2 MB |
| `/tours/zanzibar-…` | 56 | 2.1 s | 5.6 s | 610 ms | 0 | 23.3 MB | 22.1 MB |
| `/destinations` | 59 | 2.1 s | 4.3 s | 950 ms | 0 | 41.7 MB | 41.4 MB |

On the home page, Lighthouse's **LCP element is the cookie-banner text**, because the hero never paints anything (no poster image). Accessibility is 90 and SEO 100 on the inner pages (see notes in D).

### What the screenshots show
- `home-scroll-desktop-t1.png`: 3.5 s after load the active **Zanzibar hero panel is still empty**, while a hidden panel (Vietnam) has painted first.
- `home-scroll-mobile-t1.png`: the mobile hero and even the logo are still blank at 3.5 s.
- `destinations-desktop.png`: the **Zanzibar card is blank**. Its media is a 40 MB `.MOV` (`video/quicktime`).
- `home-scroll-desktop-07.png`: the "120+ aventures" review cards show grey image areas.
- `home-scroll-desktop-04.png`: the switcher section stays black while 8–11 MB videos load. The inactive buttons are almost unreadable.

---

## 2. Findings

Impact: H/M/L · Effort: S (<1 h) / M (half a day) / L (1 day or more)

### A. Video and assets (the main reason the site feels slow)
| # | Problem | Evidence | Fix | Imp | Eff |
|---|---|---|---|---|---|
| A1 | **25 autoplaying `<video>` on the home page, all downloading at once.** No `preload`, no poster, no lazy loading. 47 media requests on desktop, 53 on mobile | Live HTML has 25 `<video autoplay>`. Total referenced ≈ **153 MB**. LH: 103 MB of video transferred | A small `LazyVideo` wrapper (IntersectionObserver): play only when visible, `preload="none"` otherwise, `poster` always. Use it in HeroGallery, DestinationSwiper, HeroVideoSwitcher, destinations pages, tour hero | **H** | S–M |
| A2 | Hero renders **both** the desktop and mobile versions, so 8 videos for 4 slides, and the hidden variant downloads too | `HeroGallery.tsx:83` and `:145` | Only the active panel or slide autoplays. The others show the poster (same look as now, since inactive panels are dimmed) | **H** | S |
| A3 | No poster on any video, so the hero is an empty box for seconds (LCP = cookie text) | screenshots t0/t1, LH LCP element | Poster JPG/WebP for each video (the `hero-gallery` global already has a required `posterImage` field) | **H** | S |
| A4 | Very heavy source files: Zanzibar card **40 MB `.MOV`** (does not play, shows blank), `turquie.mp4` 18 MB, `fahs lmher.mp4` 13 MB, hero `tanzanie…mp4` 11 MB, switcher videos 8–11 MB each | `curl -I` sizes above, screenshot | Re-encode to H.264 MP4, 720p, about 1–3 MB, no audio, `+faststart`. Replace the `.MOV` in the CMS. Add a size/format check on Media uploads (the same idea already exists in `HeroGallery.ts:96`) | **H** | M |
| A5 | No `Cache-Control` on any video: `/public` MP4s and R2 have `ttl=0` | LH `uses-long-cache-ttl`, `curl -I` | `headers()` in `next.config.ts` for `/:path*.mp4`, plus R2 bucket or Cloudflare cache rule | M | S |
| A6 | Two 4.7–5.7 MB frame PNGs marked `priority`, so they are **preloaded at 100vw** on first load, mid-page | `HeroVideoSwitcher.tsx:90,92`, live `<link rel=preload>` | Remove `priority`. Export the frames as WebP/AVIF | M | S |
| A7 | `CursorTrail` preloads **every** destination image at full size on desktop, unoptimised | `CursorTrail.tsx:56-59`, `:179 unoptimized` | Preload on first hover only, using `/_next/image?w=256` | M | S |
| A8 | `next/image` with `fill` and no `sizes` on the destination grids, so it downloads at 100vw | `destinations/page.tsx:160`, `national/page.tsx:79`, `international`, `[slug]/page.tsx:92,192` | Add `sizes="(max-width:768px) 100vw, 33vw"` | M | S |
| A9 | Image optimiser cache is only 60 s, so images are re-encoded constantly | `/_next/image` → `max-age=60, x-nextjs-cache: STALE` | `images.minimumCacheTTL: 2592000` | M | S |
| A10 | `StarfieldCanvas` rAF loop runs **forever, even in light mode** (it only clears the canvas), and DPR is not capped | `StarfieldCanvas.tsx:260-265, 199` | Stop the loop when fully faded out and restart on theme change. `Math.min(dpr, 2)` | L | S |
| A11 | Elfsight script injected on mount for every visitor, before cookie consent | `InstagramEmbed.tsx:22-33` | Load when the section nears the viewport (IntersectionObserver) | L | S |

### B. Rendering and data (TTFB, cold starts)
| # | Problem | Evidence | Fix | Imp | Eff |
|---|---|---|---|---|---|
| B1 | **No caching of Payload data.** Every visit runs about 11 DB queries on the home page **one after another** (`await` in series), across the Hostinger→Neon network, and wakes Neon after 5 min idle (3.5 s) | `page.tsx:27-172` (sequential awaits). Headers `no-store`. Neon project `rapid-cake-99407377` suspend = default | (1) `Promise.all` the independent queries. (2) Wrap reads in `unstable_cache` with tags (`tours`, `destinations`, `globals`…). Visitors then rarely touch Neon, which also removes most cold starts | **H** | M |
| B2 | Only `site-settings` revalidates, and it purges the whole site (`revalidatePath('/', 'layout')`). Static pages (`/about`, `/contact`…) and the **sitemap** are built once and never refresh after other edits | `SiteSettings.ts:12-19`, build table | `afterChange`/`afterDelete` hooks on every collection and global calling `revalidateTag(<slug>)` (a shared helper, about 15 lines) | **H** | S |
| B3 | `getSiteSettings()` is not memoised and is called 2× per request (layout and page) | `layout.tsx:39`, `page.tsx:102`, `getSiteSettings.ts:30` | `cache()` from React plus B1 | L | S |
| B4 | Full Payload documents (importJSON, seo, gallery, sizes, createdAt…) are serialised to the browser: 113 KB of the 261 KB home HTML | live HTML: `importJSON`×15, `filesize`×41, `thumbnailURL`×41 | `select` on queries, or map to the few props each card needs | M | S–M |
| B5 | Home queries use `depth: 1` for lists that only need a URL. The tour page fetches the tour twice (metadata and page) at depth 2 | `page.tsx:33,77,97`, `tours/[slug]/page.tsx:26-32, 49-55` | `cache()`'d `getTourBySlug`, smallest useful depth | L | S |
| B6 | FAQ is fetched **in the browser** after hydration: invisible to Google, an extra request, and content pops in late | `FAQAccordion.tsx:10-23` | Fetch on the server in `page.tsx` and pass as props | M | S |
| B7 | Locale handled through `?locale=` forces **every page dynamic**. Nav links drop the parameter, so EN visitors fall back to FR on the next click | `layout`/pages read `searchParams`. `GlassNavbar.tsx:196-201`, links at `:294-344` | Short term: keep it, rely on B1/B2. Long term (optional O1): `/en/...` route segment, which lets everything be static/ISR | M | L |

### C. Client editability (Payload admin)
| # | Problem | Evidence | Fix | Imp | Eff |
|---|---|---|---|---|---|
| C1 | **The main hero cannot be edited.** The admin has a "Hero Gallery" global with title, link, poster and video fields, but the component ignores it. `heroPanels` is fetched and thrown away | `HeroGallery.tsx:7-12`, `page.tsx:108-120,179`. DB: 0 panels | Pass the global into `HeroGallery`, keeping the hardcoded list as a fallback. Same visual result | **H** | S |
| C2 | Several admin fields **do nothing**, which confuses the client: `homepageHero`, `seoDefaults`, `faviconImage`, `logoPosition`, `logoImage` (computed then unused at `GlassNavbar.tsx:223` while the PNG is hardcoded at `:254`), `contactPhone`, `youtubeUrl`, Testimonials `isHighlighted`, the whole `hero-portal-config` global. `trustStats` is read but has no field | grep: 0 uses in `app/`/`components/` | Wire the useful ones (logo, seoDefaults to metadata, isHighlighted). Hide or remove the dead ones. Delete `hero-portal-config` | **H** | M |
| C3 | Hardcoded visible text: menu and labels, "Toutes les destinations", "depuis plus de 10 ans", footer destination lists and "© 2025", "120+ aventures", "Questions Fréquentes", "Suivez-nous sur Instagram", swiper titles, `/destinations/national` and `/international` heroes, philosophy and CTA blocks (dictionaries.ts) | `GlassNavbar.tsx:30-45,608,669`, `Footer.tsx:104,114,174`, `TestimonialsSection.tsx:132`, `page.tsx:209-224`, `i18n/dictionaries.ts` | One `homepage` global (tabs: Hero, Sections, CTA, Témoignages) holding the section titles and texts. Footer destinations come from the `destinations` collection. Year from `new Date()` | M | M |
| C4 | Admin is hard to navigate: 8 globals flat in the sidebar, Tours/Destinations fields have English names and no labels, AI "importJSON" field on top of every Tour/Destination | `globals/*.ts` have no `admin.group`. `Tours.ts:36-42` | `admin.group` ("Accueil", "Pages", "Paramètres", "Leads"). French `label` on fields. `tabs` in Tours (Infos / Tarifs / Logistique / Itinéraire / SEO). Move importJSON into a collapsed sidebar block | M | M |
| C5 | Media: no `imageSizes`, no mime/size limits, `alt` not localised. The client can upload 40 MB `.MOV` files that break cards | `Media.ts:1-18` | `mimeTypes` (image/*, video/mp4, video/webm, application/pdf), size limit with a French message, a few `imageSizes` | M | S |
| C6 | No draft or live preview: every save goes live at once (fine today, worth knowing) | no `versions`/`livePreview` in config | Optional: `versions.drafts` plus `livePreview` on Tours | L | M |

### D. Missing pieces, bugs and SEO
| # | Problem | Evidence | Fix | Imp | Eff |
|---|---|---|---|---|---|
| D1 | **Contact form is broken.** A native HTML POST (`application/x-www-form-urlencoded`) to `/api/inquiries`, and Payload only parses JSON or multipart, so every submission fails validation and the visitor sees raw JSON. DB has **0 inquiries** | `contact/page.tsx:32-35`, `node_modules/payload/dist/utilities/addDataAndFileToRequest.js` | Server Action or `fetch` JSON, with success/error state, honeypot and email notification. *(I did not submit a test on production. Please confirm with one test after the fix)* | **H** | S |
| D2 | **Public GET endpoints write to the production DB:** `/api/force-seed` (creates/updates destinations and tours) and `/api/seed-testimonials`. Anyone can call them | `force-seed/route.ts:96`, `seed-testimonials/route.ts:5`, no auth | Delete both (seeding exists in `src/seed.ts`) | **H** | S |
| D3 | `/api/orders` lets the visitor set `status` (e.g. `confirmed`) and returns the full order. No spam protection | `api/orders/route.ts:8, 30, 33` | Ignore `status`, return `{ id }` only, add a honeypot | M | S |
| D4 | **Sitemap and robots point to `http://localhost:3000`**. `metadataBase` is the same, so OG URLs are wrong. The sitemap is also stale (it lists a tour slug that no longer exists) | live `/robots.txt`, `/sitemap.xml`. `.env: NEXT_PUBLIC_SERVER_URL=http://localhost:3000` | Set `NEXT_PUBLIC_SERVER_URL=https://cacreevoyage.com` in Hostinger env and rebuild. `export const revalidate = 3600` in `sitemap.ts`. Add `/tours` to it | **H** | S |
| D5 | Hero "Tanzanie" panel links to a **404** | `HeroGallery.tsx:10`, `curl /destinations/tanzanie` → 404 | Fixed by C1 (link from the CMS) or change the link now | M | S |
| D6 | Unknown tour URLs return **200** "Circuit non trouvé" (soft 404) | `tours/[slug]/page.tsx:58`, `curl /tours/does-not-exist` → 200 | `notFound()` | M | S |
| D7 | Review-grid images broken: `data.media` (often a **video**) is passed to `next/image`, and fallbacks `/images/placeholder-desert.jpg`, `/images/default-avatar.png`, `/placeholder.jpg` don't exist | `TestimonialsSection.tsx:64-65,73,87`, screenshot 07 | Use the destination image or the poster; avatar initials when there is no photo | M | S |
| D8 | No Open Graph or canonical on the home page, no JSON-LD (TravelAgency / TouristTrip / FAQPage), no `generateMetadata` on `/destinations/[slug]`, no hreflang | `curl /` meta grep: only description. `destinations/[slug]/page.tsx` has none | Metadata from the CMS `seo` fields (they already exist and are unused) plus `seoDefaults`. JSON-LD on tour pages | M | M |
| D9 | No `not-found.tsx`, `error.tsx` or `loading.tsx` in `(frontend)`: default Next 404 and errors | `find app` | Branded `not-found.tsx` and `error.tsx` | L | S |
| D10 | Theme is applied in `useEffect`, so first paint is light and then switches to dark (flash) | `GlassNavbar.tsx:120-130`, `<html>` has no `dark` class in SSR | Small inline script in `<head>` that sets the class before paint | M | S |
| D11 | Accessibility: nested `<main>` (layout and every page), low-contrast inactive switcher buttons, LH `color-contrast`, `heading-order`, `link-name` failing (90/100) | `layout.tsx:51` + `page.tsx:175`, `HeroVideoSwitcher.tsx:135`, LH | Page `<main>` → `<div>`, contrast tweak, `aria-label`s | L | S |
| D12 | No analytics or error monitoring at all. Cookie banner buttons don't control anything | grep: none | Optional: Plausible/Umami (cookieless) or GA4 behind consent | L | S |
| D13 | Security: hardcoded `PAYLOAD_SECRET` fallback. No security headers (only CSP `upgrade-insecure-requests`). 301 on `http://` but no HSTS | `payload.config.ts:56`, `curl -I` | Throw if the env var is missing. `headers()` with HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` | M | S |
| D14 | Repo hygiene: `hf.exe` (19 MB), `higgsfield.exe` (19 MB), `hf.tar.gz` (7 MB), `install.sh`, `.agents/`, `tsconfig.tsbuildinfo` tracked in git. About **84 MB unused in `/public`** (`hero-frames/` 41 MB, `maroc imssfrane.mp4` 27 MB, `cadre-voyage.png`, `FRAME.png`, `maroc imlchil.mp4`, extra logos). 13 unused components, `src/scratch/`. Unused deps: `lenis` (only CSS class names), `@aws-sdk/client-s3` (scratch only) | `git ls-files`, grep import map | Remove. *(The 3 PDFs in `/public` (40 MB) are not linked in code but may be shared externally, so check with the client first)* | L | S |
| D15 | `tours.slug` has no index and no `unique` constraint (destinations and articles do) | Neon `pg_indexes`, `Tours.ts:50` | `unique: true, index: true` (migration). Low priority with 1 tour | L | S |

---

## 3. Fix plan

### Batch 1: Quick wins (each under 1 h, no visual change)
1. **D2** Delete `/api/force-seed` and `/api/seed-testimonials`. **D3** harden `/api/orders`.
2. **D1** Fix the contact form (JSON or server action, success/error state, honeypot).
3. **D4** `NEXT_PUBLIC_SERVER_URL` in production, sitemap `revalidate`. *(The env var change is yours to do in Hostinger. I'll give the exact steps.)*
4. **A1–A3** `LazyVideo` component: play only when visible, `preload="none"`, poster. Hero autoplays only the active panel. **Expected: home transfer from ~105 MB to roughly 5–15 MB, and the hero shows an image immediately.**
5. **A5, A6, A8, A9** Cache headers for videos, remove `priority` on the frame PNGs, `sizes` on grids, `minimumCacheTTL`.
6. **A7** CursorTrail lazy preload. **A10** starfield stops in light mode.
7. **B2** `revalidateTag` hooks on every collection and global. **B3** `cache()` site settings. **B6** FAQ on the server.
8. **D5, D6, D7** Tanzanie link, `notFound()`, broken review images.
9. **C1** Hero reads the `hero-gallery` global (with the current hardcoded list as fallback).

### Batch 2: Medium
1. **B1** Cached data layer (`unstable_cache` + tags) and `Promise.all`. **Expected: home TTFB from 0.56–0.75 s to about 0.1–0.2 s, and no 3.5 s Neon wake-ups for visitors.**
2. **A4** Re-encode the heavy videos (ffmpeg, 720p, ~1–3 MB, posters) and replace the `.MOV`. **C5** Media upload limits.
3. **B4/B5** Slim the data sent to the browser (`select` / mapping).
4. **C2–C4** Admin clean-up: wire or remove dead fields, `admin.group`, French labels, Tours tabs, homepage-text global.
5. **D8** Metadata, OG, JSON-LD from existing CMS `seo` fields. **D10** theme flash. **D13** security headers. **D9** 404/error pages.

### Batch 3: Optional
- **O1 / B7** Locale in the path (`/en/...`) so all public pages can be static/ISR with hreflang. Biggest structural win, but touches every route.
- Framer Motion `LazyMotion` + `m` (~20 KB gz off every page; 32 files to touch).
- **A11** Elfsight on visibility. **D12** analytics. **C6** drafts and live preview. **D15** tours slug index.
- **D14** Repo and `/public` clean-up (about 84 MB plus 45 MB of binaries in git).
- Neon: disable scale-to-zero (paid plan) only if cold starts remain after B1.

---

## 4. What NOT to change, and why
- **The hero design** (expanding panels, parallax, vertical labels, mobile swipe), the window-frame switcher, starfield and film grain, and the motion timings. They are the brand. The fixes change *when* media loads, not how it looks.
- **No new libraries** (no video player, no image CDN, no i18n library). Native `IntersectionObserver`, `preload`, `poster` and Next caching cover everything here.
- **No framework or Payload upgrade** as part of this work. The build is clean, and an upgrade is a separate risk.
- **No move away from Hostinger, Neon or R2.** With caching (B1/B2) and lighter media (A1–A4) the current stack is fast enough. Revisit only if the numbers after Batch 2 say otherwise.
- **No block-based page builder.** The site has a fixed set of sections. Grouped globals (C3/C4) are easier for the client.
- **The `?locale=` approach stays for now.** Changing it is a routing rewrite (kept as optional O1).

# Ça Crée Voyage — End-to-End Project Overview

> **One document to rule them all.** For new clients, new AI agents, and anyone joining the project.
> **Last updated:** May 2026

---

## 1. What Is This Project?

**Ça Crée Voyage** is a luxury travel agency website built for a Moroccan-based tour operator. The platform showcases curated travel experiences (both international and domestic/Morocco), collects booking inquiries, and manages content through a headless CMS.

**The vibe:** Dark, cinematic, premium. Think "luxury fashion house" meets "National Geographic documentary." Every page feels immersive — deep navy backgrounds, glassmorphism cards, ambient glows, and cinematic video heroes.

---

## 2. Tech Stack (Simple Version)

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | Next.js 15 + React 19 | Server-side rendering, fast pages, SEO-friendly |
| **CMS / Backend** | Payload CMS 3.43 | Headless CMS — edit content via `/admin` panel |
| **Database** | PostgreSQL (Neon) | Stores all content: destinations, tours, orders, leads |
| **Media Storage** | Cloudflare R2 (S3) | Stores images & videos. Public URL: `*.r2.dev` |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS, fast development |
| **Animations** | Framer Motion | Scroll animations, page transitions, carousels |
| **Fonts** | Cormorant Garamond (headings) + Inter (body) | Luxury serif + clean sans-serif |

---

## 3. What We've Built (Completed)

### Phase 1: Foundation
- [x] Payload CMS configured with PostgreSQL database
- [x] Cloudflare R2 S3 storage for images/videos
- [x] Dark luxury design system (Ocean Navy `#0B132B`, Tropical Teal `#38A3A5`)
- [x] Glassmorphism UI components
- [x] Admin panel branding (custom logo)

### Phase 2: Content Collections (Database Tables)
- [x] **`destinations`** — 13 seeded destinations (7 international + 6 Morocco)
- [x] **`tours`** — Full tour schema with pricing, logistics, SEO, availability, story days
- [x] **`articles`** — Blog/ journal collection with categories, cover images, SEO
- [x] **`testimonials`** — Video reels (9:16 vertical) + text testimonials with ratings
- [x] **`inquiries`** — Lead capture from Sur-Mesure form (status tracking: new → contacted → converted)
- [x] **`orders`** — Booking orders with virement (bank transfer) payment flow
- [x] **`media`** — File library (images, videos) stored on R2
- [x] **`users`** — Admin accounts with roles (admin/editor)

### Phase 3: Frontend Pages
- [x] **`/` (Homepage)** — Hero video gallery, 2 destination swipers (International + Morocco), featured tours, testimonials (video + text), philosophy block, FAQ, CTA, footer
- [x] **`/destinations`** — Listing pages: `/destinations/national` and `/destinations/international`
- [x] **`/destinations/[slug]`** — Dynamic destination detail with cinematic header, related tours
- [x] **`/tours`** — All tours listing page
- [x] **`/tours/[slug]`** — Dynamic tour detail with hero video, glass info card, story timeline (9:16 horizontal scroll)
- [x] **`/sur-mesure`** — 4-step booking wizard (destination → budget → message → contact)
- [x] **`/checkout`** — Booking form with tour pre-fill via URL params
- [x] **`/checkout/success`** — Confirmation page after order submission
- [x] **`/about`** — Brand story, philosophy pillars, CTA
- [x] **`/blog`** — Article listing with categories
- [x] **`/blog/[slug]`** — Article detail page
- [x] **`/contact`** — Contact form page
- [x] **`/cgv`** — Terms & conditions
- [x] **`/confidentialite`** — Privacy policy
- [x] **`/mentions-legales`** — Legal mentions

### Phase 4: Global Settings
- [x] **`site-settings`** — Brand identity (logo, text), trust stats, social links, footer content, SEO defaults
- [x] **`payment-settings`** — Bank details for virement payments (RIB, bank name, beneficiary)

### Phase 5: Components & UX
- [x] `HeroGallery` — 4-panel cinematic video grid (desktop: hover expand, mobile: swipe)
- [x] `DestinationSwiper` — Horizontal scroll cards with image/video hover
- [x] `FeaturedToursGrid` — Masonry-style tour cards
- [x] `StoryTimeline` — Horizontal 9:16 travel story cards (day-by-day itinerary)
- [x] `TestimonialsCarousel` — Text testimonials with star ratings
- [x] `DestinationTestimonials` — Video reel showcase by destination
- [x] `TrustStats` — Animated counter bar (destinations, tours, travelers, satisfaction)
- [x] `FAQAccordion` — Expandable FAQ section
- [x] `GlassNavbar` — Fixed navigation with dropdowns, glass effect
- [x] `FloatingWhatsApp` — WhatsApp chat button (+212 661-373347)
- [x] `Footer` — 4-column professional footer
- [x] `BookingSidebar` — Tour detail booking panel with price, dates, CTA

### Phase 6: Automation & Integration
- [x] WhatsApp redirect from Sur-Mesure form (+212 661-373347)
- [x] Dual submission: API saves to CMS + WhatsApp opens
- [x] Auto slug generation from titles (sanitized: lowercase, no spaces, no accents)
- [x] Database seeding script (`npm run seed` or `/api/force-seed`)
- [x] Sitemap generation (`/sitemap.xml`)
- [x] Robots.txt generation

---

## 4. Site Map

### Frontend (What Clients See)

```
/
├── /                          (Homepage)
│   ├── Hero Gallery (4 videos)
│   ├── Évasions Internationales (swiper)
│   ├── Trésors du Maroc (swiper)
│   ├── Circuits en Vedette (grid)
│   ├── Témoignages Vidéo
│   ├── Témoignages Texte
│   ├── Notre Philosophie
│   ├── FAQ
│   └── CTA Final + Footer
│
├── /destinations
│   ├── /national              (Morocco destinations grid)
│   ├── /international         (World destinations grid)
│   └── /[slug]                (Destination detail + related tours)
│
├── /tours
│   ├── /                      (All tours listing)
│   └── /[slug]                (Tour detail: hero, timeline, booking)
│
├── /sur-mesure                (4-step inquiry wizard)
├── /checkout                  (Booking form)
│   └── /success               (Confirmation)
│
├── /blog
│   ├── /                      (Article listing)
│   └── /[slug]                (Article detail)
│
├── /about                     (Brand story)
├── /contact                   (Contact form)
├── /cgv                       (Terms & conditions)
├── /confidentialite           (Privacy policy)
└── /mentions-legales          (Legal mentions)
```

### Admin (What You Manage)

```
/admin
├── Dashboard                  (Overview of recent activity)
│
├── Collections
│   ├── Destinations           (13 seeded — add/edit/delete)
│   ├── Tours                  (Create circuits with full itinerary)
│   ├── Articles               (Blog posts, guides, stories)
│   ├── Testimonials           (Video reels + text reviews)
│   ├── Inquiries              (Leads from forms — track status)
│   ├── Orders                   (Bookings — track payments)
│   ├── Media                  (Upload images/videos to R2)
│   └── Users                  (Admin accounts)
│
└── Globals
    ├── Site Settings          (Logo, social links, footer, stats)
    └── Payment Settings       (Bank details for virement)
```

---

## 5. Data Model (How Content Connects)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Destinations   │◄────│     Tours       │────►│   Testimonials  │
│  (13 items)     │     │  (circuits)     │     │  (video + text) │
│                 │     │                 │     │                 │
│ • title         │     │ • title         │     │ • clientName    │
│ • slug          │     │ • slug          │     │ • rating        │
│ • scope         │     │ • duration      │     │ • videoReel     │
│ • theme         │     │ • destination   │     │ • tourReference │
│ • headerMedia   │     │ • pricing       │     │                 │
│ • description   │     │ • storyDays[]   │     │                 │
└─────────────────┘     │ • logistics     │     └─────────────────┘
                        │ • seo           │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │     Orders      │
                        │  (bookings)     │
                        │                 │
                        │ • tourId        │
                        │ • clientName    │
                        │ • status        │
                        │ • paymentProof  │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Inquiries    │
                        │   (leads/CRM)   │
                        │                 │
                        │ • fullName      │
                        │ • email         │
                        │ • budget        │
                        │ • status        │
                        │ • source        │
                        └─────────────────┘
```

---

## 6. The 13 Seeded Destinations

### International (7)
| Destination | Theme | Slug |
|---|---|---|
| Philippines | Ocean | `philippines` |
| Vietnam | Culture | `vietnam` |
| Zanzibar | Ocean | `zanzibar` |
| Turquie | Culture | `turquie` |
| Égypte | Desert | `egypte` |
| Kazakhstan | Mountain | `kazakhstan` |
| Brésil | Forest/Nature | `bresil` |

### Morocco — National (6)
| Destination | Theme | Slug |
|---|---|---|
| Dakhla | Ocean | `dakhla` |
| Merzouga | Desert | `merzouga` |
| Imlil | Mountain | `imlil` |
| Imilchil | Culture | `imilchil` |
| Imsfrane | Forest/Nature | `imsfrane` |
| Fhas Lmher | Forest/Nature | `fhas-lmher` |

---

## 7. Design System Cheat Sheet

| Token | Value | Used For |
|---|---|---|
| **Background** | `#0B132B` (Ocean Navy) | All page backgrounds |
| **Accent** | `#38A3A5` (Tropical Teal) | Buttons, links, active states, glows |
| **Gold** | `#C8A97E` | Luxury highlights, philosophy section |
| **Silver** | `#A0AABF` | Secondary text, descriptions |
| **Glass Card** | `bg-white/5` + `backdrop-blur-xl` | Cards, navbars, overlays |
| **Font Heading** | `Cormorant Garamond` | All titles, hero text |
| **Font Body** | `Inter` | Paragraphs, UI text |
| **Ambient Glow** | `bg-brand-blue/5` + `blur-[120px]` | Background decorative orbs |

**Rule #1:** No white/light pages. Everything sits on `#0B132B`.
**Rule #2:** All buttons have a subtle Tropical Teal glow shadow.
**Rule #3:** Cards use glassmorphism (`white/5` background + blur + `white/10` border).

---

## 8. Objectives & Roadmap

### Immediate (Do Next)
- [ ] **Populate real tour data** — Currently tours exist in schema but need real content (prices, dates, story days, images)
- [ ] **Upload destination header media** — Add cinematic videos/images to each of the 13 destinations
- [ ] **Upload tour thumbnails & hero videos** — Visual content for each tour
- [ ] **Add real testimonials** — Replace placeholder testimonials with actual client videos/reviews
- [ ] **Write blog articles** — SEO content: destination guides, travel tips, stories

### Short Term (This Month)
- [ ] **Payment integration** — CMI (Morocco) or Stripe for online payments (currently virement/bank transfer only)
- [ ] **Email notifications** — SendGrid/Resend for inquiry confirmations and order updates
- [ ] **Mobile menu** — Hamburger menu for mobile navigation (currently desktop dropdown only)
- [ ] **SEO meta tags** — Dynamic titles/descriptions for every tour and destination page
- [ ] **Multilingual** — i18n French/English/Arabic

### Medium Term (Next Quarter)
- [ ] **Client accounts** — User registration, booking history, saved favorites
- [ ] **Calendar availability** — Bookable departure dates with spot tracking
- [ ] **Newsletter** — Email subscription collection + campaign integration
- [ ] **Advanced search & filters** — Filter tours by price, duration, theme, difficulty
- [ ] **Wishlist** — Save tours for later (for guests and logged-in users)
- [ ] **Review system** — Clients can leave star ratings + text after their trip
- [ ] **Admin dashboard** — Stats, charts, conversion tracking for leads

### Long Term (Vision)
- [ ] **Live chat** — Intercom/Chatwoot integration
- [ ] **Affiliate program** — Referral tracking for travel bloggers/partners
- [ ] **Itinerary PDF generator** — Auto-generate beautiful PDF travel plans
- [ ] **Mobile app** — React Native companion app

---

## 9. Known Issues & What to Improve

### Current Issues
1. **Slug sanitization** — Fixed in code, but admin-created entries with spaces in slugs will 404. Always verify slugs are URL-safe.
2. **Header media optional** — Destinations can be created without images (shows gradient fallback). Better to require media for production.
3. **Mobile menu** — Navbar dropdown works on desktop but mobile hamburger is not fully functional.
4. **Form validation** — Sur-Mesure wizard needs stronger phone/email validation.
5. **Image optimization** — Some pages load large images; need `next/image` sizing optimization review.

### UX Improvements Needed
1. **Loading states** — No skeleton loaders for data fetching; pages show blank while loading.
2. **Empty states** — Better messaging when no tours exist for a destination.
3. **Error handling** — 404 pages are basic; need custom error boundaries.
4. **Accessibility** — ARIA labels, keyboard navigation, color contrast audit needed.
5. **Performance** — Video files are large; consider lazy loading and compression.

### Content Gaps
1. **No real tours published** — Schema is ready but no actual tour content is live.
2. **No testimonials populated** — Video reel component exists but empty.
3. **Blog is empty** — Articles collection ready but no posts written.
4. **Trust stats are default** — Site settings allow custom stats but using hardcoded fallbacks.

---

## 10. Open Questions

### For the Client
1. **Tours content** — Do you have existing tour descriptions, prices, and itineraries to import?
2. **Photos & videos** — Do you have a media library (destination photos, tour videos, client testimonials)?
3. **Pricing currency** — Should prices display in MAD, EUR, or both?
4. **Payment method** — Bank transfer (virement) only for now, or do you want Stripe/CMI integration?
5. **Team / About page** — Do you want team member photos and bios on the About page?
6. **WhatsApp number** — Is `+212 661-373347` the correct business number?
7. **Languages** — Is French-only OK for launch, or should English/Arabic be prioritized?
8. **Social media** — What are the actual Instagram/Facebook/TikTok URLs?

### For the Tech Team
1. **Database migrations** — When adding new fields, how to handle existing data migration?
2. **Backup strategy** — Is Neon PostgreSQL auto-backup sufficient?
3. **CDN caching** — Should we add Cloudflare caching layer in front of R2?
4. **Analytics** — Google Analytics 4, Plausible, or PostHog for tracking?
5. **Deployment** — Currently local/dev. What's the production hosting plan? (Vercel?)

---

## 11. How to Start Working on This Project

### For a New AI Agent
1. Read `payload.config.ts` — Understand collections and globals.
2. Read the collection files in `src/collections/` — Understand data structure.
3. Read `src/app/(frontend)/` pages — Understand routing and data fetching.
4. Check `tailwind.config.ts` — Understand brand colors and design tokens.
5. Use `bg-brand-dark` (never `#0B132B` directly) and `text-brand-blue` for consistency.
6. Always sanitize slugs: lowercase, remove accents, replace spaces with dashes.
7. When fetching by slug, use `.toLowerCase()` for case-insensitive matching.
8. The `storyDays` array in Tours is the NEW timeline format. `itineraryBlocks` is LEGACY.

### For the Client
1. Access admin at: `localhost:3000/admin` (dev) or your production URL `/admin`
2. Login with your admin credentials.
3. Add content in this order: **Media → Destinations → Tours → Articles → Testimonials**
4. To re-seed destinations: visit `http://localhost:3000/api/force-seed`
5. Update site settings (logo, footer, social links) in **Globals → Site Settings**
6. Update bank details for payments in **Globals → Payment Settings**

---

## 12. Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate TypeScript types from Payload schema
npm run generate:types

# Seed database (destinations only)
npm run seed

# Seed via browser (destinations + tours)
# Visit: http://localhost:3000/api/force-seed
```

---

## 13. File Structure (Key Files)

```
src/
├── app/
│   ├── (frontend)/           # Public website pages
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Root layout (fonts, metadata, navbar)
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── destinations/       # Destination pages
│   │   ├── tours/              # Tour pages
│   │   ├── blog/               # Blog pages
│   │   ├── checkout/           # Booking flow
│   │   ├── sur-mesure/         # Inquiry wizard
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   │
│   ├── (payload)/              # Payload CMS admin
│   │   └── admin/              # Admin panel routes
│   │
│   └── api/                    # API routes
│       ├── force-seed/         # Database seeding endpoint
│       └── ...
│
├── collections/                # Database schemas
│   ├── Destinations.ts
│   ├── Tours.ts
│   ├── Articles.ts
│   ├── Testimonials.ts
│   ├── Inquiries.ts
│   ├── Orders.ts
│   ├── Media.ts
│   └── Users.ts
│
├── globals/                    # Singleton configs
│   ├── SiteSettings.ts
│   └── PaymentSettings.ts
│
├── components/                 # Reusable React components
│   ├── HeroGallery.tsx
│   ├── DestinationSwiper.tsx
│   ├── StoryTimeline.tsx
│   ├── GlassNavbar.tsx
│   ├── Footer.tsx
│   └── ...
│
├── seed.ts                     # CLI seed script
└── payload.config.ts           # CMS configuration
```

---

## 14. Contact & Support

- **WhatsApp Business:** +212 661-373347
- **Project Location:** `c:\Users\concept\Desktop\cacree voyage payload cms`
- **Tech Stack Docs:**
  - [Next.js](https://nextjs.org/docs)
  - [Payload CMS](https://payloadcms.com/docs)
  - [Tailwind CSS](https://tailwindcss.com/docs)
  - [Framer Motion](https://www.framer.com/motion/)

---

> *This document is a living guide. Update it as the project evolves.*

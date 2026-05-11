# Ça Crée Voyage — Luxury Travel Platform

> **One document to rule them all.** Project overview, UI/UX design system, complete site map, architecture, and development guide.

---

## 1. Project Overview

**Ça Crée Voyage** is a luxury travel agency platform for a Moroccan-based tour operator. The website showcases curated travel experiences (international and domestic), collects booking inquiries, and manages all content through a headless CMS admin panel.

**The Design Philosophy:** Dark, cinematic, premium. "Luxury fashion house" meets "National Geographic documentary." Every page is immersive — deep navy backgrounds, glassmorphism cards, ambient glows, and cinematic video heroes.

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR, SEO, React Server Components |
| **CMS / Backend** | Payload CMS 3.43 | Headless content management via `/admin` |
| **Database** | PostgreSQL (Neon) | Stores all CMS content |
| **Media Storage** | Cloudflare R2 (S3) | Images & videos. Public URL: `*.r2.dev` |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **Animations** | Framer Motion | Scroll effects, transitions, carousels |
| **Fonts** | Cormorant Garamond (headings) + Inter (body) | Luxury serif + clean sans-serif |

---

## 2. UI/UX Design System

### Color Palette

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| **Ocean Navy** | `#0B132B` | `bg-brand-dark` / `text-brand-dark` | All page backgrounds |
| **Tropical Teal** | `#38A3A5` | `bg-brand-blue` / `text-brand-blue` | CTAs, links, active states, glows |
| **Desert Gold** | `#C9A84C` | `bg-brand-gold` / `text-brand-gold` | Luxury accents, philosophy section |
| **Silver** | `#A0ABC0` | `text-brand-silver` | Secondary text, descriptions |
| **Deep Navy** | `#050814` | `bg-brand-deeper` | Footer, deep sections |
| **Cloud** | `#F4F7FB` | `bg-cloud` | Rare light sections |

### Typography

| Role | Font | Weight | Usage |
|---|---|---|---|
| **Headings** | Cormorant Garamond | 400 | All titles, hero text, serif accents |
| **Body/UI** | Inter | 300–600 | Paragraphs, buttons, nav, labels |

**Rules:**
- Headings use `letter-spacing: -0.01em` and `line-height: 1.1`
- Body text uses `font-weight: 300–400` for elegance
- Uppercase labels use `tracking-[0.2em]` for luxury feel

### Glassmorphism Pattern

```css
/* Standard glass card */
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 24px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
```

**Tailwind equivalent:**
```
bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem]
```

### Ambient Glow Effects

Background decorative orbs create depth:
```
absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none
```

### Button Styles

**Primary (CTA):**
```
bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-5 rounded-full
shadow-[0_0_30px_rgba(56,163,165,0.3)] hover:shadow-[0_0_40px_rgba(56,163,165,0.5)]
```

**Secondary / Glass:**
```
bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md text-white
```

**Gold Accent:**
```
bg-brand-gold/20 border border-brand-gold/30 hover:bg-brand-gold/30 text-brand-gold
```

### Animation Timing

- **Standard transitions:** `duration-300` / `duration-500`
- **Panel expand:** `duration-700 ease-in-out`
- **Luxury easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **Scroll DOF:** Scale `1 → 1.08`, Blur `0px → 8px` over full viewport scroll

---

## 3. Complete Site Map

### Frontend (Public — What Clients See)

```
/
├── /                          (Homepage)
│   ├── Hero Gallery (4 CMS-driven video panels)
│   ├── Trust Stats (animated counters)
│   ├── Évasions Internationales (destination swiper)
│   ├── Trésors du Maroc (destination swiper)
│   ├── Circuits en Vedette (tours grid)
│   ├── Témoignages Vidéo (vertical reels)
│   ├── Témoignages Texte (carousel)
│   ├── Notre Philosophie (brand story block)
│   ├── FAQ (accordion)
│   └── CTA Final + Footer
│
├── /destinations
│   ├── /national              (Morocco destinations listing)
│   ├── /international         (World destinations listing)
│   └── /[slug]                (Destination detail + related tours)
│
├── /tours
│   ├── /                      (All tours listing)
│   └── /[slug]                (Tour detail: hero, timeline, booking sidebar)
│
├── /sur-mesure                (4-step inquiry wizard)
├── /checkout                  (Booking form with tour pre-fill)
│   └── /success               (Confirmation page)
│
├── /blog
│   ├── /                      (Article listing with categories)
│   └── /[slug]                (Article detail)
│
├── /about                     (Brand story + philosophy pillars)
├── /contact                   (Contact form)
├── /cgv                       (Terms & conditions)
├── /confidentialite           (Privacy policy)
└── /mentions-legales          (Legal mentions)

API Routes:
├── /api/force-seed            (Database seeding endpoint)
├── /api/orders                (Order submission)
└── /api/[...slug]             (Payload API auto-routes)

Static:
├── /sitemap.xml
└── /robots.txt
```

### Admin (CMS — `/admin`)

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
│   ├── Orders                 (Bookings — track payments)
│   ├── Media                  (Upload images/videos to R2)
│   └── Users                  (Admin accounts with roles)
│
└── Globals
    ├── Hero Gallery           (4-panel homepage video configuration)
    ├── Site Settings          (Logo, social links, footer, stats)
    └── Payment Settings       (Bank details for virement)
```

---

## 4. Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Homepage    │  │  Destinations│  │    Tours     │         │
│  │  /           │  │  /[slug]     │  │  /[slug]     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┴─────────────────┘                  │
│                           │                                     │
│                    getPayload({ config })                       │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     PAYLOAD CMS API                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Collections│ │ Globals  │ │  Auth    │ │  Upload  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌──────────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│  PostgreSQL  │ │  JWT   │ │  Sharp   │ │ Cloudflare R2│
│  (Neon)      │ │ Tokens │ │  Images  │ │  Media CDN   │
└──────────────┘ └────────┘ └──────────┘ └──────────────┘
```

### Content Collections (Database Schema)

| Collection | Key Fields | Relationships |
|---|---|---|
| **Destinations** | title, slug, scope, theme, headerMedia, description | ← linked by Tours |
| **Tours** | title, slug, duration, pricing, logistics, storyDays[], thumbnail, heroVideo, gallery | → destination |
| **Articles** | title, slug, coverImage, category, excerpt, content, relatedDestinations, relatedTours | — |
| **Testimonials** | clientName, travelerName, travelerOrigin, travelerPhoto, rating, testimonialText, videoReel, platform, tourReference | → tour (optional) |
| **Inquiries** | fullName, email, phone, destinationInterest, budget, message, travelDate, passengers, status, source | — |
| **Orders** | clientName, email, phone, tourId, passengers, travelDate, specialRequests, status, totalAmount, paymentProof | → tour |
| **Media** | filename, mimeType, filesize, width, height, url | — |
| **Users** | email, name, role, password | — |

### Globals (Single-Instance Configs)

| Global | Key Fields |
|---|---|
| **Hero Gallery** | panels[4] → {title, subtitle, linkType, destination/tour, posterImage, backgroundVideo} |
| **Site Settings** | brandIdentity(logo, favicon), contactPhone, whatsappNumber, contactEmail, social URLs, homepageHero(headline, subheadline, cta), seoDefaults, trustStats[4] |
| **Payment Settings** | bankName, beneficiaryName, rib, iban, swiftCode |

---

## 5. Component Inventory

### Layout & Navigation
| Component | File | Purpose |
|---|---|---|
| `GlassNavbar` | `src/components/GlassNavbar.tsx` | Fixed top nav with glassmorphism, dropdowns |
| `Footer` | `src/components/Footer.tsx` | 4-column professional footer |
| `FloatingWhatsApp` | `src/components/FloatingWhatsApp.tsx` | WhatsApp chat button (+212 661-373347) |

### Homepage Sections
| Component | File | Purpose |
|---|---|---|
| `HeroGallery` | `src/components/HeroGallery.tsx` | 4-panel cinematic video grid (CMS-driven) |
| `CinematicPanel` | `src/components/CinematicPanel.tsx` | Single panel: poster + video + DOF + glass card |
| `DestinationSwiper` | `src/components/DestinationSwiper.tsx` | Horizontal scroll destination cards |
| `FeaturedToursGrid` | `src/components/FeaturedToursGrid.tsx` | Masonry-style tour cards |
| `TrustStats` | `src/components/TrustStats.tsx` | Animated counter bar |
| `DestinationTestimonials` | `src/components/DestinationTestimonials.tsx` | Vertical 9:16 video reel showcase |
| `TestimonialsCarousel` | `src/components/TestimonialsCarousel.tsx` | Text testimonials with star ratings |
| `FAQAccordion` | `src/components/FAQAccordion.tsx` | Expandable FAQ section |

### Tour Detail
| Component | File | Purpose |
|---|---|---|
| `StoryTimeline` | `src/components/StoryTimeline.tsx` | Horizontal 9:16 day-by-day itinerary scroll |
| `BookingSidebar` | `src/components/BookingSidebar.tsx` | Price, dates, CTA panel |
| `TourCard` | `src/components/TourCard.tsx` | Reusable tour card (image, price, meta) |

### Sur-Mesure / Booking
| Component | File | Purpose |
|---|---|---|
| `SurMesureWizard` | `src/app/(frontend)/sur-mesure/page.tsx` | 4-step inquiry form (built-in page) |
| `CheckoutForm` | `src/app/(frontend)/checkout/page.tsx` | Booking form with pre-fill |

### Admin
| Component | File | Purpose |
|---|---|---|
| `AdminLogo` | `src/components/AdminLogo.tsx` | Custom branding in Payload sidebar |

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

## 7. Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URI=postgresql://user:pass@host.neon.tech/dbname?sslmode=require

# Payload
PAYLOAD_SECRET=your-super-secret-key-min-32-chars

# Cloudflare R2 (S3-compatible)
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_BUCKET=cacreevoyage-media
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## 8. Development Commands

```bash
# Install dependencies
npm install

# Start development server (Next.js + Payload)
npm run dev

# Build for production
npm run build

# Generate TypeScript types from Payload schema
npm run generate:types

# Seed database with 13 destinations
npm run seed

# Seed via browser (includes destinations + tours)
# Visit: http://localhost:3000/api/force-seed
```

**Admin Panel:** `http://localhost:3000/admin`

---

## 9. Deployment Checklist

- [ ] Neon PostgreSQL database is provisioned and accessible
- [ ] Cloudflare R2 bucket is public (or custom domain attached)
- [ ] All `.env` variables are set in hosting platform
- [ ] `PAYLOAD_SECRET` is at least 32 characters
- [ ] `next.config.ts` has correct image domains whitelisted
- [ ] Build passes: `npm run build`
- [ ] Admin login works and collections are visible
- [ ] Media uploads successfully to R2
- [ ] Frontend pages render without hydration errors

---

## 10. Roadmap & What's Next

### Immediate
- [ ] Populate real tour data (prices, dates, story days, images)
- [ ] Upload destination header media (videos/images for all 13)
- [ ] Add real testimonials (video reels + text reviews)
- [ ] Write blog articles for SEO

### Short Term
- [ ] Payment integration (CMI Morocco or Stripe)
- [ ] Email notifications (SendGrid/Resend for confirmations)
- [ ] Mobile hamburger menu
- [ ] Dynamic SEO meta tags per page
- [ ] Multilingual (French / English / Arabic)

### Medium Term
- [ ] Client accounts (registration, booking history, favorites)
- [ ] Calendar availability (bookable departure dates)
- [ ] Newsletter subscription
- [ ] Advanced search & filters (price, duration, theme)
- [ ] Review system (post-trip star ratings)

### Long Term
- [ ] Live chat (Intercom/Chatwoot)
- [ ] Affiliate program
- [ ] Itinerary PDF generator
- [ ] Mobile app (React Native)

---

*Built with Next.js 15, Payload CMS 3.43, PostgreSQL, Cloudflare R2, Tailwind CSS, and Framer Motion.*


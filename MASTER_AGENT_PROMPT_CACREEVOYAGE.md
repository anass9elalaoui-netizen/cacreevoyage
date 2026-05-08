# 🌍 MASTER AGENT PROMPT — ÇA CRÉE VOYAGE
## Complete Platform Build: From Zero to Production
### Version 2.0 — Full Stack + UI/UX + CMS + Infrastructure

---

> **HOW TO USE THIS DOCUMENT**
> This is the single source of truth for any AI agent or developer working on this project.
> Read it fully before touching a single file. Every section is ordered by priority.
> When a section says "do not skip", do not skip it.

---

## 🧠 PLATFORM IDENTITY

**Brand:** Ça Crée Voyage — Luxury Custom Travel Agency (Morocco-based, international clientele)
**Aesthetic:** "Dark Luxury" — Cinematic, Exclusive, Immersive. Think Rolls-Royce meets National Geographic.
**Stack:** Next.js 15 (App Router) + Payload CMS 3.x + Neon PostgreSQL + Cloudflare R2 + Tailwind CSS
**Primary Market:** French-speaking luxury travelers + International English speakers
**Core Conversion Action:** WhatsApp inquiry or Sur-Mesure form submission

---

## 🎨 DESIGN SYSTEM — COMPLETE SPECIFICATION

### Color Tokens (Tailwind config must match these exactly)
```
brand-dark:       #0B132B   → Global background. ZERO exceptions. No white pages ever.
brand-deeper:     #050814   → Footer, modals, section depth backgrounds
brand-blue:       #38A3A5   → Accent: buttons, active borders, CTAs, hover states
brand-gold:       #C9A84C   → Premium accent: prices, star ratings, featured badges
brand-white:      #FFFFFF   → Primary text
brand-silver:     #A0ABC0   → Secondary text, metadata, inactive labels
brand-glass:      rgba(255,255,255,0.05)  → Glassmorphism card backgrounds
brand-glass-md:   rgba(255,255,255,0.08)  → Hover state glassmorphism
brand-glass-dark: rgba(11,19,43,0.85)    → Overlay glassmorphism on media
```

### Typography System
```
Font 1: Cormorant Garamond (Google Fonts)
  → H1: 72px / line-height 1.1 / weight 400 (italic for hero)
  → H2: 48px / line-height 1.2 / weight 600
  → H3: 32px / line-height 1.3 / weight 600
  → Quotes, pull-quotes, destination names

Font 2: Inter (Google Fonts)
  → Body: 16px / line-height 1.7 / weight 400
  → UI Labels: 14px / weight 500
  → Metadata: 13px / weight 400 / color: brand-silver
  → Buttons: 14px / weight 500 / letter-spacing: 0.05em / UPPERCASE
```

### Spacing & Radius System
```
Section padding vertical:   py-24 (mobile: py-16)
Container max-width:        max-w-7xl mx-auto px-6 (mobile: px-4)
Card border-radius:         rounded-3xl
Button border-radius:       rounded-full
Input border-radius:        rounded-2xl
Gap between cards:          gap-6 (mobile: gap-4)
```

### Glassmorphism Rules
```css
/* Standard glass card */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 24px;

/* Hover state */
background: rgba(255, 255, 255, 0.08);
border-color: rgba(56, 163, 165, 0.3);

/* Dark overlay on media (text legibility) */
background: linear-gradient(to top, rgba(11,19,43,0.95) 0%, rgba(11,19,43,0.4) 50%, transparent 100%);
```

### Ambient Glow System
```css
/* Primary teal glow — behind hero titles, key content */
position: absolute;
width: 600px; height: 600px;
background: rgba(56, 163, 165, 0.06);
border-radius: 50%;
filter: blur(120px);
pointer-events: none;

/* Gold glow — behind featured/premium elements */
background: rgba(201, 168, 76, 0.05);
filter: blur(100px);
```

### Animation Standards
```
Page entry:       opacity 0→1, translateY 20px→0, duration 0.8s, ease-out
Hover expand:     scale 1→1.03, duration 0.4s, ease-out
Card reveal:      whileInView, threshold 0.2, once: false (re-animate on scroll back)
Stagger children: delay += 0.1s per child
Hero text:        word-by-word reveal, stagger 0.05s per word
Number counters:  animate from 0 to target over 2s when in viewport
```

---

#
# Email (Resend)

# Analytics
NEXT_PUBLIC_GA_ID=
```

### Fix 3: Hydration Error Audit
Systematically fix all hydration mismatches:
```
1. Search entire codebase for: new Date(), Math.random(), Date.now()
   → Wrap in useEffect or use suppressHydrationWarning only as last resort
2. All framer-motion components: add { ssr: false } dynamic imports OR use AnimatePresence with initial={false}
3. Check all 'use client' components for browser-only APIs (window, document, localStorage)
   → Wrap in: if (typeof window === 'undefined') return null
4. StoryTimeline.tsx: verify whileInView doesn't cause SSR/CSR mismatch
5. Run: next build 2>&1 | grep -i hydration to catch all instances
```

### Fix 4: robots.txt and sitemap.xml
Create `src/app/robots.ts`:
```ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
```
Create `src/app/sitemap.ts` — dynamic, pulls all destinations + tours from Payload:
```ts
export default async function sitemap() {
  const destinations = await getPayloadDestinations(); // fetch all slugs
  const tours = await getPayloadTours(); // fetch all slugs
  return [
    { url: '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: '/destinations', changeFrequency: 'weekly', priority: 0.9 },
    ...destinations.map(d => ({ url: `/destinations/${d.slug}`, priority: 0.8 })),
    ...tours.map(t => ({ url: `/tours/${t.slug}`, priority: 0.8 })),
    { url: '/sur-mesure', priority: 0.9 },
    { url: '/about', priority: 0.7 },
  ];
}
```

---

## 🔵 PHASE 1 — CMS ARCHITECTURE EXPANSION

### 1A. Tours Collection — Add Missing Commercial Fields
The current Tours schema is incomplete for a commercial product. Add these fields:

```ts
// In src/collections/Tours.ts — add to fields array:

// PRICING
{
  name: 'pricing',
  type: 'group',
  fields: [
    { name: 'basePrice', type: 'number', required: true, admin: { description: 'Price per person in EUR' } },
    { name: 'currency', type: 'select', options: ['EUR', 'MAD', 'USD'], defaultValue: 'EUR' },
    { name: 'priceIncludes', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'priceExcludes', type: 'array', fields: [{ name: 'item', type: 'text' }] },
    { name: 'depositPercentage', type: 'number', defaultValue: 30, admin: { description: 'Deposit % to confirm booking' } },
  ],
},

// LOGISTICS
{
  name: 'logistics',
  type: 'group',
  fields: [
    { name: 'durationDays', type: 'number', required: true },
    { name: 'durationNights', type: 'number', required: true },
    { name: 'minGroupSize', type: 'number', defaultValue: 1 },
    { name: 'maxGroupSize', type: 'number', defaultValue: 12 },
    { name: 'difficulty', type: 'select', options: ['Facile', 'Modéré', 'Exigeant', 'Difficile'] },
    { name: 'departureCity', type: 'text', defaultValue: 'Casablanca' },
    { name: 'languages', type: 'select', hasMany: true, options: ['Français', 'English', 'العربية', 'Español'] },
  ],
},

// AVAILABILITY
{
  name: 'departureDates',
  type: 'array',
  fields: [
    { name: 'date', type: 'date', required: true },
    { name: 'spotsLeft', type: 'number' },
    { name: 'status', type: 'select', options: ['Available', 'Limited', 'Full', 'On Request'] },
  ],
},

// SEO
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea', admin: { description: '150-160 chars max' } },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
    { name: 'keywords', type: 'text' },
  ],
},

// FEATURED FLAG
{ name: 'isFeatured', type: 'checkbox', defaultValue: false },
{ name: 'featuredOrder', type: 'number', admin: { condition: (data) => data.isFeatured } },
{ name: 'shortDescription', type: 'textarea', admin: { description: '2-3 sentences for cards/previews' } },
```

### 1B. Destinations Collection — Add Missing Fields
```ts
// Add to Destinations.ts:
{
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
},
{ name: 'tagline', type: 'text', admin: { description: 'One-line poetic description, e.g. "Là où le désert rencontre l\'éternité"' } },
{ name: 'heroVideo', type: 'upload', relationTo: 'media' },
{ name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media' }] },
{ name: 'highlights', type: 'array', fields: [{ name: 'highlight', type: 'text' }], admin: { description: '3-5 bullet points for the destination card' } },
{ name: 'bestTimeToVisit', type: 'text' },
{ name: 'isFeatured', type: 'checkbox', defaultValue: false },
```

### 1C. Testimonials Collection — Wire to Frontend
The collection exists but is completely absent from the UI. Update it and add frontend:
```ts
// Ensure Testimonials.ts has:
{
  name: 'travelerName', type: 'text', required: true,
},
{ name: 'travelerOrigin', type: 'text', admin: { description: 'e.g. Paris, France' } },
{ name: 'travelerPhoto', type: 'upload', relationTo: 'media' },
{ name: 'rating', type: 'number', min: 1, max: 5, required: true },
{ name: 'testimonialText', type: 'textarea', required: true },
{ name: 'tour', type: 'relationship', relationTo: 'tours' },
{ name: 'date', type: 'date' },
{ name: 'isHighlighted', type: 'checkbox', defaultValue: false },
{ name: 'platform', type: 'select', options: ['Google', 'TripAdvisor', 'Facebook', 'Direct'] },
```

### 1D. New: Inquiries Collection — Full Lead Management
```ts
// src/collections/Inquiries.ts
{
  slug: 'inquiries',
  admin: { useAsTitle: 'fullName', defaultColumns: ['fullName', 'email', 'tourInterest', 'status', 'createdAt'] },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'whatsapp', type: 'text' },
    { name: 'nationality', type: 'text' },
    { name: 'tourInterest', type: 'relationship', relationTo: 'tours', hasMany: true },
    { name: 'destinationInterest', type: 'relationship', relationTo: 'destinations', hasMany: true },
    { name: 'travelType', type: 'select', options: ['Sur-Mesure', 'Groupe', 'Voyage de Noces', 'Family', 'Corporate'] },
    { name: 'budget', type: 'select', options: ['< 1000€', '1000-2500€', '2500-5000€', '5000-10000€', '> 10000€'] },
    { name: 'travelersCount', type: 'number' },
    { name: 'preferredDates', type: 'text' },
    { name: 'flexibleDates', type: 'checkbox' },
    { name: 'message', type: 'textarea' },
    { name: 'source', type: 'select', options: ['sur-mesure-form', 'tour-page', 'contact-page', 'whatsapp'] },
    { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'contacted', 'in-progress', 'converted', 'lost'] },
    { name: 'internalNotes', type: 'textarea', admin: { description: 'Agency internal notes — not visible to client' } },
  ],
  hooks: {
    afterChange: [sendInquiryEmailNotification], // see Phase 4
  },
  access: { read: isAdminOrEditor, create: () => true },
}
```

### 1E. New: Payload Globals — Site Settings
```ts
// src/globals/SiteSettings.ts
{
  slug: 'site-settings',
  fields: [
    { name: 'whatsappNumber', type: 'text', required: true, admin: { description: 'Include country code: +212XXXXXXXXX' } },
    { name: 'email', type: 'email' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'facebookUrl', type: 'text' },
    { name: 'tiktokUrl', type: 'text' },
    { name: 'youtubeUrl', type: 'text' },
    { name: 'address', type: 'textarea' },
    {
      name: 'homepageHero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', defaultValue: 'Voyages d\'Exception, Créés Pour Vous' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Créer Mon Voyage' },
      ],
    },
    {
      name: 'seoDefaults',
      type: 'group',
      fields: [
        { name: 'defaultTitle', type: 'text', defaultValue: 'Ça Crée Voyage — Voyages de Luxe Sur-Mesure' },
        { name: 'defaultDescription', type: 'textarea' },
        { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'trustStats',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'number', type: 'text', admin: { description: 'e.g. 500+' } },
        { name: 'label', type: 'text', admin: { description: 'e.g. Voyageurs Satisfaits' } },
      ],
    },
  ],
}
```

---

## 🟠 PHASE 2 — PAGE BUILDS (COMPLETE SPEC WITH UI)

### 2A. Homepage — Complete Rebuild

**Section 1: Full-Screen Hero**
```
Layout: position relative, 100vh, overflow hidden
Background: darkest layer (#050814) → ambient glow layers → media layer → overlay
Media: autoplay muted loop playsInline video (16:9), object-cover
Overlay: linear-gradient(to bottom, transparent 0%, rgba(11,19,43,0.3) 50%, #0B132B 100%)
Ambient left glow: teal, 800px, blur 150px, opacity 0.06, top-left corner
Ambient right glow: gold, 600px, blur 120px, opacity 0.04, bottom-right corner

CONTENT (centered, z-10):
  - Small eyebrow label: "Voyages Exclusifs • Créés Sur-Mesure"
    → font: Inter 12px, letter-spacing 0.2em, color: brand-blue, uppercase
  - Main headline (2 lines):
    → "Voyages d'Exception," — Cormorant Garamond 72px italic, white
    → "Créés Pour Vous." — Cormorant Garamond 72px bold, white
    → Mobile: 44px
  - Subheadline: Inter 18px, brand-silver, max-width 520px, centered
  - CTA Group (flex row, gap-4, justify-center, mt-8):
    → Primary CTA: "Créer Mon Voyage" — bg-brand-blue, rounded-full, px-8 py-4, Inter 14px uppercase, letter-spacing 0.1em
    → Secondary CTA: "Découvrir nos Circuits" — border border-white/20, glass bg, rounded-full, same sizing
  - Scroll indicator: animated chevron-down at bottom, opacity pulsing

ANIMATION SEQUENCE (framer-motion):
  → t=0.2s: eyebrow fades in from bottom
  → t=0.5s: headline line 1 fades in word-by-word
  → t=0.9s: headline line 2 fades in word-by-word  
  → t=1.3s: subheadline fades in
  → t=1.6s: CTAs fade in with slight scale
```

**Section 2: Animated Trust Stats Bar**
```
Layout: bg-brand-glass, border-y border-white/5, py-10, backdrop-blur-md
Content: 4 stats in a grid (2x2 mobile, 4x1 desktop)
Each stat:
  - Number: Cormorant Garamond 48px, brand-blue, animate count-up when in viewport
  - Label: Inter 13px uppercase letter-spacing, brand-silver
Example stats (pull from SiteSettings Global):
  "500+" Voyageurs Satisfaits
  "8"    Années d'Excellence
  "45+"  Destinations Couvertes
  "98%"  Clients qui Reviennent
```

**Section 3: HeroGallery (existing — enhance)**
```
Keep existing component but add:
- Destination name overlay with Cormorant Garamond
- "X Tours Disponibles" badge on each panel (gold background, #C9A84C)
- On hover: show tagline text from Destination.tagline field
- Mobile: keep snap slider, add pagination dots in brand-blue
```

**Section 4: Featured Tours Strip**
```
Heading: "Nos Expériences Signature" — H2, Cormorant Garamond, centered
Subheading: Inter, brand-silver
Filter pills (horizontal scroll on mobile):
  → All | National | International | Sur-Mesure | Prestige
  → Active: bg-brand-blue text-white rounded-full px-4 py-1.5 text-sm
  → Inactive: border border-white/10 glass bg

Tour Cards (3-col desktop, 1-col mobile, horizontal scroll):
CARD ANATOMY:
  Container: rounded-3xl overflow-hidden, aspect-[3/4], relative, group cursor-pointer
  
  Background layer:
    → Image/video: object-cover, w-full h-full
    → Gradient overlay: linear-gradient(to top, #0B132B 0%, transparent 60%)
    → On hover: image scale 1.05 transition 0.6s ease
  
  Content (absolute bottom-0, left-0, right-0, p-6):
    → Scope badge: "Maroc" or "International" — brand-blue/20 bg, brand-blue text, rounded-full, text-xs uppercase
    → Tour title: Cormorant Garamond 26px, white, mt-2
    → Meta row (flex, gap-3, mt-2): 
       → 🕐 duration (e.g. "7 Jours / 6 Nuits")
       → 👥 group size range
       → ⭐ rating
       → All: Inter 12px, brand-silver
    → Price + CTA row (flex justify-between items-center, mt-4):
       → Price: "À partir de" 11px brand-silver + "2 400€/pers" 20px brand-gold font-medium
       → CTA: "Découvrir →" brand-blue, Inter 13px, hover: translate-x-1

  Hover overlay (absolute inset-0, opacity-0 group-hover:opacity-100, transition):
    → Top strip: glassmorphism bar with short description text
```

**Section 5: The "Sur-Mesure" Philosophy Block**
```
Layout: 2-column (50/50 desktop, stacked mobile)
Left: large atmospheric image (vertical, rounded-3xl, overflow hidden)
Right (padding-left: 80px desktop):
  - Eyebrow: "Notre Approche" — brand-blue, uppercase, letter-spacing
  - Heading: "Chaque Voyage est une Œuvre d'Art" — H2, Cormorant Garamond, 52px
  - Body: 3 short paragraphs, Inter 16px, brand-silver, line-height 1.8
  - 3 Icon+Text rows (flex, gap-3):
    → Custom SVG icon (simple, thin, stroke only)
    → Bold label + description
  - CTA: "Commencer mon Voyage Sur-Mesure →"
    → Underline style, brand-blue, hover: brand-gold
```

**Section 6: Testimonials Carousel**
```
Background: bg-brand-deeper, py-24
Heading: "Ce que disent nos Voyageurs" — H2 centered, Cormorant Garamond
  
Carousel (Embla or CSS scroll snap):
  Each card (glass bg, rounded-3xl, p-8, min-w-[380px]):
    - Star rating: 5 gold stars (⭐ or SVG)
    - Quote text: Cormorant Garamond 22px italic, white, line-height 1.6, max-h with ellipsis
    - Traveler row (flex, gap-3, mt-6):
      → Avatar: rounded-full 48x48, object-cover
      → Name: Inter 14px, white, font-medium
      → Origin: Inter 12px, brand-silver
      → Platform badge: "Google" / "TripAdvisor"

  Navigation: prev/next arrows, branded dots below
```

**Section 7: Destination Grid — "Nos Destinations"**
```
2 rows layout (3+2 or 4+2):
Each destination: rounded-3xl, aspect varies by grid position
Featured large card: span 2 cols, aspect-[16/9]
Small card: aspect-square

Card content: same pattern as Tour cards — overlay gradient, name, tagline
On click → /destinations/[slug]
```

**Section 8: Reels/Instagram Showcase (existing ReelsShowcase — keep)**
```
Add: "Suivez l'aventure" heading
Add: @cacreevoyage Instagram handle link below
Ensure mobile 9:16 ratio is preserved
```

**Section 9: FAQ Accordion**
```
Heading: "Questions Fréquentes" — H2, centered
Background: alternating glass cards with accordion behavior
5-8 questions covering: Sur-mesure process, booking, payment, groups, cancellation
Animation: smooth height transition on open/close, brand-blue indicator
```

---

### 2B. /sur-mesure — The Custom Travel Engine (CRITICAL PAGE)

This is the #1 lead generation page. Build it as a cinematic multi-step experience.

**Overall Layout:**
```
Full-screen dark luxury page
Ambient animated background (particle dots or subtle geometric pattern)
Fixed progress bar at top (brand-blue, thin 2px line, animates with each step)
Step indicator: "Étape 2 sur 5" — Inter, brand-silver, centered above content
```

**Step 1 — Dream Destination**
```
Heading: "Où rêvez-vous d'aller ?" — H2, Cormorant Garamond 52px, centered
Visual: grid of destination cards (same style as homepage), multi-select
Each card: image, destination name, checkbox indicator (brand-blue ring when selected)
Also: free text input "Autre destination..." with search autocomplete
CTA: "Continuer →"
```

**Step 2 — Type de Voyage**
```
Heading: "Quel type d'expérience cherchez-vous ?"
Visual: large icon cards in 2x3 grid, each with thin SVG icon + label
Options: Aventure & Nature | Luxe & Prestige | Culture & Histoire | Romance & Couple | Famille | Corporate & Incentive
Multi-select allowed
Style: glass cards, border brand-blue when selected, scale 1.02 on select
```

**Step 3 — Your Group**
```
Layout: 2 columns
Left: 
  "Combien de voyageurs ?"
  Large number counter (+/- buttons, Cormorant Garamond 64px center display)
  Adults / Children toggles
Right:
  "Quand voulez-vous partir ?"
  Custom date range picker (styled dark luxury — no white calendar)
  Alternative: "Mes dates sont flexibles" checkbox
```

**Step 4 — Budget**
```
Heading: "Quel est votre budget ?"
Visual: 4 large cards with price ranges
  < 1 000 € / pers
  1 000 — 2 500 € / pers  
  2 500 — 5 000 € / pers
  > 5 000 € / pers (Prestige — show gold border variant)
  Budget illimité / Sur-devis (glass + sparkle icon)
```

**Step 5 — Contact & Submit**
```
Heading: "Parlez-nous de votre rêve"
Fields:
  - Prénom & Nom (flex row)
  - Email (full width)
  - WhatsApp / Téléphone (with country selector flag dropdown)
  - Message libre: "Décrivez votre voyage idéal..." (textarea, 6 rows)
  - Preferred contact: WhatsApp | Email | Phone

SUBMIT LOGIC (dual action):
  Action 1 — Save to Payload:
    POST /api/inquiries with all form data
    Show loading state on button
    
  Action 2 — WhatsApp Deep Link:
    const msg = `Bonjour! Je souhaite créer un voyage sur-mesure 🌍
    
    *Destinations:* ${selectedDestinations.join(', ')}
    *Type:* ${travelType}
    *Voyageurs:* ${travelers} personnes
    *Dates:* ${dates}
    *Budget:* ${budget}/pers
    *Message:* ${message}
    
    Prénom: ${name} | Email: ${email}`
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`)
    
AFTER SUBMIT:
  Beautiful success screen with:
  - Animated checkmark (brand-blue, framer-motion draw animation)
  - "Votre voyage de rêve est en cours de création"
  - "Notre équipe vous contactera dans les 24h"
  - Two CTAs: "Voir nos Circuits" | "Retour à l'accueil"
```

---

### 2C. /tours/[slug] — Tour Detail Page (Major Enhancement)

**Hero Section:**
```
Full viewport height, video/image background (from thumbnail or first storyDay media)
Overlay: gradient to dark at bottom
Content (bottom-left, pb-16):
  - Scope badge (National/International) — rounded pill, glass bg
  - Tour title: Cormorant Garamond 64px, white
  - Meta badges row: Duration | Group size | Difficulty | Departure
  - Price: "À partir de X€/pers" — brand-gold, 24px
  - Two CTAs: "Réserver" (brand-blue filled) | "Demander un Devis" (glass border)
```

**Tour Content (below hero, dark bg):**
```
Left column (8/12): 
  1. StoryTimeline component (existing — keep, enhance)
  2. "Ce qui est inclus / exclu" (two-column list with ✓ and ✗)
  3. Departure dates & availability table
  4. Booking/inquiry form (compact, links to /sur-mesure pre-filled)

Right column (4/12) — sticky on scroll:
  Booking sidebar card (glass, rounded-3xl, p-6, sticky top-24):
  - Price display
  - Availability status badge
  - Group size selector (+ / -)
  - Date selector dropdown
  - "Réserver Ma Place" button (brand-blue, full width, large)
  - "Ou contacter via WhatsApp" (green WhatsApp button below)
  - Trust signals: lock icon "Paiement sécurisé" | calendar icon "Annulation flexible"
```

**Below Content:**
```
- Related Tours section (same destination or theme): 3-card horizontal scroll
- Testimonials specific to this tour (filter by tour relationship)
```

---

### 2D. /about — Brand Story Page

```
Section 1 — Hero:
  Split layout (50/50)
  Left: full-height atmospheric portrait photo of founder (glass frame effect)
  Right: 
    Eyebrow: "Notre Histoire"
    H1: "L'Art du Voyage Créé" (Cormorant Garamond 64px)
    Body: Founder story paragraph
    Signature image (stylized text or actual SVG signature)

Section 2 — Philosophy (3 pillars):
  3 tall glass cards, each with:
  - Large thin SVG icon (compass, star, heart)  
  - Title (Cormorant Garamond 28px)
  - 3-line description (Inter, brand-silver)
  Titles: "L'Excellence" | "L'Authenticité" | "Le Sur-Mesure"

Section 3 — Numbers (animated counters, same as homepage)

Section 4 — Team Grid:
  Team member cards (glass, rounded-2xl):
  - Portrait photo (rounded-2xl, object-top)
  - Name: Inter 16px bold
  - Role: Inter 13px brand-blue
  - Short bio: Inter 14px brand-silver
  
Section 5 — Partners & Certifications:
  Logo strip: IATA, ONMT, local tour operator certifications
  Grayscale logos, hover: full color

Section 6 — CTA:
  Dark section, centered
  "Prêt à créer votre voyage ?" — H2
  CTA: "Commencer maintenant"
```

---

### 2E. /destinations/[slug] — Destination Page (Major Enhancement)

```
Hero: full-screen cinematic (existing — keep)
Add after hero:

Section 2 — Destination Overview (2-col):
  Left: key stats (Best time, Temperature, Language, Currency, Timezone)
  Right: rich text description from Payload

Section 3 — Highlights:
  Horizontal scroll of "highlight pills" from Destination.highlights
  Each pill: glass bg, brand-blue border, icon + text

Section 4 — Available Tours:
  HEADING: "Nos Circuits à [Destination Name]"
  Tour cards grid (same as homepage featured tours)
  Filter by: price, duration, difficulty

Section 5 — Gallery:
  Masonry grid of destination.gallery images
  Lightbox on click (use yet-another-react-lightbox or fslightbox)
  Full-screen dark luxury lightbox style

Section 6 — Practical Info accordion:
  Getting there | Visa requirements | Best season | Currency tips | Safety
```

---

### 2F. /blog (New — SEO Content Engine)

**New Payload Collection: Articles**
```ts
{
  slug: 'articles',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'category', type: 'select', options: ['Guide de Destination', 'Conseils Voyage', 'Récits', 'Actualités'] },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' }, // Lexical editor
    { name: 'relatedDestinations', type: 'relationship', relationTo: 'destinations', hasMany: true },
    { name: 'relatedTours', type: 'relationship', relationTo: 'tours', hasMany: true },
    { name: 'readTimeMinutes', type: 'number' },
    { name: 'publishedAt', type: 'date' },
    { name: 'seo', type: 'group', fields: [...seoFields] },
  ],
}
```
**Frontend /blog layout:**
```
Hero: magazine-style large feature article (full-width, tall card)
Grid: masonry or 3-column with varying card heights
Article card: cover image (3:2 ratio), category badge, title (Cormorant Garamond), excerpt, read time, date
```

---

### 2G. /contact — Simple Lead Page

```
Two-column (60/40):
Left:
  - H1: "Parlons de Votre Voyage"
  - Contact form: Name, Email, Phone, Message, Subject dropdown
  - Submit → saves to Inquiries + sends email notification
  
Right (glass card):
  - WhatsApp: big green button with number
  - Email address
  - Office address
  - Opening hours
  - Social media links (Instagram, Facebook, TikTok)
  - Small embedded map (leaflet.js, dark tiles — Mapbox dark style)
```

---

### 2H. Legal Pages

Create these pages with minimal content but proper structure:
- `/mentions-legales` — Legal notices (required by French/Moroccan law)
- `/confidentialite` — Privacy policy (GDPR compliant)
- `/cgv` — General terms & conditions

All use same layout: white prose on dark bg, Cormorant heading, Inter body.

---

## 🟢 PHASE 3 — GLOBAL COMPONENTS

### 3A. Navigation (Global — Rebuild)
```
Component: src/components/Navigation.tsx
Behavior: 
  - On mount: transparent bg, white text
  - On scroll > 80px: glass bg (rgba(11,19,43,0.9) + blur(20px)), add border-bottom white/5
  - Mobile: hamburger → full-screen overlay menu (dark luxury, large Cormorant Garamond links)
  
Desktop layout (max-w-7xl, px-6, h-20, flex justify-between items-center):
  Left: Logo (SVG or next/image, h-8)
  Center: Nav links
    → Destinations (mega-menu dropdown on hover)
    → Nos Circuits
    → Sur-Mesure (highlight in brand-blue)
    → Blog
    → À Propos
  Right:
    → Language toggle (FR | EN) — simple text toggle
    → WhatsApp button (small, green icon + phone number, glass)

Mega-menu for Destinations (absolute dropdown, full-width, glass, grid-cols-4):
  → National destinations (left 3 cols with images)
  → International destinations (right 1 col, list style)
  → CTA at bottom: "Voir toutes nos destinations →"
```

### 3B. Floating WhatsApp Button (GLOBAL — CRITICAL)
```
Component: src/components/FloatingWhatsApp.tsx
Position: fixed, bottom-6, right-6, z-50
Behavior:
  - Default: circular button, 56x56, green (#25D366), WhatsApp SVG icon
  - On hover: expand to show "Discutons de votre voyage" text + phone number
  - Pulse animation: subtle scale 1→1.1→1 every 3s to draw attention
  - Click: wa.me/{whatsappNumber}?text=Bonjour, je souhaite en savoir plus sur vos voyages

Style:
  background: #25D366;
  border-radius: 50% (collapsed) → border-radius: 9999px (expanded);
  box-shadow: 0 4px 24px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
```

### 3C. Footer (Existing — Enhance)
```
Add missing elements to current 4-column footer:
Column 1 — Brand:
  - Logo
  - Tagline (Cormorant Garamond italic)
  - Short bio
  - Social icons (Instagram, Facebook, TikTok, YouTube)

Column 2 — Destinations (pull from CMS, split National/International)

Column 3 — Navigation:
  Nos Circuits | Sur-Mesure | Blog | À Propos | Contact | FAQ

Column 4 — Contact:
  - WhatsApp: clickable wa.me link
  - Email: clickable mailto
  - Address
  - Opening hours

Bottom bar:
  - © 2025 Ça Crée Voyage. Tous droits réservés.
  - Links: Mentions Légales | Confidentialité | CGV
  - IATA / certification logos (small, grayscale)
```

### 3D. CookieBanner Component
```
Component: src/components/CookieBanner.tsx
Position: fixed bottom, full width, z-50
Appears: on first visit (localStorage check)
Style: glass bg, blur, border-top white/5
Content: brief explanation + two buttons (Accepter | Paramétrer)
Functionality: sets cookie_consent localStorage key, integrates with GA conditionally
```

---

## 🟣 PHASE 4 — BACKEND & INTEGRATIONS

### 4A. Email Notifications via Resend
```ts
// src/hooks/sendInquiryNotification.ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInquiryEmailNotification = async ({ doc, operation }) => {
  if (operation !== 'create') return;
  
  // Email to agency
  await resend.emails.send({
    from: 'noreply@cacreevoyage.com',
    to: 'contact@cacreevoyage.com',
    subject: `🌍 Nouvelle Demande de Voyage — ${doc.fullName}`,
    html: `
      <h2>Nouvelle Demande</h2>
      <p><strong>Nom:</strong> ${doc.fullName}</p>
      <p><strong>Email:</strong> ${doc.email}</p>
      <p><strong>WhatsApp:</strong> ${doc.whatsapp}</p>
      <p><strong>Budget:</strong> ${doc.budget}</p>
      <p><strong>Message:</strong> ${doc.message}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/collections/inquiries/${doc.id}">
        Voir dans le CMS
      </a>
    `,
  });
  
  // Confirmation email to client
  await resend.emails.send({
    from: 'Ça Crée Voyage <bonjour@cacreevoyage.com>',
    to: doc.email,
    subject: `✈️ Votre demande a bien été reçue`,
    html: `[luxury-branded HTML template]`,
  });
};
```

### 4B. Dynamic SEO Metadata (Every Page)
```ts
// Pattern for every page.tsx:
export async function generateMetadata({ params }): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug);
  return {
    title: tour.seo?.metaTitle || `${tour.title} — Ça Crée Voyage`,
    description: tour.seo?.metaDescription || tour.shortDescription,
    openGraph: {
      title: tour.title,
      description: tour.shortDescription,
      images: [{ url: tour.seo?.ogImage?.url || tour.thumbnail?.url }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

### 4C. Dynamic OG Images via next/og
```ts
// src/app/tours/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';
export default async function OGImage({ params }) {
  const tour = await getTourBySlug(params.slug);
  return new ImageResponse(
    <div style={{ 
      background: '#0B132B', 
      display: 'flex', 
      width: '100%', 
      height: '100%',
      padding: '80px',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      <div style={{ fontSize: 16, color: '#38A3A5', marginBottom: 16 }}>Ça Crée Voyage</div>
      <div style={{ fontSize: 64, color: 'white', fontWeight: 700 }}>{tour.title}</div>
      <div style={{ fontSize: 24, color: '#A0ABC0', marginTop: 16 }}>{tour.shortDescription}</div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### 4D. Performance — Video Loading
```ts
// All video backgrounds MUST use this pattern:
<video
  ref={videoRef}
  autoPlay
  muted
  loop
  playsInline
  poster={posterImageUrl} // REQUIRED: prevents layout shift
  preload="metadata"      // Don't preload full video
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src={videoUrl} type="video/mp4" />
</video>

// Use IntersectionObserver to pause videos not in viewport:
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    entry.isIntersecting ? videoRef.current?.play() : videoRef.current?.pause();
  }, { threshold: 0.25 });
  if (videoRef.current) observer.observe(videoRef.current);
  return () => observer.disconnect();
}, []);
```

### 4E. i18n Setup (French + English)
```
1. Install: npm install next-intl
2. Create: messages/fr.json + messages/en.json
3. Wrap app in NextIntlClientProvider
4. URL strategy: /fr/* and /en/* (default: /fr)
5. In Payload: enable localization on all text fields with locales: ['fr', 'en']
6. Language switcher in Navigation: reads useLocale(), calls router with new locale
7. Key namespaces: common, navigation, homepage, tour, destination, surMesure
```

---

## ⚡ PHASE 5 — PRODUCTION DEPLOYMENT

### 5A. Vercel Deployment Checklist
```
1. Connect GitHub repo to Vercel
2. Set build command: next build
3. Set output directory: .next
4. Environment variables: copy all from .env.production.template
5. Enable Vercel Analytics (free tier)
6. Set up custom domain: cacreevoyage.com
7. Enable SSL (automatic with Vercel)
8. Set CORS origins in Payload config to include production domain
9. Test: /api/health endpoint should return 200
10. Test: /api/force-seed should NOT run in production (add NODE_ENV check)
```

### 5B. Neon Production Setup
```
1. Create production branch in Neon (separate from dev)
2. Run payload migrate:create and payload migrate in production
3. Enable connection pooling in Neon for serverless (PgBouncer mode)
4. Set max connections appropriately for Vercel serverless
5. Enable automated backups (daily)
```

### 5C. Performance Targets (Core Web Vitals)
```
Target scores (Google PageSpeed):
  LCP (Largest Contentful Paint): < 2.5s
  INP (Interaction to Next Paint): < 200ms
  CLS (Cumulative Layout Shift): < 0.1

Techniques:
  → All fonts: font-display: swap, preload link tags in <head>
  → Images: next/image with priority on above-fold, lazy below
  → Videos: poster images always, preload="none" for off-screen videos
  → Third-party scripts (GA, Meta Pixel): load with next/script strategy="lazyOnload"
  → Enable ISR (Incremental Static Regeneration) on tour and destination pages:
    export const revalidate = 3600; // revalidate every hour
```

### 5D. Monitoring & Error Tracking
```
1. Sentry: npm install @sentry/nextjs
   → Instrument.ts in project root
   → Track: API errors, build errors, runtime exceptions
   → Set up Slack alerts for new issues

2. Google Analytics 4:
   → Install via next/script strategy="lazyOnload"
   → Track: pageviews, form starts/completions, WhatsApp clicks, tour views
   → Set up conversion goals in GA4

3. Vercel Analytics: enable in dashboard (free)
4. Uptime monitoring: UptimeRobot (free) — monitor / and /api/health every 5 min
```

---

## 🎯 PHASE 6 — FUTURE GROWTH (Post-Launch)

### 6A. Stripe Deposit Integration
```
Flow:
1. User selects tour + date → clicks "Réserver Ma Place"
2. Choose amount: Full amount | 30% deposit
3. Stripe Checkout session created via /api/checkout
4. After successful payment:
   → Create Inquiry with status: 'deposit-paid'
   → Send confirmation email with booking reference
   → WhatsApp notification to agency
5. Stripe webhook: /api/webhooks/stripe handles fulfillment
```

### 6B. Advanced Admin Features
```
- Admin dashboard with custom views: inquiries by status (Kanban-style)
- Bulk actions: export leads to CSV
- Custom dashboard widget: "Inquiries this week" + "Revenue pipeline"
- Media optimizer: auto-compress uploads, generate WebP variants
```

### 6C. Mobile App (Phase 3 Vision)
```
React Native Expo app:
  - Browse destinations & tours
  - Check booking status
  - Receive push notifications
  - WhatsApp-integrated chat support
  - Offline-capable trip itinerary view
```

---

## 📐 COMPONENT CHECKLIST (Complete File List)

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── page.tsx                    ← REBUILD (full homepage)
│   │   ├── layout.tsx                  ← ADD: SEO defaults, cookie banner
│   │   ├── about/page.tsx              ← CREATE NEW
│   │   ├── blog/
│   │   │   ├── page.tsx                ← CREATE NEW
│   │   │   └── [slug]/page.tsx         ← CREATE NEW
│   │   ├── contact/page.tsx            ← CREATE NEW
│   │   ├── sur-mesure/page.tsx         ← CREATE NEW (multi-step form)
│   │   ├── destinations/
│   │   │   ├── page.tsx                ← ENHANCE (filter + grid)
│   │   │   └── [slug]/page.tsx         ← MAJOR ENHANCEMENT
│   │   ├── tours/
│   │   │   └── [slug]/page.tsx         ← MAJOR ENHANCEMENT
│   │   ├── mentions-legales/page.tsx   ← CREATE NEW
│   │   ├── confidentialite/page.tsx    ← CREATE NEW
│   │   └── cgv/page.tsx               ← CREATE NEW
│   ├── api/
│   │   ├── force-seed/route.ts         ← ADD: NODE_ENV guard
│   │   ├── checkout/route.ts           ← CREATE (Stripe)
│   │   └── webhooks/stripe/route.ts   ← CREATE (Stripe)
│   ├── robots.ts                       ← CREATE
│   └── sitemap.ts                      ← CREATE
├── collections/
│   ├── Tours.ts                        ← MAJOR FIELD ADDITIONS
│   ├── Destinations.ts                 ← FIELD ADDITIONS
│   ├── Testimonials.ts                 ← ENHANCE + WIRE FRONTEND
│   ├── Inquiries.ts                    ← ENHANCE (full spec above)
│   ├── Articles.ts                     ← CREATE NEW (blog)
│   ├── Media.ts                        ← NO CHANGE
│   └── Users.ts                        ← NO CHANGE
├── globals/
│   └── SiteSettings.ts                ← CREATE NEW
├── components/
│   ├── Navigation.tsx                  ← REBUILD (mega-menu + scroll behavior)
│   ├── Footer.tsx                      ← ENHANCE (full spec above)
│   ├── FloatingWhatsApp.tsx            ← CREATE NEW (critical)
│   ├── CookieBanner.tsx               ← CREATE NEW
│   ├── HeroGallery.tsx                 ← ENHANCE (badges, taglines)
│   ├── ReelsShowcase.tsx               ← MINOR ENHANCEMENTS
│   ├── DestinationSwiper.tsx           ← ENHANCE (add taglines)
│   ├── TourCard.tsx                    ← CREATE (reusable card)
│   ├── TestimonialsCarousel.tsx        ← CREATE NEW
│   ├── TrustStats.tsx                  ← CREATE NEW (animated counters)
│   ├── SurMesureForm.tsx               ← CREATE NEW (multi-step)
│   └── ui/
│       ├── StoryTimeline.tsx           ← NO CHANGE
│       ├── BookingSidebar.tsx          ← CREATE NEW
│       ├── DateRangePicker.tsx         ← CREATE NEW (dark styled)
│       └── LightboxGallery.tsx         ← CREATE NEW
├── hooks/
│   ├── sendInquiryNotification.ts     ← CREATE NEW
│   └── useWhatsApp.ts                 ← CREATE NEW (WhatsApp URL builder)
├── lib/
│   ├── payload.ts                      ← ADD: helper functions
│   └── seo.ts                          ← CREATE NEW (metadata helpers)
└── globals.css                         ← ADD: Cormorant font variable, animation keyframes
```

---

## 🔑 GOLDEN RULES FOR EVERY AI AGENT

1. **Never use white backgrounds.** Every page must use `#0B132B`. When in doubt, add it.
2. **WhatsApp is the primary CTA everywhere.** Every page needs a clear path to WhatsApp.
3. **Brand colors via Tailwind classes only.** Never ad-hoc hex codes in JSX. Use `bg-brand-dark`, `text-brand-blue`, etc.
4. **Glassmorphism is the card standard.** No solid opaque non-dark cards.
5. **Cormorant Garamond for all headings.** Inter for all UI text. Never mix.
6. **All dynamic routes: always `slug.toLowerCase()` in queries.** Non-negotiable.
7. **StoryTimeline `whileInView` must NOT have `once: true`.** Cards re-enter viewport on horizontal scroll.
8. **Seed guard:** `force-seed` route must check `NODE_ENV !== 'production'` before running.
9. **Images are broken until R2 is public.** Fix this before demoing anything.
10. **Mobile first.** Every layout must be tested at 375px before 1280px.

---

*Document version: 2.0 — Compiled from full codebase audit*
*Tech stack: Next.js 15 · Payload CMS 3 · Neon PostgreSQL · Cloudflare R2 · Tailwind CSS · Framer Motion · Resend · Stripe*

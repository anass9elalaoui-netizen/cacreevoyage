# 🌌 Ça Crée Voyage — Platform Handover & AI Guide

This document serves as the definitive guide for the **Ça Crée Voyage** platform. It contains technical specifications for future AI agents and high-level summaries for the client.

---

## 🎨 1. Design System: "Dark Luxury" (Ocean Navy)

The platform has been migrated from a generic white UI to a premium, cinematic "Dark Luxury" aesthetic.

### Core Tokens
| Token | Value | Usage |
|---|---|---|
| **Background** | `#0B132B` | Global background (Ocean Navy) |
| **Accent** | `#38A3A5` | Interactive elements, borders, active states |
| **Glassmorphism** | `rgba(255, 255, 255, 0.05)` | Card backgrounds with 12px+ blur |
| **Typography (Serif)** | `Cormorant Garamond` | Luxury headings and titles |
| **Typography (Sans)** | `Inter` | Body text and UI elements |

### Visual Rules
- **No White Pages:** Every page must have `#0B132B` as the base background.
- **Ambient Glows:** Use absolute-positioned divs with `bg-brand-blue/5` and `blur-[120px]` to create depth behind content.
- **Cinematic Fallbacks:** If a destination or tour has no video/image, use the `bg-gradient-to-br from-[#0B132B] via-[#1a2744] to-[#0B132B]` fallback.

---

## 🛠️ 2. Technical Architecture (AI Guide)

### Routing & Slugs
The platform uses **URL-friendly slugs** for all dynamic routes. 
- **Destinations:** `/destinations/[slug]`
- **Tours:** `/tours/[slug]`

**Crucial Logic:**
- **Hooks:** Both `Destinations` and `Tours` collections have `beforeValidate` hooks that force slugs to lowercase and remove special characters.
- **Fetching:** When fetching by slug in `page.tsx`, always use `slug.toLowerCase()` in the query to ensure case-insensitive matching.

### Database Seeding
The database is pre-populated with **13 destinations** and **3 tours** (with full itinerary data).
- **API Trigger:** `http://localhost:3000/api/force-seed` (Browser-friendly — seeds both destinations & tours)
- **CLI Trigger:** `npm run seed` (Executes `src/seed.ts` — destinations only)
- **Seeded Tours:**
  - `zanzibar-reve-tropical` — 13 story days (International)
  - `merzouga-immersion-saharienne` — 4 story days (National)
  - `fahs-el-mahr-monte-blanco` — 3 story days (National)

---

## 📂 3. Directory & File Deep Dive

### `src/app/(frontend)` — The Website Front-end
This is the core of the Next.js App Router.
- **`layout.tsx`**: Updated to force the `#0B132B` background globally. Wrapped the app in the cinematic theme.
- **`page.tsx` (Homepage)**: Integrated the `DestinationSwiper` and the new professional `Footer`.
- **`destinations/`**:
  - **`[slug]/page.tsx`**: Completely refactored. Added cinematic fallbacks, ambient glow effects, and case-insensitive slug fetching.
  - **`national/` & `international/`**: Migrated to "Dark Luxury" grid layouts with glassmorphism cards.
- **`tours/[slug]/page.tsx`**: Integrated the new `StoryTimeline` component (horizontal 9:16 cards). Falls back to legacy `ItineraryTimeline` if no `storyDays` data exists.

### `src/collections` — The Database (Payload CMS)
- **`Destinations.ts`**: 
  - **Change:** Made `headerMedia` optional to allow content flexibility.
  - **Change:** Added a powerful `beforeValidate` hook to sanitize slugs automatically.
- **`Tours.ts`**: 
  - **Change:** Added slug sanitization hook.
  - **Change:** Added the `storyDays` array field for the Travel Story Timeline (each day has `dayNumber`, `title`, `location`, `activities[]`, and optional `media`).
  - **Change:** Legacy `itineraryBlocks` kept for backward compatibility.
  - **Change:** Made `thumbnail` optional for easier seeding.
- **`Media.ts`**: Configured to handle cinematic video and high-res images.

### `src/components` — Reusable Luxury Components
- **`Footer.tsx`**: **[REWRITTEN]** Professional 4-column layout with brand bio, destination categories, legal links, and payment icons.
- **`DestinationSwiper.tsx`**: Horizontal scrolling destination cards. Uses `slug` for navigation.
- **`HeroGallery.tsx`**: The cinematic entry point. Supports full-screen luxury media.
- **`ItineraryTimeline.tsx`**: (Legacy) Vertical timeline for tour day-by-day views.
- **`ui/StoryTimeline.tsx`**: **[NEW]** Horizontal-scrolling Travel Story Timeline. Vertical 9:16 cards with framer-motion cinematic animations. Supports video and image backgrounds.

### `src/app/api` — Custom Logic
- **`force-seed/route.ts`**: **[UPDATED]** Seeds both destinations (13) and tours (3 with full itinerary data) in one click.

### `src/` (Root) — Configuration & Data
- **`globals.css`**: Updated core CSS variables. Set body background to Ocean Navy and text to white.
- **`seed.ts`**: Master seed script for destinations (CLI only).
- **`payload.config.ts`**: The brain of the CMS. Connects the database, collections, and S3-compatible storage.

### `.windsurf/skills` — Intelligence & UI/UX Data
- Contains the "UI-UX-PRO-MAX" skill definitions and data (colors, icons, typography) used to guide the aesthetic transition.

---

## 🎬 4. Travel Story Timeline — Technical Spec

This is the signature interactive feature of the platform.

### Schema (`storyDays` in Tours collection)
```
storyDays: Array
  ├── dayNumber: Number (required) — e.g., 1, 2, 3
  ├── title: Text (required) — e.g., "Arrivée aux Dunes"
  ├── location: Text (required) — e.g., "Errachidia → Merzouga"
  ├── activities: Array (required)
  │   └── activity: Text (required) — e.g., "Safari en 4x4"
  └── media: Upload (optional) — Vertical 9:16 image or video
```

### Component Architecture
- **File:** `src/components/ui/StoryTimeline.tsx` (Client Component)
- **Interaction:** Horizontal swipe track (`flex overflow-x-auto snap-x snap-mandatory`)
- **Card Format:** `min-w-[85vw] md:min-w-[350px] aspect-[9/16] rounded-3xl`
- **Animations (framer-motion):**
  - Day badge drops from top (`initial={{ y: -20, opacity: 0 }}`)
  - Title/Location slide from left (`initial={{ x: -30, opacity: 0 }}`)
  - Activities stagger from bottom (`initial={{ y: 20, opacity: 0 }}` with `delay: 0.35 + index * 0.08`)
  - All animate `whileInView` with `viewport={{ amount: 0.5 }}` — triggered when card is centered

### Integration (Server → Client Data Flow)
```
tours/[slug]/page.tsx (Server Component)
  → fetches tour with depth: 2 (resolves media)
  → checks for storyDays (new) vs itineraryBlocks (legacy)
  → passes data to <StoryTimeline itinerary={tour.storyDays} /> (Client Component)
```

### Adding New Tours via Admin Panel
1. Go to `/admin` → Tours → Create New
2. Fill in basic info (Title, Duration, Scope, Destination)
3. Scroll to **"Story Days"** section
4. Click **"Add Story Day"** for each day of the trip
5. Fill in dayNumber, title, location, and add activities
6. (Optional) Upload a vertical 9:16 media for the background
7. Save — the tour page at `/tours/[slug]` will render the horizontal timeline automatically

---

## 🚀 5. How to Update Content

1. **Adding a Destination:** 
   - Go to Payload Admin (`/admin`).
   - Fill in Title, Scope (National/International), and Theme.
   - The **Slug** will auto-generate but can be overridden.
   - **Header Media** is optional; a beautiful dark gradient will show if empty.

2. **Adding a Tour:**
   - Link it to a Destination.
   - Ensure the **Slug** is clean.
   - Use the **Story Days** array for the new horizontal timeline.
   - Legacy **Itinerary Blocks** still work as a fallback.

3. **Re-seeding the Database:**
   - Visit `http://localhost:3000/api/force-seed` in your browser.
   - This will upsert all 13 destinations + 3 tours (Zanzibar, Merzouga, Fahs El Mahr).

---

## 📝 6. Change Log
| Date | Change | Impact |
|---|---|---|
| 2026-04-27 | **Travel Story Timeline** — New `storyDays` schema + `StoryTimeline.tsx` component | Tours now have horizontal 9:16 story cards |
| 2026-04-27 | **Tour Seeding** — 3 tours with full itinerary data added to force-seed | Database populated with real tour data |
| 2026-04-27 | **404 Error Fix** — Standardized slugs across all hooks and queries | No more broken destination/tour links |
| 2026-04-27 | **Dark Luxury Migration** — All pages moved to Ocean Navy (#0B132B) | No more white pages |
| 2026-04-27 | **Footer Refactor** — Professional 4-column layout | Brand, Destinations, Support, Payments |
| 2026-04-27 | **Media Flexibility** — `headerMedia` and `thumbnail` made optional | Content creation without upload blockers |

---

> **Note for Future AI Agents:** When modifying styles, always refer to `tailwind.config.ts` for brand colors. Avoid adding ad-hoc hex codes; use `bg-brand-dark` or `text-brand-blue`. The `StoryTimeline` component uses `whileInView` animations — do NOT add `once: true` as cards should re-animate on re-entry during horizontal scrolling.

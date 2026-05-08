# Ça Crée Voyage — Platform AI Context Skill

## Objective
This skill provides complete architectural, styling, and data schema context for the Ça Crée Voyage platform. Any AI working on this project MUST adhere to these technical and aesthetic standards.

## 1. Stack & Architecture
- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS (3.x, integrated directly into the Next.js app)
- **Styling:** Tailwind CSS, Framer Motion for animations
- **Database:** MongoDB (or compatible, currently handled via Payload local DB / Mongoose)
- **Storage:** S3-Compatible (Cloudflare R2 configured for media uploads)

## 2. Design System: "Dark Luxury"
- **Base Background:** Ocean Navy (`#0B132B`). No white backgrounds on pages.
- **Accent Color:** Teal/Cyan (`#38A3A5`) for interactive elements.
- **Typography:** `Cormorant Garamond` (Headings) and `Inter` (Body).
- **Components:**
  - `HeroGallery`: Cinematic full-screen video/image intros.
  - `StoryTimeline`: Horizontal scroll snapping, vertical 9:16 cards with `framer-motion` reveal effects.
  - `DestinationSwiper`: Horizontal slider for top-level categories.
  - Use glassmorphism (`bg-white/5 backdrop-blur-md`) for overlays.

## 3. Database Schema & Routing
- **Destinations:** 
  - Fields: `title`, `slug`, `theme`, `scope` (National/International), `headerMedia`.
  - Route: `/destinations/[slug]`
- **Tours:** 
  - Fields: `title`, `slug`, `destination` (relation), `storyDays` (array of day-by-day itineraries).
  - Route: `/tours/[slug]`
- **Validation Hooks:** All slugs are automatically forced to lowercase and sanitized. Always fetch with case-insensitive `slug.toLowerCase()` logic.

## 4. Seeding & Development
- **Force Seed:** Navigate to `http://localhost:3000/api/force-seed` to instantly inject base destinations and demo tours (Zanzibar, Merzouga, Fahs El Mahr).
- **Media Fallbacks:** Always provide a dark cinematic gradient fallback if an image/video is not present on a model.

## 5. Coding Rules
- Do NOT alter Payload's `src/payload.config.ts` without explicitly verifying S3 and collection configurations.
- Do NOT use generic white UI components.
- Always use `React.FC` or standard functional component patterns for Next.js App Router (Server Components by default, add `"use client"` for interactive UI like `StoryTimeline`).

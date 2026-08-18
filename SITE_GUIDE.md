# Ça Crée Voyage - Complete Website Guide & Architecture

This document serves as the master reference for the website's structure, visual identity, and user journeys. It is designed to be shared with clients, designers, developers, and AI agents to provide a holistic understanding of the project.

---

## 1. Project Overview & Target Audience
**Ça Crée Voyage** is a premium, tailor-made luxury travel agency based in Morocco. The website is built to act as an immersive, high-end digital concierge that converts visitors into highly qualified leads for custom trip planning.
- **Target Audience:** High-net-worth individuals, honeymooners, families, and luxury travelers looking for unique, frictionless, and highly personalized travel experiences (both in Morocco and Internationally).

---

## 2. Visual Identity & UI/UX Design System
*Note for AI Agents & Designers: The website relies heavily on specific aesthetics to convey "Luxury" and "Exclusivity". Any new additions must adhere to these rules.*

- **Theme Modes:** Fully supports Light and Dark Mode. Dark Mode is particularly emphasized, featuring deep oceanic blues and slate tones (`#0B132B`, `brand-dark`) to make media pop.
- **Color Palette:** 
  - **Primary:** Brand Blue (`#38A3A5` or similar tailored blue).
  - **Accents:** Brand Gold (used for luxury accents, badges, and highlights).
  - **Backgrounds:** `slate-50` for light mode; deep dark (`#0B132B`) with blur/glow effects for dark mode.
- **Typography:** Modern, sophisticated fonts. Sans-serif body text (`font-body`) and elegant, tracking-wide headings (`font-heading`).
- **UI Elements & Effects:**
  - **Glassmorphism:** Heavy use of `backdrop-blur`, semi-transparent overlays (`bg-white/5`), and subtle borders (`border-white/10`) for cards and navigation.
  - **Cinematic Media:** Full-screen auto-playing videos, edge-to-edge swipers, and high-resolution image galleries.
  - **Micro-interactions:** Magnetic buttons that follow the mouse, custom cursor image trails (`CursorTrail`), scroll-triggered text reveals, and smooth hover scaling (`hover:scale-105`).
  - **Ambient Glows:** Background radial gradients (blue/gold blurs) to add depth to sections.

---

## 3. Site Map & Detailed Page Content

### 3.1 Homepage (`/`)
*Goal: Immersion, Trust-building, and Routing.*
- **Hero Gallery:** Cinematic, scroll-driven visual intro.
- **Destination Swipers:** Two distinct carousels for "Évasions Internationales" and "Trésors du Maroc" utilizing the custom cursor trail effect.
- **Featured Tours Grid:** Top-tier ready-to-book circuits.
- **Immersive Break:** Full-width `HeroVideoSwitcher` for visual storytelling.
- **Sur-Mesure Philosophy:** Text block explaining the tailor-made approach, featuring Trustpilot/Google review badges for trust.
- **Social Proof:** Video testimonials, text review grid, and Partner/Press logos carousel.
- **Live Instagram Feed:** Auto-updating `@cacreevoyage` embed.
- **Global CTA:** Large section pushing users to WhatsApp or the Sur-Mesure form.

### 3.2 About Us (`/about`)
*Goal: Brand storytelling and establishing authority.*
- **Notre Histoire (Story):** The origin of the agency and its core mission.
- **Philosophy Pillars:** 3 core values (Excellence, Authenticity, Tailor-Made) presented in floating glassmorphism cards with distinct icons.

### 3.3 Destinations (`/destinations`)
*Goal: Categorized exploration of travel spots.*
- **Filters:** Toggle pills to switch between 'International' and 'Maroc' scopes.
- **Grid:** High-visual cards with theme badges (Ocean, Desert, Culture) and dynamic video/image hover states.

### 3.4 Tailor-Made Form (`/sur-mesure`)
*Goal: Lead generation (Primary Conversion Point).*
- **Multi-Step Form:** An interactive, progressive form collecting user preferences (budget, style, dates, passenger count, exact needs) to craft their perfect trip without overwhelming them.

### 3.5 Tours/Circuits (`/tours`)
*Goal: Secondary Conversion Point for pre-packaged inspiration.*
- **Grid:** Displays curated tours with pricing, duration, short descriptions, and thumbnail images.

### 3.6 Blog (`/blog`)
*Goal: SEO and long-form inspiration.*
- **Articles Grid:** Travel guides, stories, and tips with read times, publication dates, and categories.

### 3.7 Contact (`/contact`)
*Goal: Direct and immediate communication.*
- **Forms & Info:** Traditional contact form alongside direct WhatsApp buttons, Email link, Office address, and Social Media links.

---

## 4. Detailed User Scenarios (User Journeys)

### Scenario A: The "Dreamer" (Top of Funnel)
1. **Entry:** Lands on the Homepage via an Instagram Reel or Organic Search.
2. **Behavior:** Mesmerized by the Hero Video. Scrolls down, dragging the mouse to see the interactive `CursorTrail` effect over the "International Destinations" slider.
3. **Action:** Clicks on a stunning image of a destination (e.g., Maldives or Japan) to read more.
4. **Outcome:** Enjoys the content, gets highly inspired, and clicks "Follow us on Instagram" in the footer to keep dreaming until they are financially ready to book.

### Scenario B: The "Determined Buyer" (High Intent)
1. **Entry:** Hears about the agency from a wealthy friend, types the URL directly into their browser.
2. **Behavior:** Knows exactly what they want (a custom luxury honeymoon in Morocco). Skips the general browsing and clicks the glowing **"Voyage Sur-Mesure"** button directly from the navigation bar.
3. **Action:** Effortlessly completes the multi-step form, detailing their exact dates, high budget tier, and preference for "Desert & Culture".
4. **Outcome:** Form submitted. The agency receives a highly qualified, data-rich lead directly in the Payload CMS dashboard, ready for a sales call.

### Scenario C: The "Skeptic / Researcher" (Middle of Funnel)
1. **Entry:** Finds a specific Tour via Google Search (e.g., "Luxury Desert Tour Morocco").
2. **Behavior:** Lands on the specific Tour page. Likes the itinerary and the pricing but wants to verify the agency's legitimacy before spending thousands of euros.
3. **Action:** Navigates to the **About (`/about`)** page to read the founder's story. Then goes to the **Homepage** to look for Social Proof. Sees the 5-star Google/Trustpilot badges and watches a video testimonial from a real past client.
4. **Outcome:** Convinced of the premium quality and safety, they click the floating **WhatsApp** button to ask a specific, final question to a human agent before proceeding with the booking.

---

## 5. Technical Context for AI Agents & Developers
- **Tech Stack:** Next.js (App Router), Payload CMS (Headless), Tailwind CSS.
- **Component Reusability:** When building new pages or features, AI agents must heavily utilize existing UI components located in `src/components/` (e.g., `MagneticButton`, `SubpageHero`, `ScrollTextReveal`, `DestinationSwiper`) to maintain strict visual consistency.
- **Data Fetching:** Content is dynamically pulled from Payload CMS collections (`destinations`, `tours`, `articles`) and globals (`site-settings`, `subpage-heroes`). Always handle potential `null` or missing data gracefully, as CMS data can be empty or missing localized fields.

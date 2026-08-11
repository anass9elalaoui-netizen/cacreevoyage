# 🗺️ Ça Crée Voyage — Website & Platform Documentation

This document provides a complete overview of the **Ça Crée Voyage** website, its design system, page structures, and the administration panel. It is designed to be shared with stakeholders and clients to understand how the platform works and looks.

---

## 🎨 1. Brand Philosophy & Design System

The platform dynamically supports both **Mode Jour (Light Mode)** and **Mode Nuit (Dark Mode)** to provide an optimal and immersive experience depending on the user's preference and environment.

### 🌓 Modes de Navigation (Light & Dark Mode)
- **☀️ Mode Jour (Light Mode):** Clean, bright, and airy. Uses a soft Slate background (`#F8FAFC`) with deep Slate-900 text for maximum readability. Glass elements use a semi-transparent frosted white (`bg-white/80`) with soft shadows.
- **🌙 Mode Nuit (Dark Mode / Dark Luxury):** Immersive and cinematic. Uses the signature **Dark Navy (`#0B132B`)** background with crisp white text. Glass elements use dark transparency (`bg-white/10`) with deep, atmospheric shadows.

### 🖌️ Color Palette
The brand colors are carefully structured to maintain a high-end feel across both modes:
- 🔵 **Ocean Blue** (`#1C8CC9`): Used for primary interactions, buttons, and accents.
- 💠 **Cyan** (`#49C0EA`): Secondary accent for subtle highlights and ambient glows.
- ⬛ **Dark Navy** (`#0B132B`): The core background color for Mode Nuit.
- 🌑 **Deeper / Midnight** (`#050814`): Used for deep contrasts and footers.
- 🥇 **Gold** (`#C9A84C`): Used for premium elements, stars, and luxury accents.
- 🔘 **Silver** (`#A0ABC0`): Secondary text, metadata, and inactive elements.
- ⚪ **White** (`#FFFFFF`): Primary typography in Mode Nuit and base for light mode.

### ✍️ Typography (Fonts)
The platform uses two carefully selected Google Fonts:
- **Cormorant Garamond (Serif):** Elegant and traditional. Used for all Main Headings (H1, H2, etc.), Hero Titles, and Destination names.
- **DM Sans (Sans-Serif):** Clean and highly legible. Used for all Body text, UI elements, buttons, and general content.

### 🖼️ Imagery & Media
- **Mood:** Dramatic lighting, golden hour, deep contrasts. 
- **Hero Sections:** Immersive 16:9 Landscape Video or high-res photography. Overlays automatically adjust based on Light/Dark mode to ensure text legibility.
- **Tour Story Cards:** 9:16 Vertical format (similar to Instagram/TikTok stories) for a modern, mobile-first feel.

---

## 🌍 2. Frontend: Page-by-Page Structure

### 🏠 Homepage (`/`)
- **Structure:** 
  1. Cinematic Hero Video/Image Intro
  2. Horizontal Destination Swiper
  3. Featured Tours & Highlights grid
  4. Customer Testimonials Carousel
  5. Trust Stats & Footer
- **Buttons / Actions:** Primary "Découvrir" (Discover) buttons leading to specific tours or destinations.

### 📍 Destinations (`/destinations` & `/destinations/[slug]`)
- **Structure:** 
  1. Subpage Hero header with destination media
  2. Thematic gradient blending into the page
  3. Grid of all specific tours available in this destination.
- **Buttons / Actions:** Tour cards clicking directly into the specific Tour page.

### ✈️ Tours & Experiences (`/tours` & `/tours/[slug]`)
- **Structure:** 
  1. Immersive Hero Gallery
  2. Tour Overview & Details
  3. **The "Story Timeline":** A highly interactive, horizontal scrolling timeline using 9:16 vertical cards for each travel day.
  4. Detailed Itinerary Timeline list.
  5. **Booking Sidebar:** A sticky sidebar that travels down the page with the user.
- **Buttons / Actions:** "Réserver" (Book) button in the sticky sidebar directing to the Checkout flow.

### ✨ Tailor-Made Trips (`/sur-mesure`)
- **Structure:** A dedicated, multi-step interactive form for users to request customized, tailor-made itineraries.

### 📖 About Us (`/about`)
- **Structure:** Brand philosophy, mission statement, and team presentation.

### 📞 Contact (`/contact`)
- **Structure:** Lead capture form, company contact information, and standard Subpage Hero.
- **Floating Action:** A floating **WhatsApp button** is available across the site for instant customer support.

### 💳 Checkout & Booking (`/checkout`)
- **Structure:** Secure booking and payment flow to finalize tour reservations.

### ⚖️ Legal Pages
- **`/cgv`** (Terms of Sale), **`/confidentialite`** (Privacy Policy), **`/mentions-legales`** (Legal Mentions). Simple, readable text layouts.

---

## 🧩 3. Global UI Components & Interactions

- **Glassmorphism Navigation:** The top menu (`GlassNavbar`) floats over the content with a semi-transparent frosted background and a background blur effect (`backdrop-filter: blur(12px)`). It adapts to Light/Dark mode dynamically.
- **Ambient Glows:** Subtle, blurred circles (like the `campfire-glow__radial` effect) placed behind important cards to lift them off the background.
- **Smooth Scrolling:** Integrated `Lenis` smooth scrolling for a premium, buttery browsing experience.
- **Animations:** Elements gently fade and slide in as the user scrolls down the page, creating a dynamic "journey" effect.

---

## 🔒 4. Admin Panel (Content Management)

The platform includes a powerful, custom-built Admin Panel (powered by Payload CMS) to manage the entire website without touching code.

**Access:** Located securely at `/admin`.

### Key Admin Features:
1. **Tours Management:** 
   - Create and edit tours.
   - Manage the interactive "Story Days" (add daily locations, activities, and vertical media).
   - Set pricing, thumbnail images, and link tours to specific destinations.
2. **Destinations Management:** 
   - Create regions/countries, set themes (e.g., Tropical, Desert), and upload header media.
3. **Inquiries & Orders:** 
   - View all customer bookings (from checkout) and form submissions (from the Contact and Sur-Mesure pages).
4. **Media Library:** 
   - Centralized media hub connected to cloud storage (AWS S3). Upload 4K videos and high-res images that automatically optimize for the web.
5. **Dynamic URLs:** 
   - The CMS automatically generates SEO-friendly URLs (slugs) for every tour and destination.

---
*Generated for Ça Crée Voyage - Client Documentation*

# 🗺️ Ça Crée Voyage — Platform Sitemap

This document outlines the structural hierarchy (Sitemap) of the **Ça Crée Voyage** platform. It covers both the public-facing Frontend (what your clients see) and the private Admin Panel (where you manage content).

---

## 🌍 1. Public Frontend (Client Facing)

The public website is built with Next.js 15 App Router, featuring dynamic, cinematic routing for all travel content.

### Main Navigation
- **`/` (Homepage)**
  - Hero Cinematic Intro
  - Destination Swiper (Horizontal Categories)
  - Latest Tours / Highlights
  - Global Footer

### Destinations
- **`/destinations/[slug]` (Dynamic Destination Page)**
  - *Example:* `/destinations/zanzibar-reve-tropical`
  - Features: Header media, dark luxury gradient, and a list of all tours associated with this destination.

### Tours & Experiences
- **`/tours/[slug]` (Dynamic Tour Page)**
  - *Example:* `/tours/merzouga-immersion-saharienne`
  - Features: Overview, Story Timeline (interactive 9:16 vertical travel days), legacy itinerary fallbacks.

### Upcoming / Planned Routes (Phase 2)
- **`/checkout`** or **`/book/[slug]`** (Reservation & Payment Flow)
- **`/about`** (Brand Philosophy & Team)
- **`/contact`** (Lead Capture Form)

---

## 🔒 2. Payload CMS Admin Panel (Management Facing)

The Admin panel is accessed via `/admin`. It is heavily customized for managing the platform's unique content structures.

### Dashboard
- **`/admin`**
  - Central hub providing an overview of recent changes across all collections.

### Content Collections
- **`/admin/collections/destinations`**
  - View all Destinations.
  - **Create / Edit Destination:**
    - `Title` (e.g., Zanzibar)
    - `Slug` (Auto-generated & sanitized)
    - `Theme` (e.g., Tropical, Desert)
    - `Scope` (National or International)
    - `Header Media` (Optional cinematic video/image)

- **`/admin/collections/tours`**
  - View all Tours.
  - **Create / Edit Tour:**
    - `Title` (e.g., Zanzibar - Rêve Tropical)
    - `Destination Link` (Select from Destinations)
    - `Story Days` (The interactive horizontal timeline. Add days, locations, activities, and 9:16 media)
    - `Itinerary Blocks` (Legacy layout fallback)
    - `Thumbnail Media` (Optional cover)

- **`/admin/collections/media`**
  - Centralized media library hooked into S3 / Cloudflare R2.
  - Upload 4K videos, images, and documents.

- **`/admin/collections/users`**
  - Manage access control, admin accounts, and passwords.

---

> **Note on Slugs:** All dynamic URLs (`[slug]`) are completely URL-friendly and automatically sanitized by the CMS backend. The frontend performs case-insensitive matching to ensure users never encounter 404 dead ends if a link is typed with capital letters.

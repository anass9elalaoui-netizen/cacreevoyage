# Cacree Voyage - Website Overview

This document provides a comprehensive overview of the Cacree Voyage website's architecture, including the technology stack, pages, UI sections (components), and content models (collections).

## 🛠️ Technology Stack

The project is built on a modern, high-performance web stack:

- **Framework**: Next.js 15 (App Router)
- **CMS**: Payload CMS 3 (integrated with Next.js App Router)
- **Database**: PostgreSQL (via `@payloadcms/db-postgres`)
- **Language**: TypeScript / React 19
- **Styling**: Tailwind CSS for utility-first styling
- **Animations & Scrolling**: Framer Motion (for animations) and Lenis (for smooth scrolling)
- **Storage**: AWS S3 integration for media uploads (`@payloadcms/storage-s3`)
- **Other Utilities**: Sharp (image optimization), GraphQL

## 🗺️ Pages (Routes)
Located in `src/app/(frontend)/`

- **`/` (Home)**: The main landing page showcasing featured tours, destinations, and testimonials.
- **`/about`**: Information about the travel agency and its mission.
- **`/blog`**: Travel articles and guides.
- **`/destinations`**: Explores specific regions and countries, along with associated tours.
- **`/tours`**: The comprehensive list of all travel packages and individual tour pages (e.g., `/tours/[slug]`).
- **`/sur-mesure`**: A dedicated form page for users to request tailor-made itineraries.
- **`/contact`**: Standard contact form and company information.
- **`/checkout`**: The booking and checkout flow for purchasing tours.
- **Legal Pages**: 
  - **`/cgv`**: General Conditions of Sale.
  - **`/confidentialite`**: Privacy Policy.
  - **`/mentions-legales`**: Legal Mentions.

## 🧩 UI Sections & Components
Located in `src/components/`

### Navigation & Layout
- `GlassNavbar.tsx`: The main navigation header featuring a glassy, modern aesthetic.
- `Footer.tsx`: Website footer with links and contact info.
- `CookieBanner.tsx`: GDPR-compliant cookie consent banner.
- `FloatingWhatsApp.tsx`: A floating widget for quick customer support.

### Heroes & Headers
- `HeroGallery.tsx`: A visually rich image gallery used in hero sections.
- `SubpageHero.tsx` (in `hero/`): Standardized hero header for subpages (like About, Contact).

### Tours & Destinations
- `FeaturedToursGrid.tsx` & `TourCard.tsx`: Display grids and individual cards for tour packages.
- `DestinationCarousel.tsx` & `DestinationSwiper.tsx`: Interactive sliders for browsing destinations.
- `ItineraryTimeline.tsx`: A step-by-step timeline view for a tour's daily schedule.
- `BookingSidebar.tsx`: The sticky sidebar on tour pages for selecting dates and initiating checkout.

### Social Proof & Engagement
- `TestimonialsCarousel.tsx` & `DestinationTestimonials.tsx`: Carousels displaying customer reviews.
- `TrustStats.tsx`: A section highlighting key statistics (e.g., number of travelers, destinations).
- `ReelsShowcase.tsx`: A component for showcasing vertical video content (like Instagram Reels).
- `CinematicPanel.tsx`: A highly visual, immersive section for storytelling.

### Forms & Interactions
- `SurMesureForm.tsx`: The complex multi-step form for tailor-made trip requests.
- `FAQAccordion.tsx`: An accordion-style component for answering common questions.

## 🗄️ Content Models (Payload Collections)
Located in `src/collections/`

- **`Tours`**: The core product model containing pricing, itineraries, galleries, and availability.
- **`Destinations`**: Regions/Countries that tours are linked to.
- **`Articles`**: Content for the travel blog.
- **`Orders`**: Records of customer bookings and transactions.
- **`Inquiries`**: Submissions from the contact and tailor-made forms.
- **`FAQ`**: Frequently asked questions managed by the admin.
- **`Testimonials`**: Customer reviews that can be attached to specific tours or displayed globally.
- **`Media`**: Centralized media library connected to S3.
- **`Users`**: System users (admins and potentially customers).

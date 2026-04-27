# Analyse Complete - Projet Ca Cree Voyage

> Document pour le client. Resume toutes les pages, collections, composants et recommandations futures.

---

## 1. Stack Technique

- **Framework:** Next.js 15.3.1 (App Router)
- **CMS:** Payload CMS 3.43.0 + PostgreSQL (Neon)
- **Stockage media:** Cloudflare R2 (S3-compatible)
- **Styling:** Tailwind CSS 3.4 + Glassmorphism
- **Animations:** Framer Motion 11.11
- **Fonts:** Cormorant Garamond (serif luxe) + Inter

---

## 2. Collections CMS (6 collections)

### 2.1 `users` — Comptes Admin
Champs: `email`, `name`, `role` (admin/editor). Acces prive.

### 2.2 `destinations` — Pays/Regions
Champs: `title`, `slug` (auto), `description`, `scope` (national/international), `headerMedia` (video/image banniere).
**Pages:** `/destinations/national`, `/destinations/international`, `/destinations/[slug]`

### 2.3 `tours` — Circuits
Champs: `title`, `slug`, `duration`, `scope`, `destination` (relation), `excerpt`, `thumbnail`, `heroVideo`, `gallery` (array images), `itineraryBlocks` (array jour par jour avec dayTitle, dayImage, dayContent rich text).
**Page:** `/tours/[slug]` avec timeline verticale animee.

### 2.4 `testimonials` — Temoignages Video Reels
Champs: `clientName`, `tourReference`, `videoReel` (vertical 9:16).
**Composant:** Carrousel horizontal type Instagram Reels sur la page d'accueil.

### 2.5 `inquiries` — Demandes Sur Mesure (Leads)
Champs: `fullName`, `email`, `phone`, `destinationWish`, `budget` (5 tranches MAD), `message`, `status` (new/contacted/closed).
**Acces:** Creation publique. Lecture reservee aux admins.
**Integration:** Soumission via wizard `/sur-mesure` + notification WhatsApp automatique.

### 2.6 `media` — Bibliotheque de Fichiers
Champs: `file` (stockage R2), `alt` (obligatoire). Utilise par toutes les collections pour images et videos.

---

## 3. Pages Frontend

### 3.1 Accueil — `/`
- **HeroGallery:** 4 colonnes cinematiques avec videos de fond. Desktop: hover expand. Mobile: swipe horizontal.
- **DestinationCarousel:** Cards horizontales. Image par defaut, video au survol. Snap scroll.
- **ReelsShowcase:** Videos verticales type Stories/Reels. Autoplay au scroll.
- **CTA Sur Mesure:** Carte glassmorphism avec lien `/sur-mesure`.
- **Footer:** Brand + liens + Instagram/WhatsApp.

### 3.2 National & International — `/destinations/national`, `/destinations/international`
Grille responsive (1/2/3 colonnes). Cards avec image/video auto-play + gradient + titre.

### 3.3 Detail Destination — `/destinations/[slug]`
- Header cinematique plein ecran (video/image)
- Liste des circuits associes a cette destination
- CTA Sur Mesure si aucun circuit

### 3.4 Detail Circuit — `/tours/[slug]`
- Hero video plein ecran (100vh) + overlay gradient
- Glass card: titre, duree, scope, excerpt
- Timeline itineraire jour par jour (alternance gauche/droite, animation scroll)
- Rich text Lexical pour les descriptions
- CTA "Personnaliser ce voyage" vers `/sur-mesure?reference=...`

### 3.5 Sur Mesure — `/sur-mesure`
Wizard Typeform a 4 etapes avec fond video:
1. **Destination** — Input texte large minimalist
2. **Budget** — 5 cartes glassmorphism selectables (MAD)
3. **Message** — Textarea libre (dates, activites)
4. **Contact** — Nom + Email + Telephone

**Features UX:** Progress bar animee, slide Framer Motion, navigation Precedent/Suivant.
**Soumission:** POST API + redirection WhatsApp avec message pre-rempli (`+212661373347`).

---

## 4. Composants Reutilisables

| Composant | Description |
|-----------|-------------|
| **GlassNavbar** | Nav fixe glassmorphism. Dropdown Destinations (National/International). Lien Sur Mesure. |
| **DestinationCarousel** | Carrousel horizontal snap. Cards image+video hover. |
| **ReelsShowcase** | Carrousel video vertical 9:16. IntersectionObserver autoplay. Bouton mute. |
| **ItineraryTimeline** | Timeline jour par jour alternee. Animation scroll. Rich text Lexical. |
| **HeroGallery** | Grille 4 colonnes expand-on-hover (desktop) / swipe (mobile). |
| **Footer** | Liens navigation, reseaux sociaux, copyright. |

---

## 5. Configuration & Infra

- **Admin:** `localhost:3000/admin` (login requis)
- **Media stockes sur:** Cloudflare R2 (`cacreevoyage-media`)
- **URL publique media:** `https://pub-925c6a08cfd74451a3f7e27ee1e4c8d3.r2.dev/media/...`
- **Images Next.js:** Domaines R2 whitelistes (`*.r2.dev`, `*.r2.cloudflarestorage.com`)
- **WhatsApp integration:** Fallback `+212661373347`

---

## 6. Fonctionnalites Implementees (Resume)

- [x] CMS complet avec 6 collections
- [x] Upload media vers Cloudflare R2 (S3)
- [x] Homepage cinematique avec 4 hero videos, carrousels, reels
- [x] Navigation glassmorphism avec dropdown
- [x] Pages destinations (national + international) avec grille responsive
- [x] Pages detail destination + circuits associes
- [x] Page detail circuit avec timeline itineraire jour par jour
- [x] Wizard Sur Mesure 4 etapes avec animations Framer Motion
- [x] Dual-action submission: API Payload + WhatsApp redirect
- [x] Systeme de leads avec statuts (new/contacted/closed)
- [x] Gestions des roles (admin/editor)
- [x] Slug auto-generation depuis les titres
- [x] Rich text editor (Lexical) pour les descriptions de jour

---

## 7. Fonctionnalites Futures Recommandees

### Priorite Haute
- **Page Mentions Legales** — Le lien existe dans le Footer mais la page n'existe pas encore (`/mentions-legales`)
- **Mobile Menu** — Le burger menu est present dans la navbar mais non fonctionnel
- **Page Tous les Circuits** — Liste globale `/tours` sans filtre destination
- **SEO meta dynamique** — Titres et descriptions par page (tours, destinations)
- **Sitemap + Robots.txt** — Pour le referencement Google

### Priorite Moyenne
- **Page A Propos** — Histoire de l'agence, equipe, valeurs
- **Blog / Journal de Voyage** — Collection `posts` avec articles SEO
- **Newsletter** — Collection emails, formulaire d'inscription
- **Avis clients texte** — Stars + commentaires en complement des video reels
- **Page FAQ** — Questions frequentes voyage
- **Reservation / Paiement** — Intégration CMI (Maroc) ou Stripe
- **Multilingue** — i18n FR/EN/AR

### Priorite Basse / Evolutions
- **Compte client** — Authentification frontend, historique de demandes
- **Dashboard Admin** — Statistiques leads, graphiques conversion
- **Export leads** — CSV/Excel des demandes
- **Notifications email** — SendGrid/Resend pour confirmation demande
- **Calendrier de disponibilite** — Par tour, par saison
- **Galerie photo immersive** — Lightbox sur les pages tour
- **Video testimonials autoplay son** — Actuellement mute par defaut
- **Filtres circuits** — Par prix, duree, type (aventure/luxe/famille)
- **Wishlist / Favoris** — Sauvegarde circuits pour visiteurs

---

## 8. Notes pour le Client — Comment Utiliser l'Admin

1. **Ajouter une destination:** Admin → Destinations → Create. Upload `headerMedia`. Le `slug` se genere auto.
2. **Ajouter un circuit:** Admin → Tours → Create. Lier a une destination. Ajouter `itineraryBlocks` jour par jour avec images + texte.
3. **Ajouter un temoignage:** Admin → Testimonials → Create. Video verticale 9:16 recommandee.
4. **Gerer les demandes:** Admin → Inquiries. Modifier le statut au fur et a mesure du suivi.
5. **Uploader un media:** Admin → Media. L'`alt` est obligatoire pour l'accessibilite.

---

*Document genere le 23 Avril 2026. A mettre a jour au fil des evolutions du projet.*

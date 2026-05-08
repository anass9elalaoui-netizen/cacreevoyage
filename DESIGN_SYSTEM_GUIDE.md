# 🎨 Ça Crée Voyage — Brand & Design System Guide

This document outlines the official design system for the **Ça Crée Voyage** platform. It serves as a reference for designers, developers, and content creators to ensure a cohesive, high-end, cinematic brand experience across all touchpoints.

---

## 1. Brand Philosophy: "Dark Luxury"

The aesthetic of Ça Crée Voyage is built around the concept of **"Dark Luxury"**. Instead of traditional bright and airy travel websites, the platform uses deep, rich tones and immersive, cinematic visuals to create a sense of exclusivity, mystery, and premium service.

- **Vibe:** Cinematic, Exclusive, Immersive, Premium.
- **Key Visuals:** Full-screen video backgrounds, deep shadows, subtle glows, and glass-like transparencies.

---

## 2. Color Palette

The color system is restricted to maintain the high-end feel. 

| Color Name | Hex Code | Usage |
|---|---|---|
| **Ocean Navy** (Base) | `#0B132B` | The global background color. All pages, modals, and sections must rest on this color. **No pure white backgrounds are allowed.** |
| **Midnight Shadow** | `#050814` | Used for deep contrasts, footer backgrounds, and secondary section depths. |
| **Oasis Teal** (Accent) | `#38A3A5` | Used sparingly for buttons, active states, progress bars, and subtle highlights. |
| **Pearl White** (Text) | `#FFFFFF` | Primary typography color. |
| **Muted Silver** (Subtext) | `#A0ABC0` | Used for secondary text, metadata, and inactive states. |

---

## 3. Typography

We use a two-font system that balances classic elegance with modern readability.

### Primary Font: **Cormorant Garamond** (Serif)
- **Usage:** Main Headings (H1, H2), Hero Titles, Quotes, and prominent destination names.
- **Vibe:** Elegant, traditional, editorial, and luxurious.
- **Weights:** Regular (400), Semi-Bold (600), Bold (700).

### Secondary Font: **Inter** (Sans-Serif)
- **Usage:** Body text, UI elements (buttons, navigation, tags), pricing, and metadata.
- **Vibe:** Clean, modern, highly legible.
- **Weights:** Light (300), Regular (400), Medium (500).

---

## 4. UI Components & Layouts

### A. The "Story Timeline" (Tours)
- **Format:** Horizontal scrolling timeline.
- **Card Ratio:** 9:16 (Vertical, like an Instagram/TikTok story).
- **Style:** Cards feature full-bleed imagery/video with a dark gradient overlay at the bottom for text legibility.
- **Animation:** Elements slide and fade in as the user scrolls horizontally, creating a "journey" effect.

### B. Glassmorphism
- **Usage:** Floating navigation bars, booking cards, and destination summaries.
- **Implementation:** Semi-transparent dark backgrounds (`rgba(255, 255, 255, 0.05)`) paired with background blur (`backdrop-filter: blur(12px)`) and subtle borders (`border-white/10`).

### C. Ambient Glows
- **Usage:** Behind text blocks or cards to lift them off the dark background.
- **Implementation:** Large, heavily blurred circles (`blur-[120px]`) colored with the Oasis Teal (`#38A3A5`) at very low opacity (5-10%).

---

## 5. Media & Imagery Guidelines

To maintain the "Dark Luxury" feel, all uploaded media must adhere to the following standards:
1. **Mood:** Dramatic lighting, golden hour, deep contrasts. Avoid flat, over-exposed, or overly vibrant "stock-photo" style imagery.
2. **Quality:** High-resolution (4K preferred for hero videos, 1080p for images).
3. **Format:** 
   - **Hero sections:** 16:9 Landscape Video or high-res photography.
   - **Tour Story Cards:** 9:16 Vertical photography or looping micro-videos.
4. **Legibility:** All hero media is automatically treated with a gradient overlay to ensure text remains readable.

---

> **Design Review:** Any new feature, page, or component added to the platform must be reviewed against this document to ensure it does not break the cinematic illusion of the Ça Crée Voyage brand.

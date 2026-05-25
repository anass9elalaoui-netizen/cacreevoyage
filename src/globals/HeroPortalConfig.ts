import type { GlobalConfig } from 'payload'

export const HeroPortalConfig: GlobalConfig = {
  slug: 'hero-portal-config',
  label: 'Hero Portal Config',
  admin: {
    description:
      'Configuration du hero scroll-canvas de la page d\'accueil — frames vidéo + textes 3 phases',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'assetBaseUrl',
      type: 'text',
      label: 'Asset Base URL',
      defaultValue: '/hero-frames',
      admin: {
        description:
          'URL de base pour les frames hero (ex: /hero-frames ou URL Cloudflare R2)',
      },
    },
    {
      name: 'frameCount',
      type: 'number',
      label: 'Nombre de frames',
      defaultValue: 142,
      admin: {
        description: 'Nombre total de frames dans la séquence vidéo hero',
      },
    },
    {
      name: 'textPhase1Title',
      type: 'text',
      label: 'Phase 1 — Titre',
      defaultValue: "L'art du voyage sur-mesure.",
    },
    {
      name: 'textPhase1Sub',
      type: 'text',
      label: 'Phase 1 — Sous-titre',
      defaultValue: 'Chaque grand voyage commence par une porte fermée.',
    },
    {
      name: 'textPhase2Title',
      type: 'text',
      label: 'Phase 2 — Titre',
      defaultValue: 'Éveillez vos sens.',
    },
    {
      name: 'textPhase2Sub',
      type: 'text',
      label: 'Phase 2 — Sous-titre',
      defaultValue: "Un monde d'exceptions s'ouvre à vous.",
    },
    {
      name: 'textPhase3Title',
      type: 'text',
      label: 'Phase 3 — Titre',
      defaultValue: 'Prenez votre envol.',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'CTA Label',
      defaultValue: 'Créer Mon Voyage',
    },
  ],
}

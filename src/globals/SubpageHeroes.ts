import type { GlobalConfig } from 'payload'

const heroGroupFields = [
  {
    name: 'title',
    type: 'text' as const,
    localized: true,
    admin: { description: 'Titre principal du hero' },
  },
  {
    name: 'subtitle',
    type: 'text' as const,
    localized: true,
    admin: { description: 'Sous-titre / badge au-dessus du titre' },
  },
  {
    name: 'description',
    type: 'textarea' as const,
    localized: true,
    admin: { description: 'Texte descriptif sous le titre' },
  },
  {
    name: 'backgroundMedia',
    type: 'upload' as const,
    relationTo: 'media' as const,
    required: false,
    admin: {
      description: 'Image ou vidéo affichée en plein écran en arrière-plan du hero',
    },
  },
  {
    name: 'ctaLabel',
    type: 'text' as const,
    localized: true,
    admin: { description: 'Texte du bouton CTA (laisser vide pour masquer)' },
  },
  {
    name: 'ctaHref',
    type: 'text' as const,
    admin: { description: 'Lien du bouton CTA (ex: /sur-mesure)' },
  },
  {
    name: 'badgeStat1Number',
    type: 'text' as const,
    admin: { description: 'Badge flottant #1 — Nombre (ex: 45+)' },
  },
  {
    name: 'badgeStat1Label',
    type: 'text' as const,
    localized: true,
    admin: { description: 'Badge flottant #1 — Label (ex: Destinations)' },
  },
  {
    name: 'badgeStat2Number',
    type: 'text' as const,
    admin: { description: 'Badge flottant #2 — Nombre (ex: 500+)' },
  },
  {
    name: 'badgeStat2Label',
    type: 'text' as const,
    localized: true,
    admin: { description: 'Badge flottant #2 — Label (ex: Voyageurs)' },
  },
]

export const SubpageHeroes: GlobalConfig = {
  slug: 'subpage-heroes',
  label: 'Héros des Pages Internes (Destinations & Circuits)',
  admin: {
    description: 'Configuration des bannières hero plein écran pour les pages Destinations et Nos Circuits — titre, sous-titre, média de fond, CTA, et stats',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'destinationsHero',
      type: 'group',
      label: 'Héros - Page Destinations',
      fields: heroGroupFields.map(f => ({
        ...f,
        defaultValue: f.name === 'title' ? 'Explorez nos Destinations'
          : f.name === 'subtitle' ? 'Du Maroc aux quatre coins du monde'
          : f.name === 'description' ? 'Des expériences uniques, méticuleusement conçues pour vous.'
          : f.name === 'ctaLabel' ? 'Explorer'
          : f.name === 'ctaHref' ? '/destinations/international'
          : f.name === 'badgeStat1Number' ? '45+'
          : f.name === 'badgeStat1Label' ? 'Destinations'
          : f.name === 'badgeStat2Number' ? '500+'
          : f.name === 'badgeStat2Label' ? 'Voyageurs'
          : undefined,
      })),
    },
    {
      name: 'toursHero',
      type: 'group',
      label: 'Héros - Page Nos Circuits',
      fields: heroGroupFields.map(f => ({
        ...f,
        defaultValue: f.name === 'title' ? 'Nos Circuits'
          : f.name === 'subtitle' ? 'Collection Privée'
          : f.name === 'description' ? 'Découvrez notre collection de circuits et voyages d\'exception.'
          : f.name === 'ctaLabel' ? 'Créer Mon Voyage'
          : f.name === 'ctaHref' ? '/sur-mesure'
          : f.name === 'badgeStat1Number' ? '8'
          : f.name === 'badgeStat1Label' ? 'Années'
          : f.name === 'badgeStat2Number' ? '98%'
          : f.name === 'badgeStat2Label' ? 'Satisfaits'
          : undefined,
      })),
    },
  ],
}

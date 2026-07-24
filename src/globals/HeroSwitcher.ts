import type { GlobalConfig } from 'payload'

export const HeroSwitcher: GlobalConfig = {
  slug: 'hero-switcher',
  label: 'Hero Vidéos (Accueil)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Destinations (Maximum 4 recommandées)',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label du Bouton (ex: Safari Signature)',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          label: "Sous-titre (ex: L'évasion parfaite)",
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titre Principal',
          required: true,
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          label: "Vidéo d'arrière-plan (Format Paysage 16:9)",
          required: true,
        },
      ],
    },
  ],
}

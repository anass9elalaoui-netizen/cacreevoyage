import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scope', 'isFeatured', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title. Used in the URL: /destinations/[slug]',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const fallbackData = value || data?.title
            if (fallbackData && typeof fallbackData === 'string') {
              return fallbackData
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        description: 'Une ligne poétique, ex: "Là où le désert rencontre l\'éternité"',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        { label: 'National (Maroc)', value: 'national' },
        { label: 'International', value: 'international' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Catégorie de la destination',
      },
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Océan', value: 'ocean' },
        { label: 'Désert', value: 'desert' },
        { label: 'Montagne', value: 'mountain' },
        { label: 'Culture', value: 'culture' },
        { label: 'Forêt & Nature', value: 'forest_nature' },
      ],
      admin: {
        description: 'Thème principal de la destination',
        position: 'sidebar',
      },
    },
    {
      name: 'headerMedia',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Bannière cinématique pour la page destination (image).',
      },
    },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Vidéo cinématique en arrière-plan de la page destination.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      admin: { description: 'Galerie photo de la destination' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      admin: {
        description: '3-5 points forts pour la carte de destination',
      },
      fields: [
        {
          name: 'highlight',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'bestTimeToVisit',
      type: 'text',
      localized: true,
      admin: {
        description: 'Meilleure période pour visiter (ex: "Mars - Octobre")',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },

    /* ──────────────────────────────────────────────────────────
       SEO — Per-destination search engine optimization
    ─────────────────────────────────────────────────────────── */
    {
      name: 'seo',
      type: 'group',
      admin: { description: 'Optimisation pour les moteurs de recherche' },
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

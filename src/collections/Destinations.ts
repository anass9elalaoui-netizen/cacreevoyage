import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'description',
      type: 'textarea',
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
        description: 'Bannière cinématique pour la page destination (vidéo ou image).',
      },
    },
  ],
}

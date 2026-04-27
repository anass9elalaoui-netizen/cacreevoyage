import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
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
      admin: {
        position: 'sidebar',
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
      name: 'duration',
      type: 'text',
      required: true,
    },
    {
      name: 'seasons',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Printemps', value: 'spring' },
        { label: 'Été', value: 'summer' },
        { label: 'Automne', value: 'autumn' },
        { label: 'Hiver', value: 'winter' },
      ],
      admin: {
        description: 'Saisons recommandées pour ce circuit',
        position: 'sidebar',
      },
    },
    {
      name: 'tourStatus',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Disponible', value: 'available' },
        { label: 'Bientôt', value: 'coming_soon' },
        { label: 'Complet', value: 'sold_out' },
      ],
      admin: {
        description: 'Statut de disponibilité du circuit',
        position: 'sidebar',
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
        description: 'Thème principal du circuit',
        position: 'sidebar',
      },
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        { label: 'National', value: 'national' },
        { label: 'International', value: 'international' },
      ],
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Choisissez le pays/destination auquel ce circuit appartient.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Image de couverture pour le carrousel (affichée avant le survol vidéo).',
      },
    },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'itineraryBlocks',
      type: 'array',
      fields: [
        {
          name: 'dayTitle',
          type: 'text',
        },
        {
          name: 'dayImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'dayContent',
          type: 'richText',
        },
      ],
    },
  ],
}

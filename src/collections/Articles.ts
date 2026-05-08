import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
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
      unique: true,
      admin: { position: 'sidebar' },
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
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image de couverture (ratio 3:2 recommandé)' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Guide de Destination', value: 'guide' },
        { label: 'Conseils Voyage', value: 'conseils' },
        { label: 'Récits', value: 'recits' },
        { label: 'Actualités', value: 'actualites' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Résumé court pour les cartes d\'aperçu' },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'relatedDestinations',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
    },
    {
      name: 'relatedTours',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
    },
    {
      name: 'readTimeMinutes',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Temps de lecture estimé en minutes',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea', admin: { description: '150-160 caractères max' } },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        { name: 'keywords', type: 'text' },
      ],
    },
  ],
}

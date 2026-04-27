import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
    },
    {
      name: 'tourReference',
      type: 'text',
      required: true,
    },
    {
      name: 'videoReel',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Uniquement des vidéos verticales (9:16)',
      },
    },
  ],
}

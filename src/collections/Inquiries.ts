import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'fullName',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'destinationWish',
      type: 'text',
      required: true,
    },
    {
      name: 'budget',
      type: 'select',
      required: true,
      options: [
        { label: '< 10 000 MAD', value: 'under-10k' },
        { label: '10 000 - 25 000 MAD', value: '10k-25k' },
        { label: '25 000 - 50 000 MAD', value: '25k-50k' },
        { label: '50 000 - 100 000 MAD', value: '50k-100k' },
        { label: '> 100 000 MAD', value: 'over-100k' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'Clôturé', value: 'closed' },
      ],
    },
  ],
}

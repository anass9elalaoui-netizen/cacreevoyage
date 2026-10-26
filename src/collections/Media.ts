import type { CollectionConfig } from 'payload'
import { revalidateCollectionHooks } from '../lib/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
  },
  hooks: {
    ...revalidateCollectionHooks,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}

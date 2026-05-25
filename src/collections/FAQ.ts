import type { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'updatedAt'],
    description: 'Questions fréquentes affichées sur la homepage et les pages destination.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'La question (ex: "Comment fonctionne un voyage sur-mesure ?")' },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'La réponse détaillée à cette question.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Ordre d\'affichage (0 = premier)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Afficher cette FAQ sur le site',
      },
    },
  ],
}

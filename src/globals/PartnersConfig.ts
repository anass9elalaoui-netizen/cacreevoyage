import type { GlobalConfig } from 'payload'

export const PartnersConfig: GlobalConfig = {
  slug: 'partners-config',
  label: 'Section Partenaires',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: "Nos Partenaires d'Excellence",
      label: 'Titre de la section',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue:
        "Nous collaborons avec les leaders mondiaux de l'aviation, de l'hôtellerie et de l'assurance pour vous garantir un voyage en toute sérénité.",
      label: 'Description',
      localized: true,
    },
    {
      name: 'columnCount',
      type: 'select',
      label: 'Nombre de colonnes (Grille)',
      options: [
        { label: '3 Colonnes', value: '3' },
        { label: '4 Colonnes', value: '4' },
      ],
      defaultValue: '3',
      required: true,
    },
    {
      name: 'partnersList',
      type: 'array',
      label: 'Liste des Partenaires',
      minRows: 3,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nom de la marque',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo (SVG recommandé)',
        },
      ],
    },
  ],
}

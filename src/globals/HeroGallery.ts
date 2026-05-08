import type { GlobalConfig } from 'payload'

export const HeroGallery: GlobalConfig = {
  slug: 'hero-gallery',
  label: 'Hero Gallery',
  admin: {
    description: 'Configuration des 4 panneaux vidéo de la page d\'accueil',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'panels',
      type: 'array',
      label: 'Panneaux Hero',
      admin: {
        description: 'Exactement 4 panneaux requis pour la grille d\'accueil',
      },
      minRows: 4,
      maxRows: 4,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titre',
          admin: {
            description: 'Nom de la destination affiché sur le panneau',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Sous-titre',
          admin: {
            description: 'Texte secondaire (ex: "Archipel Paradisiaque")',
          },
        },
        {
          name: 'linkType',
          type: 'select',
          label: 'Type de lien',
          required: true,
          defaultValue: 'destination',
          options: [
            { label: 'Destination', value: 'destination' },
            { label: 'Circuit', value: 'tour' },
          ],
          admin: {
            description: 'Vers quel type de page le panneau redirige',
          },
        },
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'destinations',
          hasMany: false,
          admin: {
            description: 'Sélectionner une destination (si Type = Destination)',
            condition: (data) => data.linkType === 'destination',
          },
        },
        {
          name: 'tour',
          type: 'relationship',
          relationTo: 'tours',
          hasMany: false,
          admin: {
            description: 'Sélectionner un circuit (si Type = Circuit)',
            condition: (data) => data.linkType === 'tour',
          },
        },
        {
          name: 'posterImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image Poster',
          admin: {
            description: 'Image statique affichée avant le chargement de la vidéo',
          },
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Vidéo de fond',
          admin: {
            description: 'Vidéo MP4/WebM en arrière-plan (max 20MB)',
          },
          validate: (value: unknown) => {
            if (value && typeof value === 'object' && 'filesize' in value) {
              const filesize = (value as Record<string, unknown>).filesize as number
              if (typeof filesize === 'number' && filesize > 20971520) {
                return 'Fichier trop lourd. Veuillez compresser la vidéo en dessous de 20MB.'
              }
            }
            return true
          },
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../lib/revalidate'

export const HeroGallery: GlobalConfig = {
  slug: 'hero-gallery',
  label: 'Hero Gallery',
  admin: {
    description: 'Les 4 panneaux vidéo en haut de la page d\'accueil. Le grand titre et le titre Google se règlent dans Site Settings.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
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
          localized: true,
          admin: {
            description: 'Nom de la destination. Court : il s\'adapte à la taille de l\'écran.',
          },
        },
        {
          name: 'subtitle',
          type: 'text',
          label: 'Sous-titre',
          localized: true,
          admin: {
            description: 'Quelques mots au-dessus du titre (ex : Lagons et îles sauvages).',
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
            description: 'Première image de la vidéo : affichée tout de suite, et sur les panneaux fermés.',
          },
        },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Vidéo de fond (ordinateur)',
          admin: {
            description: 'MP4 H.264 sans son, 12 à 15 secondes, 720 px de large, moins de 5 Mo. Les fichiers .MOV de téléphone ne se lisent pas partout.',
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
        {
          name: 'backgroundVideoMobile',
          type: 'upload',
          relationTo: 'media',
          label: 'Vidéo de fond (téléphone)',
          admin: {
            description: 'Optionnel. La même vidéo en 480 px de large, moins de 2 Mo. Vide : la vidéo ordinateur est utilisée.',
          },
        },
      ],
    },
  ],
}

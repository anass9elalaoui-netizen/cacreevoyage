import type { GlobalConfig } from 'payload'
import { revalidateGlobalAfterChange } from '../lib/revalidate'

export const ActivitiesConfig: GlobalConfig = {
  slug: 'activities-config',
  label: 'Activités Homepage',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    /* ──────────────────────────────────────────────────────────
       SECTION HEADER
    ─────────────────────────────────────────────────────────── */
    {
      name: 'sectionTitle',
      type: 'text',
      required: true,
      defaultValue: 'Activités & Aventures',
      label: 'Titre de la section',
      localized: true,
    },
    {
      name: 'sectionSubtitle',
      type: 'text',
      required: true,
      defaultValue: "Vivez l'extraordinaire",
      label: 'Sous-titre',
      localized: true,
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Description SEO de la section',
      defaultValue:
        "Explorez nos activités d'aventure soigneusement sélectionnées à travers le Maroc et au-delà. Du quad dans les dunes de Merzouga au rafting dans les gorges de l'Atlas, chaque expérience est conçue pour créer des souvenirs inoubliables.",
      localized: true,
      admin: {
        description:
          'Texte introductif affiché sous le titre — important pour le référencement SEO.',
      },
    },

    /* ──────────────────────────────────────────────────────────
       ACTIVITIES LIST
    ─────────────────────────────────────────────────────────── */
    {
      name: 'activitiesList',
      type: 'array',
      label: 'Liste des Activités',
      minRows: 1,
      labels: {
        singular: 'Activité',
        plural: 'Activités',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: "Titre de l'activité",
          localized: true,
          admin: {
            description: 'Ex: "Quad 4×4 dans le désert", "Rafting en eaux vives"',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description (SEO)',
          localized: true,
          admin: {
            description:
              "Paragraphe descriptif riche en mots-clés pour le référencement. Décrivez l'activité, l'expérience et ce qui la rend unique.",
          },
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          label: 'Lieu',
          localized: true,
          admin: {
            description: 'Ex: "Merzouga", "Gorges du Dadès", "Zanzibar"',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: "Image de l'activité",
          admin: {
            description: 'Image haute résolution (16:9 recommandé, min. 1200px de large).',
          },
        },
      ],
    },
  ],
}

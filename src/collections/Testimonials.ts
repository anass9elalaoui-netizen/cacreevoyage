import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'travelerName',
    defaultColumns: ['travelerName', 'rating', 'platform', 'isHighlighted', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'travelerName',
      type: 'text',
      localized: true,
      admin: { description: 'Nom complet du voyageur' },
    },
    {
      name: 'travelerOrigin',
      type: 'text',
      localized: true,
      admin: { description: 'Ex: Paris, France' },
    },
    {
      name: 'travelerPhoto',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Photo portrait du voyageur (optionnel)' },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: { description: 'Note de 1 à 5 étoiles' },
    },
    {
      name: 'testimonialText',
      type: 'textarea',
      localized: true,
      admin: { description: 'Le témoignage du voyageur' },
    },
    {
      name: 'tour',
      type: 'relationship',
      relationTo: 'tours',
      admin: { description: 'Circuit associé (optionnel)' },
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      admin: { description: 'Destination concernée (pour les témoignages vidéo homepage)' },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Vidéo ou Audio du témoignage client (Vertical 9:16 recommandé)' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { description: 'Date du voyage ou du témoignage' },
    },
    {
      name: 'isHighlighted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mettre en avant sur la homepage',
      },
    },
    {
      name: 'platform',
      type: 'select',
      options: ['Google', 'TripAdvisor', 'Facebook', 'Direct'],
      admin: {
        position: 'sidebar',
        description: 'Source du témoignage',
      },
    },

    /* ──────────────────────────────────────────────────────────
       LEGACY: Video reel field kept for backward compatibility
    ─────────────────────────────────────────────────────────── */
    {
      name: 'videoReel',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Vidéo verticale 9:16 du témoignage (optionnel)',
      },
    },
    {
      name: 'clientName',
      type: 'text',
      admin: {
        hidden: true,
        description: '(Legacy) Utiliser travelerName à la place',
      },
    },
    {
      name: 'tourReference',
      type: 'text',
      admin: {
        hidden: true,
        description: '(Legacy) Utiliser tour (relation) à la place',
      },
    },
  ],
}

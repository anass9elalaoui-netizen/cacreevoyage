import type { CollectionConfig } from 'payload'
import { revalidateCollectionHooks } from '../lib/revalidate'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'travelerName',
    defaultColumns: ['travelerName', 'rating', 'platform', 'isHighlighted', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    ...revalidateCollectionHooks,
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
      name: 'videoPoster',
      type: 'upload',
      relationTo: 'media',
      label: 'Image de couverture de la vidéo',
      admin: {
        description:
          'Image affichée sur la carte avant la lecture (idéalement une image tirée de la vidéo du client). La vidéo ne se charge qu\'au clic.',
        condition: (data) => Boolean(data?.media),
      },
    },
    {
      name: 'videoLight',
      type: 'upload',
      relationTo: 'media',
      label: 'Version légère de la vidéo (mobile)',
      admin: {
        description:
          'Optionnel. Même vidéo en 480p (quelques Mo) : utilisée sur téléphone et connexion lente. Sans elle, la vidéo principale est utilisée partout.',
        condition: (data) => Boolean(data?.media),
      },
    },
    {
      name: 'videoPreview',
      type: 'upload',
      relationTo: 'media',
      label: 'Aperçu silencieux (6 secondes)',
      admin: {
        description:
          'Optionnel. Court extrait muet (moins de 1 Mo) qui tourne en boucle sur la carte mise en avant. Le son reste réservé à la vidéo complète.',
        condition: (data) => Boolean(data?.media),
      },
    },
    {
      name: 'tripYear',
      type: 'number',
      label: 'Année du voyage',
      min: 2000,
      max: 2100,
      admin: {
        position: 'sidebar',
        description: 'Affichée sur le tampon « carte postale » avec la destination (ex : 2025).',
      },
    },
    {
      name: 'countryCode',
      type: 'text',
      label: 'Drapeau (code pays)',
      maxLength: 2,
      validate: (value: string | null | undefined) =>
        !value || /^[A-Za-z]{2}$/.test(value) || 'Code pays à 2 lettres, par exemple MA, TR ou TZ.',
      admin: {
        position: 'sidebar',
        description: 'Code à 2 lettres du pays : MA Maroc, TR Turquie, EG Égypte, TZ Zanzibar / Tanzanie, BR Brésil. Vide : pas de drapeau.',
      },
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

import type { CollectionConfig } from 'payload'

export const Tours: CollectionConfig = {
  slug: 'tours',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scope', 'isFeatured', 'tourStatus', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.importJSON) {
          let parsed = data.importJSON
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed)
            } catch (e) {
              // Ignore parse error
            }
          }
          if (parsed && typeof parsed === 'object') {
            // Merge the parsed JSON into the document data
            Object.assign(data, parsed)
          }
          // Clear the field so it doesn't clutter the DB
          data.importJSON = null
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'importJSON',
      type: 'json',
      admin: {
        description: '⚡ AUTO-FILL: Collez le code JSON généré par l\'IA ici, puis cliquez sur Save. Tous les champs seront remplis automatiquement.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const fallbackData = value || data?.title
            if (fallbackData && typeof fallbackData === 'string') {
              return fallbackData
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      localized: true,
      admin: {
        description: '2-3 phrases pour les cartes et previews',
      },
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'departureDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date de départ confirmée (laisser vide pour les voyages sur mesure)',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'returnDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date de retour confirmée',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'seasons',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Printemps', value: 'spring' },
        { label: 'Été', value: 'summer' },
        { label: 'Automne', value: 'autumn' },
        { label: 'Hiver', value: 'winter' },
      ],
      admin: {
        description: 'Saisons recommandées pour ce circuit',
        position: 'sidebar',
      },
    },
    {
      name: 'tourStatus',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Disponible', value: 'available' },
        { label: 'Bientôt', value: 'coming_soon' },
        { label: 'Complet', value: 'sold_out' },
      ],
      admin: {
        description: 'Statut de disponibilité du circuit',
        position: 'sidebar',
      },
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Océan', value: 'ocean' },
        { label: 'Désert', value: 'desert' },
        { label: 'Montagne', value: 'mountain' },
        { label: 'Culture', value: 'culture' },
        { label: 'Forêt & Nature', value: 'forest_nature' },
      ],
      admin: {
        description: 'Thème principal du circuit',
        position: 'sidebar',
      },
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      options: [
        { label: 'National', value: 'national' },
        { label: 'International', value: 'international' },
      ],
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
      required: false,
      hasMany: false,
      admin: {
        position: 'sidebar',
        description: 'Choisissez le pays/destination auquel ce circuit appartient.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Image de couverture pour le carrousel (affichée avant le survol vidéo).',
      },
    },
    {
      name: 'heroVideo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'programPDF',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Uploader le programme en PDF (ex: Itinéraire détaillé).',
      },
    },

    /* ──────────────────────────────────────────────────────────
       PRICING — Commercial fields for booking / display
    ─────────────────────────────────────────────────────────── */
    {
      name: 'pricing',
      type: 'group',
      admin: { description: 'Informations tarifaires du circuit' },
      fields: [
        {
          name: 'basePrice',
          type: 'number',
          admin: { description: 'Prix par personne en EUR' },
        },
        {
          name: 'currency',
          type: 'select',
          options: ['EUR', 'MAD', 'USD'],
          defaultValue: 'EUR',
        },
        {
          name: 'priceIncludes',
          type: 'array',
          fields: [{ name: 'item', type: 'text', localized: true }],
          admin: { description: 'Ce qui est inclus dans le prix' },
        },
        {
          name: 'priceExcludes',
          type: 'array',
          fields: [{ name: 'item', type: 'text', localized: true }],
          admin: { description: 'Ce qui n\'est pas inclus' },
        },
        {
          name: 'depositPercentage',
          type: 'number',
          defaultValue: 30,
          admin: { description: 'Pourcentage d\'acompte pour confirmer la réservation' },
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       LOGISTICS — Operational details
    ─────────────────────────────────────────────────────────── */
    {
      name: 'logistics',
      type: 'group',
      admin: { description: 'Détails logistiques du circuit' },
      fields: [
        { name: 'durationDays', type: 'number', admin: { description: 'Nombre de jours' } },
        { name: 'durationNights', type: 'number', admin: { description: 'Nombre de nuits' } },
        { name: 'minGroupSize', type: 'number', defaultValue: 1 },
        { name: 'maxGroupSize', type: 'number', defaultValue: 12 },
        {
          name: 'difficulty',
          type: 'select',
          options: ['Facile', 'Modéré', 'Exigeant', 'Difficile'],
        },
        { name: 'departureCity', type: 'text', defaultValue: 'Casablanca', localized: true },
        {
          name: 'languages',
          type: 'select',
          hasMany: true,
          options: ['Français', 'English', 'العربية', 'Español'],
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       AVAILABILITY — Departure dates & spot tracking
    ─────────────────────────────────────────────────────────── */
    {
      name: 'departureDates',
      type: 'array',
      admin: { description: 'Dates de départ planifiées avec disponibilité' },
      fields: [
        { name: 'date', type: 'date', required: true },
        { name: 'spotsLeft', type: 'number' },
        {
          name: 'status',
          type: 'select',
          options: ['Available', 'Limited', 'Full', 'On Request'],
          defaultValue: 'Available',
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       SEO — Per-tour search engine optimization
    ─────────────────────────────────────────────────────────── */
    {
      name: 'seo',
      type: 'group',
      admin: { description: 'Optimisation pour les moteurs de recherche' },
      fields: [
        { name: 'metaTitle', type: 'text', localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true, admin: { description: '150-160 caractères max' } },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
        { name: 'keywords', type: 'text', localized: true },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       FEATURED & COMMERCIAL FLAGS
    ─────────────────────────────────────────────────────────── */
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOrder',
      type: 'number',
      admin: {
        position: 'sidebar',
        condition: (data) => data.isFeatured,
        description: 'Ordre d\'affichage dans la section Featured',
      },
    },

    /* ──────────────────────────────────────────────────────────
       LEGACY: Old itinerary blocks (kept for backward compat)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'itineraryBlocks',
      type: 'array',
      admin: {
        description: '(Legacy) Anciens blocs d\'itinéraire avec contenu riche. Préférer "Story Days" ci-dessous.',
      },
      fields: [
        {
          name: 'dayTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'dayImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'dayContent',
          type: 'richText',
          localized: true,
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       NEW: Travel Story Timeline — Vertical 9:16 Format
    ─────────────────────────────────────────────────────────── */
    {
      name: 'storyDays',
      type: 'array',
      label: 'Story Days (Timeline 9:16)',
      admin: {
        description: 'Itinéraire jour par jour au format Travel Story vertical. Chaque jour est une carte plein écran 9:16.',
      },
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          required: true,
          admin: {
            description: 'Numéro du jour (ex: 1, 2, 3…)',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Titre du jour (ex: "Arrivée aux Dunes")',
          },
        },
        {
          name: 'location',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Lieu principal (ex: "Errachidia -> Merzouga")',
          },
        },
        {
          name: 'activities',
          type: 'array',
          required: true,
          admin: {
            description: 'Liste des activités du jour',
          },
          fields: [
            {
              name: 'activity',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            description: 'Média vertical 9:16 (vidéo ou image) pour ce jour.',
          },
        },
      ],
    },
  ],
}

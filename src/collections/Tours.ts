import type { CollectionConfig } from 'payload'
import { revalidateCollectionHooks } from '../lib/revalidate'

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
    ...revalidateCollectionHooks,
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
      name: 'tourStatus',
      label: 'Disponibilité',
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
      name: 'isAvailable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Circuit Disponible / Visible au public',
      admin: {
        position: 'sidebar',
        description:
          'Cochez cette case si le circuit est actuellement ouvert aux réservations. Si décoché, la carte de la destination redirigera uniquement vers la page d\'inspiration.',
      },
    },
    {
      name: 'departureDate',
      label: 'Date de départ',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date de départ confirmée (laisser vide pour les voyages sur mesure)',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'returnDate',
      label: 'Date de retour',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date de retour confirmée',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' },
      },
    },
    {
      name: 'destination',
      label: 'Destination',
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
      name: 'theme',
      label: 'Thème',
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
      name: 'seasons',
      label: 'Saisons',
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
      name: 'isFeatured',
      label: 'Mettre en avant (badge Signature)',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featuredOrder',
      label: 'Ordre de mise en avant',
      type: 'number',
      admin: {
        position: 'sidebar',
        condition: (data) => data.isFeatured,
        description: 'Ordre d\'affichage dans la section Featured',
      },
    },
    // Tabs without a name only organise the admin screen: the data and the database stay the same
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          description: 'Ce que le visiteur lit en premier.',
          fields: [
            {
              name: 'title',
              label: 'Titre du circuit',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'scope',
              label: 'Type de circuit',
              type: 'select',
              required: true,
              options: [
                { label: 'National', value: 'national' },
                { label: 'International', value: 'international' },
              ],
            },
            {
              name: 'duration',
              label: 'Durée',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: 'Affichée telle quelle partout sur le site. Exemple : 4 Jours / 2 Nuits',
              },
            },
            {
              name: 'excerpt',
              label: 'Phrase d\'accroche',
              type: 'textarea',
              required: true,
              localized: true,
              admin: {
                description: 'Une ou deux phrases sous le titre, en haut de la page du circuit.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              label: 'Description (section « À propos »)',
              admin: {
                description: 'Le texte de présentation du circuit, sous le haut de page. Vide : la phrase d\'accroche est utilisée.',
              },
            },
          ],
        },
        {
          label: 'Photos et vidéo',
          fields: [
            {
              name: 'thumbnail',
              label: 'Photo de couverture',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'La grande photo en haut de la page du circuit, et sur sa carte dans les listes.',
              },
            },
            {
              name: 'gallery',
              label: 'Galerie photos',
              labels: { singular: 'Photo', plural: 'Photos' },
              type: 'array',
              admin: {
                description: 'Les 2 premières photos s\'affichent à côté de la couverture sur ordinateur. Toutes se balaient en haut de page sur téléphone.',
              },
              fields: [
                {
                  name: 'image',
                  label: 'Photo',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'heroVideo',
              label: 'Vidéo du haut de page (optionnel)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Remplace la photo de couverture en haut de page. Utiliser un fichier MP4 léger, compatible avec tous les navigateurs.',
              },
            },
            {
              name: 'programPDF',
              label: 'Programme en PDF (optionnel)',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Uploader le programme en PDF (ex: Itinéraire détaillé).',
              },
            },
          ],
        },
        {
          label: 'Programme',
          fields: [
            {
              name: 'storyDays',
              type: 'array',
              label: 'Programme jour par jour',
              labels: { singular: 'Jour', plural: 'Jours' },
              admin: {
                description: 'Jusqu\'à 5 jours : tout le programme est visible sur la page. Au-delà : les jours défilent en carrousel.',
              },
              fields: [
                {
                  name: 'dayNumber',
                  label: 'Numéro du jour',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Numéro du jour (1, 2, 3…)',
                  },
                },
                {
                  name: 'title',
                  label: 'Titre du jour',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: {
                    description: 'Exemple : Samedi 21 novembre 2026',
                  },
                },
                {
                  name: 'location',
                  label: 'Lieu',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: {
                    description: 'Exemple : Errachidia → Merzouga',
                  },
                },
                {
                  name: 'activities',
                  label: 'Activités',
                  labels: { singular: 'Activité', plural: 'Activités' },
                  type: 'array',
                  required: true,
                  admin: {
                    description: 'Une ligne par activité.',
                  },
                  fields: [
                    {
                      name: 'activity',
                      label: 'Activité',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                },
                {
                  name: 'media',
                  label: 'Photo ou vidéo du jour',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'Photo ou vidéo de ce jour.',
                  },
                },
              ],
            },
            {
              name: 'itineraryBlocks',
              type: 'array',
              admin: {
                description: '(Ancien format) Utilisé seulement si le programme jour par jour est vide.',
              },
              fields: [
                {
                  name: 'dayTitle',
                  label: 'Titre du jour',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'dayImage',
                  label: 'Photo du jour',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'dayContent',
                  label: 'Contenu du jour',
                  type: 'richText',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Prix et inclus',
          fields: [
            {
              name: 'pricing',
              type: 'group',
              label: 'Prix',
              admin: { hideGutter: true },
              fields: [
                {
                  name: 'basePrice',
                  type: 'number',
                  label: 'Prix par personne',
                  admin: { description: 'Vide : le site affiche « Sur devis ».' },
                },
                {
                  name: 'currency',
                  label: 'Devise',
                  type: 'select',
                  options: ['EUR', 'MAD', 'USD'],
                  defaultValue: 'EUR',
                },
                {
                  name: 'priceIncludes',
                  type: 'array',
                  label: 'Ce qui est inclus',
                  labels: { singular: 'Élément', plural: 'Éléments' },
                  fields: [{ name: 'item', label: 'Élément', type: 'text', localized: true }],
                  admin: { description: 'La liste « Ce qui est inclus », sous le programme.' },
                },
                {
                  name: 'priceExcludes',
                  type: 'array',
                  fields: [{ name: 'item', type: 'text', localized: true }],
                  admin: { hidden: true },
                },
                {
                  name: 'depositPercentage',
                  type: 'number',
                  defaultValue: 30,
                  label: 'Acompte (%)',
                  admin: { description: 'Vide : aucun acompte affiché. Exemple : 30' },
                },
              ],
            },
          ],
        },
        {
          label: 'Infos pratiques',
          fields: [
            {
              name: 'logistics',
              type: 'group',
              label: 'Infos pratiques',
              admin: { hideGutter: true, description: 'Chaque information remplie s\'affiche sur la page du circuit. Vide : elle disparaît.' },
              fields: [
                { name: 'durationDays', type: 'number', admin: { hidden: true } },
                { name: 'durationNights', type: 'number', admin: { hidden: true } },
                { name: 'minGroupSize', label: 'Groupe minimum', type: 'number', defaultValue: 1 },
                { name: 'maxGroupSize', label: 'Groupe maximum', type: 'number', defaultValue: 12 },
                {
                  name: 'difficulty',
                  label: 'Difficulté',
                  type: 'select',
                  options: ['Facile', 'Modéré', 'Exigeant', 'Difficile'],
                },
                { name: 'departureCity', label: 'Ville(s) de départ', type: 'text', defaultValue: 'Casablanca', localized: true },
                {
                  name: 'languages',
                  label: 'Langues',
                  type: 'select',
                  hasMany: true,
                  options: ['Français', 'English', 'العربية', 'Español'],
                },
              ],
            },
            {
              name: 'departureDates',
              type: 'array',
              label: 'Plusieurs dates de départ (optionnel)',
              labels: { singular: 'Date', plural: 'Dates' },
              admin: { description: 'Uniquement si le circuit part plusieurs fois : ajoute un tableau des dates sur la page.' },
              fields: [
                { name: 'date', label: 'Date', type: 'date', required: true },
                { name: 'spotsLeft', label: 'Places restantes', type: 'number' },
                {
                  name: 'status',
                  label: 'Statut',
                  type: 'select',
                  options: ['Available', 'Limited', 'Full', 'On Request'],
                  defaultValue: 'Available',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          description: 'Comment le circuit apparaît sur Google. Optionnel.',
          fields: [
            {
              name: 'seo',
              type: 'group',
              admin: { description: 'Optimisation pour les moteurs de recherche' },
              fields: [
                { name: 'metaTitle', label: 'Titre Google', type: 'text', localized: true },
                { name: 'metaDescription', label: 'Description Google', type: 'textarea', localized: true, admin: { description: '150-160 caractères max' } },
                { name: 'ogImage', label: 'Image de partage (réseaux sociaux)', type: 'upload', relationTo: 'media' },
                { name: 'keywords', label: 'Mots-clés', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Import',
          fields: [
            {
              name: 'importJSON',
              type: 'json',
              admin: {
                description: '⚡ AUTO-FILL: Collez le code JSON généré par l\'IA ici, puis cliquez sur Save. Tous les champs seront remplis automatiquement.',
              },
            },
          ],
        },
      ],
    },
  ],
}

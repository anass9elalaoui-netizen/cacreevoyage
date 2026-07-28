import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du Site',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    /* ──────────────────────────────────────────────────────────
       BRAND IDENTITY (LOGO & NAV)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'brandIdentity',
      type: 'group',
      label: 'Identité Visuelle & Logo',
      fields: [
        {
          name: 'logoImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Image du Logo (Header)',
        },
        {
          name: 'logoText',
          type: 'text',
          label: 'Texte du Logo (Fallback)',
          defaultValue: 'Ça Crée Voyage',
          localized: true,
        },
        {
          name: 'logoHeight',
          type: 'number',
          label: 'Hauteur du logo (px)',
          defaultValue: 28,
        },
        {
          name: 'logoPosition',
          type: 'select',
          label: 'Position du Logo (Desktop)',
          options: [
            { label: 'Gauche', value: 'left' },
            { label: 'Centré', value: 'center' },
          ],
          defaultValue: 'left',
        },
        {
          name: 'faviconImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Favicon',
        },
      ],
    },
    /* ──────────────────────────────────────────────────────────
       CONTACT INFORMATION
    ─────────────────────────────────────────────────────────── */
    {
      name: 'contactPhone',
      type: 'text',
      label: 'Téléphone de contact',
      defaultValue: '+212661373347',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'Numéro WhatsApp',
      required: true,
      defaultValue: '+212661373347',
      admin: { description: 'Inclure l\'indicatif pays: +212XXXXXXXXX' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Email de contact',
      defaultValue: 'contact@cacreevoyage.com',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Adresse physique',
      localized: true,
    },

    /* ──────────────────────────────────────────────────────────
       SOCIAL MEDIA
    ─────────────────────────────────────────────────────────── */
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Lien Instagram',
    },
    {
      name: 'facebookUrl',
      type: 'text',
      label: 'Lien Facebook',
    },
    {
      name: 'tiktokUrl',
      type: 'text',
      label: 'Lien TikTok',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'Lien YouTube',
    },

    /* ──────────────────────────────────────────────────────────
       HOMEPAGE HERO CONTENT (Editable from CMS)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'homepageHero',
      type: 'group',
      label: 'Contenu Hero Homepage',
      fields: [
        {
          name: 'headline',
          type: 'text',
          defaultValue: "Voyages d'Exception, Créés Pour Vous",
          localized: true,
        },
        {
          name: 'subheadline',
          type: 'textarea',
          defaultValue: 'Laissez-vous guider par nos experts pour vivre des expériences uniques et sur-mesure, aux quatre coins du monde.',
          localized: true,
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Créer Mon Voyage',
          localized: true,
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       SEO DEFAULTS
    ─────────────────────────────────────────────────────────── */
    {
      name: 'seoDefaults',
      type: 'group',
      label: 'SEO par Défaut',
      fields: [
        {
          name: 'defaultTitle',
          type: 'text',
          defaultValue: 'Ça Crée Voyage — Voyages de Luxe Sur-Mesure',
          localized: true,
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue: "Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d'exception.",
          localized: true,
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },



    /* ──────────────────────────────────────────────────────────
       LEGACY FIELDS (backward compatibility)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title par défaut (Legacy)',
      admin: { description: 'Utiliser seoDefaults.defaultTitle à la place' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description par défaut (Legacy)',
      admin: { description: 'Utiliser seoDefaults.defaultDescription à la place' },
    },

    /* ──────────────────────────────────────────────────────────
       REVIEW BADGES (Google & Trustpilot)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'reviewBadges',
      type: 'group',
      label: 'Badges Avis (Google & Trustpilot)',
      admin: {
        description: 'Configurez les widgets d\'avis affichés dans la section Philosophie de la page d\'accueil.',
      },
      fields: [
        {
          name: 'googleReviews',
          type: 'group',
          label: 'Google Reviews',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Afficher le badge Google',
              defaultValue: true,
            },
            {
              name: 'rating',
              type: 'text',
              label: 'Note (ex: 4.9)',
              defaultValue: '4.9',
            },
            {
              name: 'reviewCount',
              type: 'text',
              label: 'Nombre d\'avis (ex: 120+)',
              defaultValue: '120+',
            },
            {
              name: 'profileUrl',
              type: 'text',
              label: 'Lien vers le profil Google',
              defaultValue: 'https://g.co/kgs/cacreevoyage',
              admin: { description: 'URL de votre fiche Google Business' },
            },
            {
              name: 'quote',
              type: 'text',
              label: 'Citation mise en avant',
              defaultValue: 'Une expérience inoubliable !',
              localized: true,
            },
          ],
        },
        {
          name: 'trustpilot',
          type: 'group',
          label: 'Trustpilot',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Afficher le badge Trustpilot',
              defaultValue: true,
            },
            {
              name: 'rating',
              type: 'text',
              label: 'Note (ex: 4.8)',
              defaultValue: '4.8',
            },
            {
              name: 'reviewCount',
              type: 'text',
              label: 'Nombre d\'avis (ex: 85+)',
              defaultValue: '85+',
            },
            {
              name: 'profileUrl',
              type: 'text',
              label: 'Lien Trustpilot',
              defaultValue: 'https://trustpilot.com/review/cacreevoyage.com',
            },
            {
              name: 'quote',
              type: 'text',
              label: 'Citation mise en avant',
              defaultValue: 'Service exceptionnel, voyage parfait',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}

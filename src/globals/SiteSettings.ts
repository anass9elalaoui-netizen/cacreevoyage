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
        },
        {
          name: 'subheadline',
          type: 'textarea',
          defaultValue: 'Laissez-vous guider par nos experts pour vivre des expériences uniques et sur-mesure, aux quatre coins du monde.',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          defaultValue: 'Créer Mon Voyage',
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
        },
        {
          name: 'defaultDescription',
          type: 'textarea',
          defaultValue: "Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d'exception.",
        },
        {
          name: 'defaultOgImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* ──────────────────────────────────────────────────────────
       TRUST STATS (Homepage animated counters)
    ─────────────────────────────────────────────────────────── */
    {
      name: 'trustStats',
      type: 'array',
      label: 'Statistiques de Confiance',
      maxRows: 4,
      admin: {
        description: 'Compteurs animés affichés sur la homepage (max 4)',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          admin: { description: 'Ex: 500+' },
        },
        {
          name: 'label',
          type: 'text',
          admin: { description: 'Ex: Voyageurs Satisfaits' },
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
  ],
}

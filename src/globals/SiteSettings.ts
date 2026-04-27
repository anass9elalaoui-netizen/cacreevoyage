import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Paramètres du Site',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
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
      defaultValue: '+212661373347',
    },
    {
      name: 'contactEmail',
      type: 'email',
      label: 'Email de contact',
      defaultValue: 'contact@cacreevoyage.com',
    },
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
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title par défaut',
      defaultValue: 'Ça Crée Voyage — Voyages Sur Mesure',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description par défaut',
      defaultValue: "Circuits et voyages sur mesure. Laissez-vous inspirer par nos destinations d'exception.",
    },
  ],
}

import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'tourInterest', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
      admin: { description: 'Numéro WhatsApp avec indicatif pays' },
    },
    {
      name: 'nationality',
      type: 'text',
    },
    {
      name: 'tourInterest',
      type: 'relationship',
      relationTo: 'tours',
      hasMany: true,
      admin: { description: 'Circuits qui intéressent le client' },
    },
    {
      name: 'destinationInterest',
      type: 'relationship',
      relationTo: 'destinations',
      hasMany: true,
      admin: { description: 'Destinations souhaitées' },
    },
    {
      name: 'travelType',
      type: 'select',
      options: [
        { label: 'Sur-Mesure', value: 'Sur-Mesure' },
        { label: 'Groupe', value: 'Groupe' },
        { label: 'Voyage de Noces', value: 'Voyage de Noces' },
        { label: 'Famille', value: 'Family' },
        { label: 'Corporate / Incentive', value: 'Corporate' },
      ],
    },
    {
      name: 'budget',
      type: 'select',
      options: [
        { label: '< 1 000€', value: 'under-1k' },
        { label: '1 000 - 2 500€', value: '1k-2.5k' },
        { label: '2 500 - 5 000€', value: '2.5k-5k' },
        { label: '5 000 - 10 000€', value: '5k-10k' },
        { label: '> 10 000€', value: 'over-10k' },
      ],
    },
    {
      name: 'travelersCount',
      type: 'number',
      admin: { description: 'Nombre de voyageurs' },
    },
    {
      name: 'preferredDates',
      type: 'text',
      admin: { description: 'Dates souhaitées (texte libre ou plage)' },
    },
    {
      name: 'flexibleDates',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Le client a des dates flexibles' },
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Formulaire Sur-Mesure', value: 'sur-mesure-form' },
        { label: 'Page Circuit', value: 'tour-page' },
        { label: 'Page Contact', value: 'contact-page' },
        { label: 'WhatsApp', value: 'whatsapp' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'Nouveau', value: 'new' },
        { label: 'Contacté', value: 'contacted' },
        { label: 'En cours', value: 'in-progress' },
        { label: 'Converti', value: 'converted' },
        { label: 'Perdu', value: 'lost' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      admin: {
        description: 'Notes internes de l\'agence — non visible par le client',
      },
    },

    /* ──────────────────────────────────────────────────────────
       LEGACY: kept to avoid database column deletion prompts
    ─────────────────────────────────────────────────────────── */
    {
      name: 'destinationWish',
      type: 'text',
      admin: {
        hidden: true,
        description: '(Legacy) Ancien champ — utiliser destinationInterest à la place',
      },
    },
  ],
}

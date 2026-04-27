import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'tourId', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'tourId',
      type: 'relationship',
      relationTo: 'tours',
      required: true,
      admin: {
        description: 'Circuit réservé',
      },
    },
    {
      name: 'clientName',
      type: 'text',
      required: true,
      label: 'Nom du client',
    },
    {
      name: 'clientPhone',
      type: 'text',
      required: true,
      label: 'Téléphone',
    },
    {
      name: 'clientEmail',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'passengers',
      type: 'number',
      required: true,
      min: 1,
      max: 20,
      defaultValue: 1,
      label: 'Nombre de passagers',
    },
    {
      name: 'travelDate',
      type: 'date',
      label: 'Date de voyage souhaitée',
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      label: 'Demandes spéciales',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending_virement',
      options: [
        { label: 'En attente de virement', value: 'pending_virement' },
        { label: 'Virement reçu', value: 'virement_received' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'Annulé', value: 'cancelled' },
      ],
      admin: {
        description: 'Statut de la réservation',
        position: 'sidebar',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      label: 'Montant total (MAD)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'paymentProof',
      type: 'upload',
      relationTo: 'media',
      label: 'Preuve de paiement',
      admin: {
        description: 'Reçu ou capture du virement',
      },
    },
  ],
}

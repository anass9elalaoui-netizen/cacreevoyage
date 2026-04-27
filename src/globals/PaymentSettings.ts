import type { GlobalConfig } from 'payload'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: 'Paramètres de Paiement',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'bankName',
      type: 'text',
      required: true,
      label: 'Nom de la banque',
      defaultValue: 'Attijariwafa Bank',
    },
    {
      name: 'accountHolder',
      type: 'text',
      required: true,
      label: 'Titulaire du compte',
      defaultValue: 'Ça Crée Voyage SARL',
    },
    {
      name: 'ribNumber',
      type: 'text',
      required: true,
      label: 'Numéro RIB',
    },
    {
      name: 'iban',
      type: 'text',
      label: 'IBAN',
    },
    {
      name: 'qrCodeImage',
      type: 'upload',
      relationTo: 'media',
      label: 'QR Code de paiement',
      admin: {
        description: 'QR Code pour paiement par virement bancaire ou mobile',
      },
    },
    {
      name: 'paymentInstructions',
      type: 'richText',
      label: 'Instructions de paiement',
      defaultValue: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Veuillez effectuer un virement sur le compte indiqué ci-dessus. Envoyez-nous la preuve de paiement via WhatsApp pour confirmation rapide.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
    },
  ],
}

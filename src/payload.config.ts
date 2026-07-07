import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Tours } from './collections/Tours'
import { Destinations } from './collections/Destinations'
import { Testimonials } from './collections/Testimonials'
import { Inquiries } from './collections/Inquiries'
import { Articles } from './collections/Articles'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Orders } from './collections/Orders'
import { SiteSettings } from './globals/SiteSettings'
import { PaymentSettings } from './globals/PaymentSettings'
import { HeroGallery } from './globals/HeroGallery'
import { HeroPortalConfig } from './globals/HeroPortalConfig'
import { SubpageHeroes } from './globals/SubpageHeroes'

import { FAQ } from './collections/FAQ'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Ça Crée Voyage CMS',
      icons: [{ url: '/logo.jpeg' }],
      openGraph: {
        images: [{ url: '/logo.jpeg' }],
      },
    },
    components: {
      graphics: {
        Logo: './components/AdminLogo.js#AdminLogo',
        Icon: './components/AdminLogo.js#AdminIcon',
      },
    },
  },
  localization: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    fallback: true,
  },
  collections: [Users, Destinations, Tours, Testimonials, Inquiries, Articles, Media, Orders, FAQ],
  globals: [SiteSettings, PaymentSettings, HeroGallery, HeroPortalConfig, SubpageHeroes],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'ca_cree_voyage_super_secret_key_2026_xyz',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: String(process.env.DATABASE_URI || ''),
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
          generateFileURL: ({ filename: fname, prefix }) =>
            `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${prefix}/${fname}`,
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: false,
      },
    }),
  ],
})

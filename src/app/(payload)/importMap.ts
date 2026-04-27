import { AdminLogo, AdminIcon } from '@/components/AdminLogo'
import { S3ClientUploadHandler } from '@payloadcms/storage-s3/client'

export const importMap = {
  './components/AdminLogo.js#AdminLogo': AdminLogo,
  './components/AdminLogo.js#AdminIcon': AdminIcon,
  '@payloadcms/storage-s3/client#S3ClientUploadHandler': S3ClientUploadHandler,
}

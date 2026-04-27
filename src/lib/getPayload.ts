import { getPayload as getPayloadInstance } from 'payload'
import config from '@payload-config'

/**
 * Singleton Payload instance for server-side data fetching.
 * Use this in Server Components and Route Handlers.
 */
export async function getPayload() {
  return getPayloadInstance({ config })
}

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const destinationsSeed = [
  { title: 'Philippines', scope: 'international' as const, theme: 'ocean' as const, description: 'Archipel paradisiaque aux eaux turquoise et rizières en terrasses.' },
  { title: 'Vietnam', scope: 'international' as const, theme: 'culture' as const, description: 'Des temples ancestraux aux baies mythiques, un voyage hors du temps.' },
  { title: 'Zanzibar', scope: 'international' as const, theme: 'ocean' as const, description: "L'île aux épices, entre plages immaculées et culture swahilie." },
  { title: 'Turquie', scope: 'international' as const, theme: 'culture' as const, description: "Au carrefour des mondes, entre Orient et Occident." },
  { title: 'Égypte', scope: 'international' as const, theme: 'desert' as const, description: 'Les pyramides, le Nil et les trésors pharaoniques.' },
  { title: 'Kazakhstan', scope: 'international' as const, theme: 'mountain' as const, description: "Steppes infinies et canyons spectaculaires d'Asie Centrale." },
  { title: 'Brésil', scope: 'international' as const, theme: 'forest_nature' as const, description: "De l'Amazonie à Rio, une explosion de vie et de couleurs." },
  { title: 'Dakhla', scope: 'national' as const, theme: 'ocean' as const, description: 'Lagune mythique, kitesurf et sérénité saharienne.' },
  { title: 'Merzouga', scope: 'national' as const, theme: 'desert' as const, description: "Les dunes dorées de l'Erg Chebbi, aux portes du Sahara." },
  { title: 'Imlil', scope: 'national' as const, theme: 'mountain' as const, description: 'Village berbère niché au cœur du Haut Atlas.' },
  { title: 'Imilchil', scope: 'national' as const, theme: 'culture' as const, description: 'Terre de légendes et du célèbre moussem des fiançailles.' },
  { title: 'Imsfrane', scope: 'national' as const, theme: 'forest_nature' as const, description: 'Cascades et forêts de cèdres, le Maroc secret.' },
  { title: 'Fhas Lmher', scope: 'national' as const, theme: 'forest_nature' as const, description: 'Nature brute et authentique, loin des sentiers battus.' },
]

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const results: string[] = []

    for (const dest of destinationsSeed) {
      const slug = slugify(dest.title)

      const { docs: existing } = await payload.find({
        collection: 'destinations',
        where: { slug: { equals: slug } },
        limit: 1,
      })

      if (existing.length > 0) {
        await payload.update({
          collection: 'destinations',
          id: existing[0].id,
          data: {
            title: dest.title,
            slug,
            scope: dest.scope,
            theme: dest.theme,
            description: dest.description,
          },
        })
        results.push(`✅ Updated: ${dest.title} → /destinations/${slug}`)
      } else {
        await payload.create({
          collection: 'destinations',
          data: {
            title: dest.title,
            slug,
            scope: dest.scope,
            theme: dest.theme,
            description: dest.description,
          } as any,
        })
        results.push(`✅ Created: ${dest.title} → /destinations/${slug}`)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Seed complete — ${results.filter((r) => r.startsWith('✅')).length}/13 destinations processed`,
        details: results,
      },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, stack: error.stack },
      { status: 500 },
    )
  }
}

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* ─── Slugify ──────────────────────────────────────────── */
function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ─── Destinations Data ─────────────────────────────────── */
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

/* ─── Tour Itinerary Data ───────────────────────────────── */
const toursSeed = [
  {
    title: 'Zanzibar — Rêve Tropical',
    slug: 'zanzibar-reve-tropical',
    duration: '14 jours',
    scope: 'international' as const,
    theme: 'ocean' as const,
    destinationSlug: 'zanzibar',
    departureDate: '2026-05-14',
    returnDate: '2026-05-27',
    excerpt: "14 jours d'émerveillement entre plages immaculées, safaris et culture swahilie — l'évasion ultime.",
    storyDays: [
      { dayNumber: 1, title: 'Departure', location: 'Casablanca → Istanbul', activities: [{ activity: 'Flight via Turkish Airlines' }, { activity: 'Free morning in Istanbul' }, { activity: 'Flight to Zanzibar' }] },
      { dayNumber: 3, title: 'Stone Town Immersion', location: 'Stone Town', activities: [{ activity: 'Arrival & Transfer' }, { activity: 'Guided tour with francophone guide' }, { activity: 'Sunset viewing' }] },
      { dayNumber: 4, title: 'History & Paradise', location: 'Prison Island & Nakupenda', activities: [{ activity: 'Boat cruise to giant tortoises' }, { activity: 'Sunbathing & lunch on Nakupenda sandbank' }] },
      { dayNumber: 5, title: 'Safari Option', location: 'Zanzibar / Mikumi', activities: [{ activity: 'Optional beach day OR 1-day Safari to Mikumi National Park by plane' }] },
      { dayNumber: 6, title: 'Northern Beaches', location: 'Nungwi / Kendwa', activities: [{ activity: 'Free time at the beach' }] },
      { dayNumber: 7, title: 'Sunset Cruise', location: 'Nungwi', activities: [{ activity: 'Private Sunset Cruise with DJ & Afro dancers' }] },
      { dayNumber: 8, title: 'Marine Life', location: 'Mnemba & Pongwe', activities: [{ activity: 'Swim with dolphins' }, { activity: 'Snorkeling at Mnemba' }, { activity: 'Relaxation at Pongwe Island' }] },
      { dayNumber: 9, title: 'The Southern Vibe', location: 'Paje', activities: [{ activity: 'Transfer to South Island' }, { activity: 'Check-in with sea view' }, { activity: 'Beach relaxation' }] },
      { dayNumber: 10, title: 'Pool & Beach', location: 'Paje', activities: [{ activity: 'Full day chill at the pool and beach' }] },
      { dayNumber: 11, title: 'Turtles & Hidden Coves', location: 'Salama Cave & Mtende', activities: [{ activity: 'Swim and feed turtles at sanctuary' }, { activity: 'Bathing at Mtende Beach' }] },
      { dayNumber: 12, title: 'Final Relaxations', location: 'Paje', activities: [{ activity: 'Free time' }, { activity: 'Last-minute souvenir shopping' }] },
      { dayNumber: 13, title: 'The Return', location: 'Zanzibar → Istanbul', activities: [{ activity: 'Flight via Turkish Airlines' }, { activity: 'Free day in Istanbul' }] },
      { dayNumber: 14, title: 'Homecoming', location: 'Istanbul → Casablanca', activities: [{ activity: 'Final flight home' }, { activity: 'End of the dream journey' }] },
    ],
  },
  {
    title: 'Merzouga — Immersion Saharienne',
    slug: 'merzouga-immersion-saharienne',
    duration: '4 jours',
    scope: 'national' as const,
    theme: 'desert' as const,
    destinationSlug: 'merzouga',
    departureDate: '2026-06-05',
    returnDate: '2026-06-08',
    excerpt: "4 jours entre dunes dorées, bivouacs de luxe et caravanes de chameaux — le Sahara comme vous ne l'avez jamais vécu.",
    storyDays: [
      { dayNumber: 1, title: 'Le Grand Départ', location: 'Casablanca → Meknès', activities: [{ activity: 'Départ de Casablanca voyageurs (21:00) et Rabat ville (22:30)' }, { activity: 'Pause dîner libre puis départ de Meknès' }] },
      { dayNumber: 2, title: 'Arrivée aux Dunes', location: 'Errachidia → Merzouga', activities: [{ activity: "Petit déjeuner libre à Errachidia et check-in à l'hôtel à Merzouga" }, { activity: 'Temps libre et détente à la piscine avec déjeuner inclus' }, { activity: 'Excursion optionnelle en quad (1h) dans les dunes' }, { activity: "Dîner inclus à l'hôtel, jeux de société et nuitée" }] },
      { dayNumber: 3, title: 'Immersion Saharienne', location: 'Dunes de Merzouga & Bivouacs', activities: [{ activity: 'Safari en 4x4 : excursion en plein désert, Musée Automobile et thé chez les nomades' }, { activity: 'Déjeuner à Khamlia chez les Gnaouas' }, { activity: 'Caravane à dos de chameaux vers nos bivouacs de luxe' }, { activity: 'Thé de bienvenue, check-in, et dîner au milieu du désert' }, { activity: 'Soirée sur les rythmes folkloriques de Gnaoua et feu de camp' }] },
      { dayNumber: 4, title: 'Retour aux Sources', location: 'Merzouga → Casablanca', activities: [{ activity: "Réveil sous le charme d'un splendide lever de soleil" }, { activity: 'Petit déjeuner aux bivouacs de luxe et retour vers Merzouga' }, { activity: 'Visite de la vallée de ZIZ et déjeuner libre à Zayda' }, { activity: 'Arrivée à Meknès, Rabat, et Casablanca' }] },
    ],
  },
  {
    title: 'Fahs El Mahr — Monte Blanco',
    slug: 'fahs-el-mahr-monte-blanco',
    duration: '3 jours',
    scope: 'national' as const,
    theme: 'mountain' as const,
    destinationSlug: 'fhas-lmher',
    departureDate: '2026-05-29',
    returnDate: '2026-05-31',
    excerpt: "3 jours d'aventure entre randonnée, quad et panoramas méditerranéens — le nord sauvage du Maroc.",
    storyDays: [
      { dayNumber: 1, title: 'En Route vers le Nord', location: 'Casablanca → Tétouan', activities: [{ activity: 'Rassemblement à Casa voyageurs (18h00) et Rabat Ville (19h30)' }, { activity: 'Pause dîner libre et départ de Kenitra' }, { activity: "Arrivée à l'hôtel à Tétouan, check-in et nuitée" }] },
      { dayNumber: 2, title: "L'Ascension Monte Blanco", location: 'Plateau Fahs Lamhar', activities: [{ activity: 'Départ en minibus vers le point de début avec notre guide local' }, { activity: 'Randonnée pédestre (niveau facile) traversant le plateau sacré' }, { activity: 'Arrivée au sommet Monte Blanco (838m), déjeuner pique-nique' }, { activity: 'Vue panoramique sur le barrage Smir et la mer Méditerranée' }, { activity: "Descente, retour à l'hôtel, dîner en ville et soirée jeux" }] },
      { dayNumber: 3, title: 'Aventure en Quad', location: 'Barrage Smir → Casablanca', activities: [{ activity: "Petit déjeuner à l'hôtel et check-out" }, { activity: 'Transfert au barrage Smir pour une excursion en quad en binôme' }, { activity: 'Pause thé avec vue sur le barrage' }, { activity: 'Déjeuner libre à Tétouan et route du retour' }] },
    ],
  },
]

/* ─── GET handler ────────────────────────────────────────── */
export async function GET() {
  try {
    // ⛔ Production guard — never allow seeding in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Seeding is disabled in production.' },
        { status: 403 },
      )
    }

    const payload = await getPayload({ config: configPromise })
    const results: string[] = []

    /* ── Phase 1: Seed Destinations ── */
    results.push('━━━ DESTINATIONS ━━━')
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
          data: { title: dest.title, slug, scope: dest.scope, theme: dest.theme, description: dest.description },
        })
        results.push(`✅ Updated: ${dest.title} → /destinations/${slug}`)
      } else {
        await payload.create({
          collection: 'destinations',
          data: { title: dest.title, slug, scope: dest.scope, theme: dest.theme, description: dest.description } as any,
        })
        results.push(`✅ Created: ${dest.title} → /destinations/${slug}`)
      }
    }

    /* ── Phase 2: Seed Tours with Story Days ── */
    results.push('')
    results.push('━━━ TOURS ━━━')
    for (const tour of toursSeed) {
      // Resolve destination ID
      let destinationId: number | string | undefined
      if (tour.destinationSlug) {
        const { docs: destDocs } = await payload.find({
          collection: 'destinations',
          where: { slug: { equals: tour.destinationSlug } },
          limit: 1,
        })
        if (destDocs.length > 0) destinationId = destDocs[0].id
      }

      const { docs: existing } = await payload.find({
        collection: 'tours',
        where: { slug: { equals: tour.slug } },
        limit: 1,
      })

      const tourData: Record<string, unknown> = {
        title: tour.title,
        slug: tour.slug,
        duration: tour.duration,
        scope: tour.scope,
        theme: tour.theme,
        excerpt: tour.excerpt,
        storyDays: tour.storyDays,
        departureDate: (tour as any).departureDate || undefined,
        returnDate: (tour as any).returnDate || undefined,
      }
      if (destinationId) tourData.destination = destinationId

      if (existing.length > 0) {
        await payload.update({
          collection: 'tours',
          id: existing[0].id,
          data: tourData as any,
        })
        results.push(`✅ Updated: ${tour.title} → /tours/${tour.slug} (${tour.storyDays.length} days)`)
      } else {
        await payload.create({
          collection: 'tours',
          data: tourData as any,
        })
        results.push(`✅ Created: ${tour.title} → /tours/${tour.slug} (${tour.storyDays.length} days)`)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Seed complete — ${destinationsSeed.length} destinations + ${toursSeed.length} tours`,
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

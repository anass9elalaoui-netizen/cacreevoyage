import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const testimonialsData = [
      {
        travelerName: 'Sophie et Marc',
        travelerOrigin: 'Paris, France',
        testimonialText: 'Un voyage sur-mesure absolument parfait. Chaque étape était pensée avec soin, les riads étaient sublimes et notre chauffeur était d\'une gentillesse incroyable. Une expérience marocaine authentique et luxueuse.',
        rating: 5,
        platform: 'Google',
        isHighlighted: true,
      },
      {
        travelerName: 'Thomas L.',
        travelerOrigin: 'Genève, Suisse',
        testimonialText: 'L\'attention aux détails de Ça Crée Voyage est exceptionnelle. De notre arrivée à Marrakech jusqu\'à notre nuit dans le désert d\'Agafay, tout a été orchestré d\'une main de maître. Je recommande les yeux fermés.',
        rating: 5,
        platform: 'TripAdvisor',
        isHighlighted: true,
      },
      {
        travelerName: 'Emma R.',
        travelerOrigin: 'Bruxelles, Belgique',
        testimonialText: 'Une immersion totale dans la culture marocaine tout en conservant un standard de confort très élevé. Les guides locaux recommandés étaient de véritables passionnés.',
        rating: 5,
        platform: 'Direct',
        isHighlighted: true,
      },
      {
        travelerName: 'Laurent D.',
        travelerOrigin: 'Lyon, France',
        testimonialText: 'Nous voulions découvrir le sud du Maroc loin des sentiers battus. L\'équipe a su créer un itinéraire hors normes. La nuit en bivouac de luxe restera gravée à jamais.',
        rating: 5,
        platform: 'Google',
        isHighlighted: true,
      },
      {
        travelerName: 'Marie et Jean',
        travelerOrigin: 'Montréal, Canada',
        testimonialText: 'Deux semaines de rêve à travers les villes impériales. Service irréprochable, réactivité de l\'équipe sur place et sélection d\'hébergements vraiment premium. Merci pour tout!',
        rating: 4,
        platform: 'TripAdvisor',
        isHighlighted: false,
      },
      {
        travelerName: 'Julien B.',
        travelerOrigin: 'Bordeaux, France',
        testimonialText: 'L\'équilibre parfait entre aventure et détente. Les recommandations de restaurants étaient excellentes et le rythme du voyage exactement comme nous l\'avions demandé.',
        rating: 5,
        platform: 'Direct',
        isHighlighted: true,
      },
    ]

    for (const data of testimonialsData) {
      await payload.create({
        collection: 'testimonials',
        data,
      })
    }

    return NextResponse.json({ success: true, message: 'Testimonials seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

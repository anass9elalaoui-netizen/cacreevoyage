import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tourId, clientName, clientPhone, clientEmail, passengers, travelDate, specialRequests, status } = body

    if (!tourId || !clientName || !clientPhone) {
      return NextResponse.json(
        { message: 'Les champs tourId, clientName et clientPhone sont requis.' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const order = await payload.create({
      collection: 'orders',
      data: {
        tourId,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        passengers: passengers || 1,
        travelDate: travelDate || null,
        specialRequests: specialRequests || null,
        status: status || 'pending_virement',
      },
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (err: any) {
    console.error('Order creation error:', err)
    return NextResponse.json(
      { message: err.message || 'Erreur serveur.' },
      { status: 500 },
    )
  }
}

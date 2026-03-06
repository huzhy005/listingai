import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { userId, email } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{
      price: process.env.STRIPE_PRO_PRICE_ID!,
      quantity: 1,
    }],
    customer_email: email,
    metadata: { userId },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  })

  return NextResponse.json({ url: session.url })
}

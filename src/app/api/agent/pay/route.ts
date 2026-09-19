import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new NextResponse(
    JSON.stringify({
      status: 402,
      error: 'Payment Required',
      message: 'This endpoint supports agent-native HTTP payments via the x402 protocol.',
      x402: {
        version: '1.0',
        price: '9.99',
        currency: 'USD',
        recipient: '0x0000000000000000000000000000000000000000',
        facilitator: 'https://x402.org/facilitator',
        network: 'base'
      }
    }, null, 2),
    {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'X-Payment-Required': 'true',
        'X-Payment-Price': '9.99',
        'X-Payment-Currency': 'USD',
        'X-Payment-Facilitator': 'https://x402.org/facilitator',
        'WWW-Authenticate': 'x402 realm="SamplesWala", price="9.99", currency="USD"'
      }
    }
  )
}

import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const prm = {
    resource: "https://sampleswala.com",
    authorization_servers: [
      "https://sampleswala.com"
    ],
    scopes_supported: [
      "openid",
      "profile",
      "email",
      "samples:read",
      "packs:download"
    ],
    bearer_methods_supported: [
      "header"
    ]
  }

  return new NextResponse(JSON.stringify(prm, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

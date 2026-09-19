import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: "https://sampleswala.com/api",
        "service-desc": [
          {
            href: "https://sampleswala.com/openapi.json",
            type: "application/json"
          }
        ],
        "service-doc": [
          {
            href: "https://sampleswala.com/browse",
            type: "text/html"
          }
        ],
        status: [
          {
            href: "https://sampleswala.com/api/telemetry/heartbeat",
            type: "application/json"
          }
        ]
      }
    ]
  }

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 🟢 CPU OPTIMIZATION: If the visitor has no Supabase auth cookies (guest or bot), 
  // we can completely bypass expensive auth requests, saving massive serverless CPU hours!
  const hasSessionCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-') || c.name.includes('-auth-token'))
  if (!hasSessionCookie) {
    return { supabaseResponse, user: null }
  }

  // 🟢 PREFETCH OPTIMIZATION: Next.js aggressively prefetches pages on Link hover/view.
  // We DO NOT need to perform a costly Supabase network request (getUser) for prefetch requests.
  // The actual navigation request that follows will run the middleware and refresh the session normally.
  const isPrefetch = request.headers.get('purpose') === 'prefetch' || request.headers.get('x-middleware-prefetch') === '1'
  if (isPrefetch) {
    return { supabaseResponse, user: null }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          const domain = process.env.NODE_ENV === 'production' ? '.sampleswala.com' : undefined;
          
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, { ...options, domain })
          )
        },
      },
    }
  )

  // This will refresh the session if it's expired
  const { data: { user } } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            const domain = process.env.NODE_ENV === 'production' ? '.sampleswala.com' : undefined;
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, { ...options, domain })
            )
          } catch {
            // Server Component error handling
          }
        },
      },
    }
  )
})

export const getUser = cache(async () => {
  const cookieStore = await cookies()
  
  // 🟢 CPU OPTIMIZATION: Bypass calling expensive supabase auth server requests if the user has no session cookies
  const hasSessionCookie = cookieStore.getAll().some(c => c.name.startsWith('sb-') || c.name.includes('-auth-token'))
  if (!hasSessionCookie) {
    return { data: { user: null }, error: null }
  }

  const supabase = await createClient()
  return await supabase.auth.getUser()
})

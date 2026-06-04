import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/browse'

  if (code) {
    const cookieStore = await cookies()
    const response = NextResponse.redirect(`${origin}${next}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            const domain = process.env.NODE_ENV === 'production' ? '.sampleswala.com' : undefined;
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, { ...options, domain })
              response.cookies.set(name, value, { ...options, domain })
            })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      revalidatePath('/', 'layout')
      return response
    }
  }

  // return the user to the login page with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`)
}

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // Check if Supabase passed an error directly
  if (error || error_description) {
    const errorMsg = error_description || error || 'auth-callback-failed'
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(errorMsg)}`)
  }

  // Determine redirection URL
  let next = searchParams.get('next')
  if (!next && (type === 'signup' || type === 'email')) {
    next = '/auth?confirmed=true'
  } else if (!next && type === 'recovery') {
    next = '/auth/reset'
  } else if (!next) {
    next = '/browse'
  }

  const redirectUrl = next.startsWith('http')
    ? next
    : `${origin}${next.startsWith('/') ? '' : '/'}${next}`

  if (code || (token_hash && type)) {
    const cookieStore = await cookies()
    const response = NextResponse.redirect(redirectUrl)

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

    let authError = null

    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      authError = exchangeError
    } else if (token_hash && type) {
      const { error: otpError } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      authError = otpError
    }

    if (!authError) {
      revalidatePath('/library')
      return response
    } else {
      console.error('[AUTH_CALLBACK_ERROR]', authError)
      return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(authError.message || 'auth-callback-failed')}`)
    }
  }

  // return the user to the auth page with error
  return NextResponse.redirect(`${origin}/auth?error=auth-callback-failed`)
}

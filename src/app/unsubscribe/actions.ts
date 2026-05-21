'use server'

import { createClient } from '@supabase/supabase-js'

function getAdminDB() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

export async function unsubscribeUserAction(email: string) {
  if (!email) {
    throw new Error('Email is required to unsubscribe.')
  }

  let brevoSuccess = false
  let dbSuccess = false

  // 1. Update database: set newsletter = false for matching user
  try {
    const db = getAdminDB()
    if (db) {
      // Find the auth user by email
      const { data: { users }, error: authErr } = await db.auth.admin.listUsers()
      if (!authErr && users) {
        const targetUser = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase())
        if (targetUser) {
          await db
            .from('user_accounts')
            .update({ newsletter: false })
            .eq('user_id', targetUser.id)
          dbSuccess = true
        }
      }
    }
  } catch (e) {
    console.error('Database unsubscribe error:', e)
  }

  // 2. Blacklist in Brevo
  const apiKey = process.env.BREVO_API_KEY
  if (apiKey) {
    try {
      const checkRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey
        }
      })

      if (checkRes.ok) {
        // Contact exists, blacklist them
        const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({ emailBlacklisted: true })
        })

        if (updateRes.ok) {
          brevoSuccess = true
        } else {
          const errData = await updateRes.json().catch(() => ({}))
          console.error('Brevo update failed:', errData)
        }
      } else if (checkRes.status === 404) {
        // Contact doesn't exist in Brevo — already unsubscribed technically
        brevoSuccess = true
      }
    } catch (e) {
      console.error('Brevo API error:', e)
    }
  } else {
    console.warn('BREVO_API_KEY not configured — skipping Brevo blacklist.')
  }

  // As long as at least one method succeeded, consider it done
  if (!brevoSuccess && !dbSuccess) {
    throw new Error('Unable to process unsubscribe request. Please contact support at support@sampleswala.com.')
  }

  return { brevoSuccess, dbSuccess }
}

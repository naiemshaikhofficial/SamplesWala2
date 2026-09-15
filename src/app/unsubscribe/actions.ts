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

async function getAllAuthUsers(db: any) {
  let allUsers: any[] = []
  let page = 1
  const perPage = 1000
  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage })
    if (error || !data?.users || data.users.length === 0) break
    allUsers = allUsers.concat(data.users)
    if (data.users.length < perPage) break
    page++
  }
  return allUsers
}

export async function unsubscribeUserAction(
  email: string,
  reason?: string,
  feedback?: string
) {
  const cleanEmail = email?.trim().toLowerCase()
  if (!cleanEmail) {
    throw new Error('A valid email address is required.')
  }

  let brevoSuccess = false
  let dbSuccess = false

  // 1. Update database: set newsletter = false for matching user
  try {
    const db = getAdminDB()
    if (db) {
      const users = await getAllAuthUsers(db)
      const targetUser = users.find((u: any) => u.email?.toLowerCase() === cleanEmail)
      if (targetUser) {
        await db
          .from('user_accounts')
          .update({ newsletter: false })
          .eq('user_id', targetUser.id)
        dbSuccess = true
      }
    }
  } catch (e) {
    console.error('Database unsubscribe error:', e)
  }

  // 2. Blacklist in Brevo
  const apiKey = process.env.BREVO_API_KEY
  if (apiKey) {
    try {
      const checkRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(cleanEmail)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey
        }
      })

      if (checkRes.ok) {
        // Contact exists, blacklist them
        const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(cleanEmail)}`, {
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
          console.error('Brevo blacklist failed:', errData)
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

  // Log unsubscribe event with reason
  console.log(`[Unsubscribe] Email: ${cleanEmail}, Reason: ${reason || 'N/A'}, Feedback: ${feedback || 'N/A'}`)

  // As long as at least one method succeeded, consider it done
  if (!brevoSuccess && !dbSuccess) {
    throw new Error('Unable to process unsubscribe request. Please contact support at Support@sampleswala.com.')
  }

  return { brevoSuccess, dbSuccess, email: cleanEmail, reason }
}

export async function resubscribeUserAction(email: string) {
  const cleanEmail = email?.trim().toLowerCase()
  if (!cleanEmail) {
    throw new Error('A valid email address is required.')
  }

  let brevoSuccess = false
  let dbSuccess = false

  // 1. Update database: set newsletter = true
  try {
    const db = getAdminDB()
    if (db) {
      const users = await getAllAuthUsers(db)
      const targetUser = users.find((u: any) => u.email?.toLowerCase() === cleanEmail)
      if (targetUser) {
        await db
          .from('user_accounts')
          .update({ newsletter: true })
          .eq('user_id', targetUser.id)
        dbSuccess = true
      }
    }
  } catch (e) {
    console.error('Database resubscribe error:', e)
  }

  // 2. Un-blacklist in Brevo
  const apiKey = process.env.BREVO_API_KEY
  if (apiKey) {
    try {
      const checkRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(cleanEmail)}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey
        }
      })

      if (checkRes.ok) {
        const updateRes = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(cleanEmail)}`, {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({ emailBlacklisted: false })
        })

        if (updateRes.ok) {
          brevoSuccess = true
        }
      } else if (checkRes.status === 404) {
        // Create new contact if not present
        const createRes = await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: cleanEmail,
            emailBlacklisted: false
          })
        })
        if (createRes.ok) {
          brevoSuccess = true
        }
      }
    } catch (e) {
      console.error('Brevo API resubscribe error:', e)
    }
  }

  return { brevoSuccess, dbSuccess, email: cleanEmail }
}

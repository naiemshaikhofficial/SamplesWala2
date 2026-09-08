'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/server'

export interface SupportTicket {
  id: string
  ticket_number: string
  user_id: string | null
  name: string
  email: string
  category: string
  priority: string
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED'
  order_id: string | null
  os_platform: string | null
  daw: string | null
  subject: string
  description: string
  created_at: string
  updated_at: string
}

export interface TicketSubmissionData {
  name: string
  email: string
  category: string
  priority?: string
  orderId?: string
  osPlatform?: string
  daw?: string
  subject: string
  description: string
}

/**
 * Generate a clean, unique ticket code (e.g. SW-TK-72419)
 */
function generateTicketNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000)
  return `SW-TK-${randomNum}`
}

/**
 * Create and submit a new Support Ticket to Supabase
 */
export async function createSupportTicketAction(data: TicketSubmissionData) {
  const { name, email, category, priority = 'NORMAL', orderId, osPlatform, daw, subject, description } = data

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !description?.trim()) {
    return { success: false, error: 'Please fill in all required fields.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const admin = getAdminClient()
    const { data: authData } = await getUser()
    const userId = authData?.user?.id || null

    let ticketNumber = generateTicketNumber()
    let isUnique = false
    let attempts = 0

    // Ensure ticket number uniqueness
    while (!isUnique && attempts < 5) {
      const { data: existing } = await admin
        .from('support_tickets')
        .select('id')
        .eq('ticket_number', ticketNumber)
        .maybeSingle()

      if (!existing) {
        isUnique = true
      } else {
        ticketNumber = generateTicketNumber()
        attempts++
      }
    }

    const { data: ticket, error: ticketError } = await admin
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        user_id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        category: category || 'GENERAL',
        priority: priority.toUpperCase(),
        status: 'OPEN',
        order_id: orderId?.trim() || null,
        os_platform: osPlatform || null,
        daw: daw || null,
        subject: subject.trim(),
        description: description.trim(),
      })
      .select()
      .single()

    if (ticketError) {
      console.error('[SUPPORT_TICKET_ERROR]', ticketError)
      return { success: false, error: 'Failed to create ticket. Please try again or email us directly.' }
    }

    return {
      success: true,
      ticketNumber,
      ticketId: ticket.id,
      message: `Support ticket #${ticketNumber} created successfully! Our team will get back to you shortly.`,
    }
  } catch (err: any) {
    console.error('[CREATE_TICKET_EXCEPTION]', err)
    return { success: false, error: err.message || 'Server error creating support ticket.' }
  }
}

/**
 * Retrieve public ticket status by ticket number & customer email
 */
export async function getTicketStatusAction(ticketNumber: string, email: string) {
  if (!ticketNumber?.trim() || !email?.trim()) {
    return { success: false, error: 'Ticket number and email are required to check status.' }
  }

  try {
    const admin = getAdminClient()
    const cleanNumber = ticketNumber.trim().toUpperCase()
    const cleanEmail = email.trim().toLowerCase()

    const { data: ticket, error } = await admin
      .from('support_tickets')
      .select('id, ticket_number, name, email, category, priority, status, subject, description, created_at, updated_at')
      .eq('ticket_number', cleanNumber)
      .maybeSingle()

    if (error || !ticket) {
      return { success: false, error: `No ticket found with number ${cleanNumber}.` }
    }

    // Security check: email must match ticket's recorded email
    if (ticket.email.toLowerCase() !== cleanEmail) {
      return { success: false, error: 'Email does not match the record for this ticket number.' }
    }

    return {
      success: true,
      ticket: {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        name: ticket.name,
        email: ticket.email,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        subject: ticket.subject,
        description: ticket.description,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
      },
    }
  } catch (err: any) {
    console.error('[GET_TICKET_STATUS_ERROR]', err)
    return { success: false, error: 'Failed to retrieve ticket status.' }
  }
}

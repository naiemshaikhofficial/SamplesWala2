'use server'

import { getAdminClient } from '@/lib/supabase/admin'
import { getUser } from '@/lib/supabase/server'

export interface SupportTicket {
  id: string
  ticket_number: string
  user_id: string | null
  name: string | null
  email: string | null
  category: string
  priority: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  order_id: string | null
  os_platform: string | null
  daw: string | null
  subject: string
  message: string
  admin_reply: string | null
  assigned_agent?: string | null
  last_reply_by?: 'customer' | 'admin' | string | null
  replied_at: string | null
  created_at: string
  updated_at: string
}

export interface SupportTicketMessage {
  id: string
  ticket_id: string
  sender_type: 'customer' | 'admin' | 'system'
  sender_name: string
  sender_email: string | null
  message: string
  created_at: string
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
 * Normalize category string to DB constraint allowed values
 */
function normalizeCategory(category: string): string {
  const map: Record<string, string> = {
    DOWNLOAD_ISSUE: 'download',
    PAYMENT_ORDER: 'payment',
    DAW_COMPATIBILITY: 'daw',
    LICENSING: 'licensing',
    GENERAL: 'general',
    TECHNICAL: 'technical',
    PAYOUT: 'payout',
  }
  const clean = category?.toUpperCase() || ''
  return map[clean] || category?.toLowerCase() || 'general'
}

/**
 * Fetch all tickets for the currently logged-in user
 */
export async function getUserTicketsAction(): Promise<{
  success: boolean
  user: { id: string; email: string; name?: string } | null
  tickets: SupportTicket[]
  error?: string
}> {
  try {
    const { data: authData } = await getUser()
    const currentUser = authData?.user

    if (!currentUser) {
      return { success: true, user: null, tickets: [] }
    }

    const admin = getAdminClient()
    const userEmail = currentUser.email?.toLowerCase()

    // Fetch tickets where user_id matches OR email matches
    let query = admin
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (userEmail) {
      query = query.or(`user_id.eq.${currentUser.id},email.eq.${userEmail}`)
    } else {
      query = query.eq('user_id', currentUser.id)
    }

    const { data: tickets, error } = await query

    if (error) {
      console.error('[GET_USER_TICKETS_ERROR]', error)
      return { success: false, user: null, tickets: [], error: 'Failed to retrieve tickets.' }
    }

    return {
      success: true,
      user: {
        id: currentUser.id,
        email: currentUser.email || '',
        name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '',
      },
      tickets: (tickets as SupportTicket[]) || [],
    }
  } catch (err: any) {
    console.error('[GET_USER_TICKETS_EXCEPTION]', err)
    return { success: false, user: null, tickets: [], error: err.message || 'Server error' }
  }
}

/**
 * Fetch tickets by an array of ticket numbers (used for localStorage guest sync)
 */
export async function getTicketsByNumbersAction(ticketNumbers: string[]): Promise<{
  success: boolean
  tickets: SupportTicket[]
}> {
  if (!ticketNumbers || ticketNumbers.length === 0) {
    return { success: true, tickets: [] }
  }

  try {
    const admin = getAdminClient()
    const cleanNumbers = ticketNumbers.map((n) => n.trim().toUpperCase()).filter(Boolean)

    const { data, error } = await admin
      .from('support_tickets')
      .select('*')
      .in('ticket_number', cleanNumbers)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[GET_TICKETS_BY_NUMBERS_ERROR]', error)
      return { success: false, tickets: [] }
    }

    return { success: true, tickets: (data as SupportTicket[]) || [] }
  } catch (err) {
    console.error('[GET_TICKETS_BY_NUMBERS_EXCEPTION]', err)
    return { success: false, tickets: [] }
  }
}

/**
 * Create and submit a new Support Ticket to Supabase
 */
export async function createSupportTicketAction(data: TicketSubmissionData): Promise<{
  success: boolean
  ticketNumber?: string
  ticket?: SupportTicket
  message?: string
  error?: string
}> {
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

    const dbCategory = normalizeCategory(category)
    const cleanPriority = priority.toUpperCase() === 'URGENT' ? 'URGENT' : priority.toUpperCase() === 'HIGH' ? 'HIGH' : 'NORMAL'

    const { data: ticket, error: ticketError } = await admin
      .from('support_tickets')
      .insert({
        ticket_number: ticketNumber,
        user_id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        category: dbCategory,
        priority: cleanPriority,
        status: 'open',
        order_id: orderId?.trim() || null,
        os_platform: osPlatform || null,
        daw: daw || null,
        subject: subject.trim(),
        message: description.trim(),
      })
      .select()
      .single()

    if (ticketError) {
      console.error('[SUPPORT_TICKET_ERROR]', ticketError)
      return { success: false, error: 'Failed to create ticket. Please try again or email us directly.' }
    }

    // Insert initial customer message into support_ticket_messages
    if (ticket?.id) {
      await admin.from('support_ticket_messages').insert({
        ticket_id: ticket.id,
        sender_type: 'customer',
        sender_name: name.trim(),
        sender_email: email.trim().toLowerCase(),
        message: description.trim(),
      })
    }

    return {
      success: true,
      ticketNumber,
      ticket: ticket as SupportTicket,
      message: `Support ticket #${ticketNumber} created successfully! Our audio team will get back to you shortly.`,
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
      .select('*')
      .eq('ticket_number', cleanNumber)
      .maybeSingle()

    if (error || !ticket) {
      return { success: false, error: `No ticket found with number ${cleanNumber}.` }
    }

    // Security check: email must match ticket's recorded email
    if (ticket.email && ticket.email.toLowerCase() !== cleanEmail) {
      return { success: false, error: 'Email does not match the record for this ticket number.' }
    }

    return {
      success: true,
      ticket: ticket as SupportTicket,
    }
  } catch (err: any) {
    console.error('[GET_TICKET_STATUS_ERROR]', err)
    return { success: false, error: 'Failed to retrieve ticket status.' }
  }
}

/**
 * Fetch all conversation messages for a ticket
 */
export async function getTicketMessagesAction(ticketId: string): Promise<{
  success: boolean
  messages: SupportTicketMessage[]
  error?: string
}> {
  if (!ticketId) {
    return { success: false, messages: [], error: 'Ticket ID is required' }
  }

  try {
    const admin = getAdminClient()
    const { data: messages, error } = await admin
      .from('support_ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[GET_TICKET_MESSAGES_ERROR]', error)
      return { success: false, messages: [], error: 'Failed to fetch messages' }
    }

    return {
      success: true,
      messages: (messages as SupportTicketMessage[]) || [],
    }
  } catch (err: any) {
    console.error('[GET_TICKET_MESSAGES_EXCEPTION]', err)
    return { success: false, messages: [], error: err.message || 'Server error' }
  }
}

/**
 * Send customer follow-up reply to an open or resolved ticket
 */
export async function replyToTicketCustomerAction(params: {
  ticketId: string
  message: string
  customerName?: string
  customerEmail?: string
}): Promise<{
  success: boolean
  messageRecord?: SupportTicketMessage
  error?: string
}> {
  const { ticketId, message, customerName, customerEmail } = params

  if (!ticketId || !message?.trim()) {
    return { success: false, error: 'Message content is required.' }
  }

  try {
    const admin = getAdminClient()
    const nowIso = new Date().toISOString()

    // 1. Fetch ticket to verify
    const { data: ticket, error: fetchErr } = await admin
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .maybeSingle()

    if (fetchErr || !ticket) {
      return { success: false, error: 'Ticket not found.' }
    }

    const senderName = customerName?.trim() || ticket.name || 'Customer'
    const senderEmail = customerEmail?.trim() || ticket.email || null

    // 2. Insert into support_ticket_messages
    const { data: msgData, error: msgErr } = await admin
      .from('support_ticket_messages')
      .insert({
        ticket_id: ticketId,
        sender_type: 'customer',
        sender_name: senderName,
        sender_email: senderEmail,
        message: message.trim(),
        created_at: nowIso,
      })
      .select()
      .single()

    if (msgErr) {
      console.error('[CUSTOMER_REPLY_INSERT_ERROR]', msgErr)
      return { success: false, error: 'Failed to record message.' }
    }

    // 3. Update support_tickets (status reopened to open if it was resolved/closed)
    const newStatus = ticket.status === 'resolved' || ticket.status === 'closed' ? 'open' : ticket.status

    await admin
      .from('support_tickets')
      .update({
        status: newStatus,
        last_reply_by: 'customer',
        updated_at: nowIso,
      })
      .eq('id', ticketId)

    return {
      success: true,
      messageRecord: msgData as SupportTicketMessage,
    }
  } catch (err: any) {
    console.error('[REPLY_TICKET_CUSTOMER_EXCEPTION]', err)
    return { success: false, error: err.message || 'Server error submitting reply.' }
  }
}

/**
 * Reopen a resolved or closed ticket
 */
export async function reopenTicketAction(ticketId: string): Promise<{
  success: boolean
  error?: string
}> {
  if (!ticketId) return { success: false, error: 'Ticket ID is required' }

  try {
    const admin = getAdminClient()
    const nowIso = new Date().toISOString()

    const { error } = await admin
      .from('support_tickets')
      .update({
        status: 'open',
        updated_at: nowIso,
        last_reply_by: 'customer',
      })
      .eq('id', ticketId)

    if (error) throw error

    await admin.from('support_ticket_messages').insert({
      ticket_id: ticketId,
      sender_type: 'system',
      sender_name: 'System',
      message: 'Ticket reopened by customer',
      created_at: nowIso,
    })

    return { success: true }
  } catch (err: any) {
    console.error('[REOPEN_TICKET_ERROR]', err)
    return { success: false, error: err.message || 'Failed to reopen ticket' }
  }
}

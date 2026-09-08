'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Ticket, PlusCircle, Headphones, MessageSquare, Zap, LifeBuoy } from 'lucide-react'
import {
  getUserTicketsAction,
  getTicketsByNumbersAction,
  SupportTicket,
} from '@/actions/supportActions'
import { UserTicketsList } from './UserTicketsList'
import { CreateTicketForm } from './CreateTicketForm'
import { SupportQuickFaq } from './SupportQuickFaq'

export function SupportDeskClient() {
  const [activeTab, setActiveTab] = useState<'tickets' | 'create'>('tickets')
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tickets from Supabase for logged-in user + sync any locally cached ticket numbers
  const fetchTickets = useCallback(async () => {
    setIsLoading(true)
    try {
      // 1. Fetch DB tickets for logged-in session
      const userRes = await getUserTicketsAction()
      let fetchedTickets: SupportTicket[] = []

      if (userRes.success && userRes.tickets) {
        fetchedTickets = userRes.tickets
        if (userRes.user) {
          setCurrentUser(userRes.user)
        }
      }

      // 2. Fetch any guest-submitted tickets saved in localStorage
      try {
        const storedNumbers: string[] = JSON.parse(localStorage.getItem('sampleswala_user_tickets') || '[]')
        if (Array.isArray(storedNumbers) && storedNumbers.length > 0) {
          // Exclude any already fetched
          const existingNumbers = new Set(fetchedTickets.map((t) => t.ticket_number))
          const missingNumbers = storedNumbers.filter((n) => !existingNumbers.has(n))

          if (missingNumbers.length > 0) {
            const guestRes = await getTicketsByNumbersAction(missingNumbers)
            if (guestRes.success && guestRes.tickets) {
              fetchedTickets = [...fetchedTickets, ...guestRes.tickets]
            }
          }
        }
      } catch {}

      // Deduplicate by ticket_number and sort newest first
      const map = new Map<string, SupportTicket>()
      fetchedTickets.forEach((t) => {
        if (!map.has(t.ticket_number)) {
          map.set(t.ticket_number, t)
        }
      })

      const sorted = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      setTickets(sorted)

      // Check URL search params if explicitly passed
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const tabParam = params.get('tab')
        if (tabParam === 'create') {
          setActiveTab('create')
          return
        }
        if (tabParam === 'tickets' || tabParam === 'track') {
          setActiveTab('tickets')
          return
        }
      }

      // Default: if user has open tickets, default to 'tickets' tab. If 0 tickets, default to 'create' tab!
      if (sorted.length === 0) {
        setActiveTab('create')
      } else {
        setActiveTab('tickets')
      }
    } catch (err) {
      console.error('[FETCH_TICKETS_ERROR]', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const handleTicketCreated = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev.filter((t) => t.ticket_number !== newTicket.ticket_number)])
    // Switch to tickets list to show the newly created ticket in-situ
    setActiveTab('tickets')
  }

  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Top Navigation Switcher */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('tickets')}
          className={`px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'tickets'
              ? 'border-studio-yellow text-white bg-white/[0.04]'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Ticket size={14} className={activeTab === 'tickets' ? 'text-studio-yellow' : ''} />
          <span>Your Tickets</span>
          {tickets.length > 0 && (
            <span
              className={`ml-1 px-2 py-0.5 rounded-full text-[9px] font-black ${
                openCount > 0 ? 'bg-studio-yellow text-black' : 'bg-white/10 text-white/60'
              }`}
            >
              {tickets.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'create'
              ? 'border-studio-blue text-white bg-white/[0.04]'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <PlusCircle size={14} className={activeTab === 'create' ? 'text-studio-blue' : ''} />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'tickets' && (
        <div className="animate-fadeIn space-y-8">
          <UserTicketsList
            tickets={tickets}
            isLoading={isLoading}
            onOpenNewTicket={() => setActiveTab('create')}
            onRefresh={fetchTickets}
          />
        </div>
      )}

      {activeTab === 'create' && (
        <div className="animate-fadeIn space-y-8">
          <CreateTicketForm initialUser={currentUser} onTicketCreated={handleTicketCreated} />
        </div>
      )}

      {/* Quick Diagnostics & Self-Service FAQ */}
      <div className="pt-6 border-t border-white/5">
        <SupportQuickFaq />
      </div>
    </div>
  )
}

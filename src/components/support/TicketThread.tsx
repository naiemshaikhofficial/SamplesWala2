'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Send,
  Headphones,
  FileText,
  Clock,
  CheckCircle2,
  RotateCcw,
  Mail,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import {
  SupportTicket,
  SupportTicketMessage,
  getTicketMessagesAction,
  replyToTicketCustomerAction,
  reopenTicketAction,
} from '@/actions/supportActions'
import { createClient } from '@/lib/supabase/client'

interface TicketThreadProps {
  ticket: SupportTicket
  onTicketUpdated?: (updatedTicket: SupportTicket) => void
}

export function TicketThread({ ticket, onTicketUpdated }: TicketThreadProps) {
  const [messages, setMessages] = useState<SupportTicketMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isReopening, setIsReopening] = useState(false)
  const [showReopenInput, setShowReopenInput] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  const chatBottomRef = useRef<HTMLDivElement>(null)

  // Fetch all messages for this ticket
  const loadMessages = useCallback(async () => {
    try {
      const res = await getTicketMessagesAction(ticket.id)
      if (res.success && res.messages) {
        setMessages(res.messages)
      }
    } catch (err) {
      console.error('[LOAD_TICKET_MESSAGES_ERROR]', err)
    } finally {
      setIsLoading(false)
    }
  }, [ticket.id])

  useEffect(() => {
    loadMessages()
  }, [loadMessages])

  // Scroll to bottom of thread when messages update
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  // Realtime subscription for this ticket
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`customer-ticket-${ticket.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_ticket_messages',
          filter: `ticket_id=eq.${ticket.id}`,
        },
        (payload: any) => {
          if (payload?.new) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev
              return [...prev, payload.new as SupportTicketMessage]
            })
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'support_tickets',
          filter: `id=eq.${ticket.id}`,
        },
        (payload: any) => {
          if (payload?.new && onTicketUpdated) {
            onTicketUpdated(payload.new as SupportTicket)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [ticket.id, onTicketUpdated])

  // Send Customer Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || isSending) return

    setIsSending(true)
    const content = replyText.trim()
    try {
      const res = await replyToTicketCustomerAction({
        ticketId: ticket.id,
        message: content,
        customerName: ticket.name || undefined,
        customerEmail: ticket.email || undefined,
      })

      if (res.success && res.messageRecord) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.messageRecord!.id)) return prev
          return [...prev, res.messageRecord!]
        })
        setReplyText('')
        setSendSuccess(true)
        setTimeout(() => setSendSuccess(false), 3000)

        // Optimistically update ticket status to open
        if (onTicketUpdated) {
          onTicketUpdated({
            ...ticket,
            status: 'open',
            last_reply_by: 'customer',
          })
        }
      }
    } catch (err) {
      console.error('[CUSTOMER_REPLY_FAILED]', err)
    } finally {
      setIsSending(false)
    }
  }

  // Customer reopens ticket
  const handleReopen = async () => {
    setIsReopening(true)
    try {
      const res = await reopenTicketAction(ticket.id)
      if (res.success) {
        setShowReopenInput(true)
        if (onTicketUpdated) {
          onTicketUpdated({
            ...ticket,
            status: 'open',
            last_reply_by: 'customer',
          })
        }
        await loadMessages()
      }
    } catch (err) {
      console.error('[REOPEN_TICKET_ERROR]', err)
    } finally {
      setIsReopening(false)
    }
  }

  const isClosedOrResolved = ticket.status === 'resolved' || ticket.status === 'closed'

  return (
    <div className="space-y-6">
      {/* Ticket Metadata bar */}
      {(ticket.order_id || ticket.daw || ticket.os_platform) && (
        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-sm flex flex-wrap gap-4 text-[10px] font-mono text-white/50 uppercase">
          {ticket.order_id && <span>Order Ref: {ticket.order_id}</span>}
          {ticket.daw && <span className="text-studio-blue font-bold">DAW: {ticket.daw}</span>}
          {ticket.os_platform && <span>OS: {ticket.os_platform}</span>}
        </div>
      )}

      {/* Messages Thread Box */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/40 pb-2 border-b border-white/10">
          <span>Live Conversation History</span>
          <span className="text-studio-neon flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-studio-neon animate-pulse" />
            Realtime Connected
          </span>
        </div>

        {isLoading && messages.length === 0 ? (
          <div className="p-6 text-center text-white/40 text-xs font-mono space-y-2">
            <RefreshCw size={16} className="animate-spin text-studio-yellow mx-auto" />
            <p>Loading conversation messages...</p>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer'
              const isSystem = msg.sender_type === 'system'

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-white/40 text-[9px] font-mono uppercase tracking-wider rounded-full">
                      {msg.message}
                    </span>
                  </div>
                )
              }

              if (isCustomer) {
                return (
                  <div key={msg.id} className="flex flex-col items-start max-w-[88%] space-y-1.5">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-white/40">
                      <User size={11} className="text-white/60" />
                      <span>{msg.sender_name || ticket.name || 'You'}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="p-4 bg-zinc-900/90 border border-white/15 text-white/90 text-xs rounded-sm whitespace-pre-wrap font-mono leading-relaxed shadow-sm">
                      {msg.message}
                    </div>
                  </div>
                )
              }

              // Admin / Engineer Reply
              return (
                <div key={msg.id} className="flex flex-col items-end self-end ml-auto max-w-[88%] space-y-1.5">
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-studio-blue">
                    <span>
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <Headphones size={12} />
                    <span>{msg.sender_name || ticket.assigned_agent || 'Audio Support Team'}</span>
                  </div>
                  <div className="p-4 bg-studio-blue/15 border border-studio-blue/40 text-white text-xs rounded-sm whitespace-pre-wrap font-mono font-medium leading-relaxed shadow-[0_0_20px_rgba(0,116,228,0.15)]">
                    {msg.message}
                  </div>
                </div>
              )
            })}
            <div ref={chatBottomRef} />
          </div>
        ) : (
          // Fallback if thread empty
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-sm space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Submitted Issue
              </span>
              <p className="text-xs text-white/80 whitespace-pre-wrap font-mono">{ticket.message}</p>
            </div>
            {ticket.admin_reply && (
              <div className="p-4 bg-studio-blue/15 border border-studio-blue/40 rounded-sm space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-studio-blue">
                  Audio Engineer Reply
                </span>
                <p className="text-xs text-white whitespace-pre-wrap font-mono font-medium">
                  {ticket.admin_reply}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RESOLUTION BANNER OR REPLY COMPONENT */}
      {isClosedOrResolved && !showReopenInput ? (
        <div className="p-5 bg-studio-neon/10 border border-studio-neon/30 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-studio-neon flex-shrink-0" />
            <div>
              <h5 className="text-xs font-black uppercase tracking-wider text-white">
                Ticket Marked as Resolved
              </h5>
              <p className="text-[11px] text-white/50 font-mono">
                Our audio engineers have addressed your inquiry.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReopen}
            disabled={isReopening}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-sm transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw size={12} className={isReopening ? 'animate-spin' : ''} />
            <span>Still Need Help? Reopen &amp; Reply</span>
          </button>
        </div>
      ) : (
        /* ACTIVE REPLY FORM */
        <form onSubmit={handleSendReply} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/60">
                Send Follow-up Reply to Audio Team
              </label>
              {sendSuccess && (
                <span className="text-[9px] font-black uppercase tracking-wider text-studio-neon flex items-center gap-1">
                  <CheckCircle2 size={11} /> Reply Sent Live
                </span>
              )}
            </div>
            <textarea
              required
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Describe what else you need help with, or provide requested details..."
              className="w-full bg-black/60 border border-white/20 focus:border-studio-yellow text-white p-3 text-xs font-mono rounded-sm outline-none transition-colors leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-white/30 font-mono">
              Our sound engineers monitor tickets actively.
            </span>
            <button
              type="submit"
              disabled={isSending || !replyText.trim()}
              className="px-6 py-2.5 bg-studio-yellow hover:bg-studio-yellow/90 text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(255,230,0,0.2)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={12} />
              <span>{isSending ? 'Sending...' : 'Send Reply'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Direct Email Attachment option */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px]">
        <span className="text-white/30 uppercase font-mono">
          Need to attach large audio stems, zip archives, or video screen captures?
        </span>
        <a
          href={`mailto:support@sampleswala.com?subject=Ticket ${ticket.ticket_number} Attachment: ${ticket.subject}`}
          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-black uppercase tracking-widest rounded-sm transition-colors flex items-center gap-1.5"
        >
          <Mail size={11} />
          <span>Email Attachments</span>
        </a>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Mail,
  MessageSquare,
  ShieldCheck,
  Headphones,
  FileText,
} from 'lucide-react'
import { SupportTicket } from '@/actions/supportActions'

interface UserTicketsListProps {
  tickets: SupportTicket[]
  isLoading: boolean
  onOpenNewTicket?: () => void
  onRefresh?: () => void
}

export function UserTicketsList({ tickets, isLoading, onOpenNewTicket, onRefresh }: UserTicketsListProps) {
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')

  const copyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleExpand = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id)
  }

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'open') return t.status === 'open' || t.status === 'in_progress'
    if (filter === 'resolved') return t.status === 'resolved' || t.status === 'closed'
    return true
  })

  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase()
    if (s === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-studio-neon/15 text-studio-neon border border-studio-neon/30 text-[9px] font-black uppercase tracking-widest rounded-sm">
          <CheckCircle2 size={11} strokeWidth={2.5} />
          <span>Resolved</span>
        </span>
      )
    }
    if (s === 'in_progress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-studio-blue/15 text-studio-blue border border-studio-blue/30 text-[9px] font-black uppercase tracking-widest rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-studio-blue animate-pulse" />
          <span>In Progress</span>
        </span>
      )
    }
    if (s === 'closed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 text-white/40 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-sm">
          <span>Closed</span>
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-studio-yellow/15 text-studio-yellow border border-studio-yellow/30 text-[9px] font-black uppercase tracking-widest rounded-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-studio-yellow animate-ping" />
        <span>In Queue</span>
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const p = priority?.toUpperCase()
    if (p === 'URGENT') {
      return (
        <span className="px-2 py-0.5 bg-red-500/15 text-red-400 border border-red-500/30 text-[8px] font-black uppercase tracking-wider rounded-sm">
          Urgent
        </span>
      )
    }
    if (p === 'HIGH') {
      return (
        <span className="px-2 py-0.5 bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[8px] font-black uppercase tracking-wider rounded-sm">
          High
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 bg-white/5 text-white/50 border border-white/10 text-[8px] font-black uppercase tracking-wider rounded-sm">
        Normal
      </span>
    )
  }

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      download: 'Downloads & Vault',
      payment: 'Payment & Billing',
      daw: 'DAW Compatibility',
      licensing: 'Royalty & License',
      general: 'General Query',
      technical: 'Technical Audio',
    }
    return map[cat?.toLowerCase()] || cat?.toUpperCase() || 'General'
  }

  return (
    <div className="space-y-6">
      {/* Header with Title, Count & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-studio-yellow/10 border border-studio-yellow/20 flex items-center justify-center text-studio-yellow">
            <Ticket size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">Your Support Tickets</h3>
              {openCount > 0 && (
                <span className="px-2 py-0.5 bg-studio-yellow text-black text-[9px] font-black uppercase tracking-widest rounded-full">
                  {openCount} Active
                </span>
              )}
            </div>
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
              All tickets submitted by you or on this browser are tracked right here
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          {tickets.length > 0 && (
            <div className="flex items-center bg-black/50 border border-white/10 rounded-sm p-1 gap-1">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm transition-colors ${
                  filter === 'all' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                }`}
              >
                All ({tickets.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('open')}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm transition-colors ${
                  filter === 'open' ? 'bg-studio-yellow text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                Active ({openCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('resolved')}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm transition-colors ${
                  filter === 'resolved' ? 'bg-studio-neon text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                Resolved ({tickets.length - openCount})
              </button>
            </div>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Ticket Statuses"
              className="p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-sm border border-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={isLoading ? 'animate-spin text-studio-yellow' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && tickets.length === 0 && (
        <div className="p-8 studio-panel text-center space-y-3 bg-zinc-950/60 border border-white/5">
          <RefreshCw size={24} className="animate-spin text-studio-yellow mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-white/50">
            Syncing your support tickets...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tickets.length === 0 && (
        <div className="p-8 md:p-10 studio-panel text-center space-y-4 bg-zinc-950/60 border border-dashed border-white/10 rounded-sm">
          <div className="w-12 h-12 rounded-sm bg-studio-neon/10 border border-studio-neon/20 flex items-center justify-center text-studio-neon mx-auto">
            <ShieldCheck size={26} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-widest text-white">No Open Tickets Found</h4>
            <p className="text-[11px] text-white/40 max-w-md mx-auto leading-relaxed">
              Your audio library and account are running smoothly. If you ever experience any download or payment issue,
              submit a ticket below and it will appear here instantly!
            </p>
          </div>
          {onOpenNewTicket && (
            <button
              type="button"
              onClick={onOpenNewTicket}
              className="px-5 py-2.5 bg-studio-yellow hover:bg-studio-yellow/90 text-black text-[10px] font-black uppercase tracking-widest rounded-sm transition-all shadow-[0_0_15px_rgba(255,230,0,0.2)]"
            >
              Open New Ticket
            </button>
          )}
        </div>
      )}

      {/* Tickets Cards List */}
      {filteredTickets.length > 0 && (
        <div className="space-y-3">
          {filteredTickets.map((t) => {
            const isExpanded = expandedTicketId === t.id
            const isCopied = copiedCode === t.ticket_number

            return (
              <div
                key={t.id}
                className={`studio-panel transition-all rounded-sm overflow-hidden border ${
                  t.status === 'open'
                    ? 'border-studio-yellow/40 bg-zinc-950/90 shadow-[0_0_20px_rgba(255,230,0,0.05)]'
                    : t.status === 'in_progress'
                    ? 'border-studio-blue/40 bg-zinc-950/90 shadow-[0_0_20px_rgba(0,116,228,0.05)]'
                    : 'border-white/10 bg-zinc-950/50 hover:border-white/20'
                }`}
              >
                {/* Header bar / Main summary */}
                <div
                  onClick={() => toggleExpand(t.id)}
                  className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Ticket Code with 1-click copy */}
                      <button
                        type="button"
                        onClick={(e) => copyCode(t.ticket_number, e)}
                        className="group/btn inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/80 hover:bg-white/10 border border-white/15 rounded-sm text-[10px] font-mono font-black text-studio-yellow tracking-wider transition-colors"
                        title="Click to copy ticket code"
                      >
                        <span>#{t.ticket_number}</span>
                        {isCopied ? (
                          <Check size={11} className="text-studio-neon" />
                        ) : (
                          <Copy size={11} className="text-white/40 group-hover/btn:text-white" />
                        )}
                        {isCopied && <span className="text-[8px] text-studio-neon uppercase font-sans">Copied</span>}
                      </button>

                      {getStatusBadge(t.status)}
                      {getPriorityBadge(t.priority)}

                      <span className="text-[9px] font-black uppercase tracking-wider text-white/30 border-l border-white/10 pl-2">
                        {getCategoryLabel(t.category)}
                      </span>
                    </div>

                    <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-studio-yellow transition-colors">
                      {t.subject}
                    </h4>

                    <div className="flex items-center gap-3 text-[10px] text-white/40">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(t.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {t.admin_reply && (
                        <span className="text-studio-neon font-black inline-flex items-center gap-1">
                          <MessageSquare size={11} /> 1 Official Engineer Reply
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Arrow & View Thread */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                      {isExpanded ? 'Hide Details' : 'View Thread'}
                    </span>
                    <div className="w-7 h-7 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Thread Drawer */}
                {isExpanded && (
                  <div className="border-t border-white/10 p-5 md:p-6 bg-black/60 space-y-6 animate-fadeIn">
                    {/* Customer Message Box */}
                    <div className="space-y-2 p-4 bg-white/[0.02] border border-white/10 rounded-sm">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/40">
                        <span className="flex items-center gap-1.5">
                          <FileText size={12} />
                          <span>Submitted Details</span>
                        </span>
                        {t.name && <span>By: {t.name}</span>}
                      </div>

                      <p className="text-xs text-white/80 leading-relaxed uppercase whitespace-pre-wrap font-mono">
                        {t.message}
                      </p>

                      {/* DAW & Order ID metadata */}
                      {(t.order_id || t.daw || t.os_platform) && (
                        <div className="pt-3 border-t border-white/5 flex flex-wrap gap-4 text-[9px] font-mono text-white/40 uppercase">
                          {t.order_id && <span>Order Ref: {t.order_id}</span>}
                          {t.daw && <span>DAW: {t.daw}</span>}
                          {t.os_platform && <span>OS: {t.os_platform}</span>}
                        </div>
                      )}
                    </div>

                    {/* Official Audio Engineer Response Box */}
                    {t.admin_reply ? (
                      <div className="p-5 bg-studio-blue/10 border border-studio-blue/40 rounded-sm space-y-3 shadow-[0_0_20px_rgba(0,116,228,0.15)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-studio-blue">
                            <Headphones size={15} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              SamplesWala Audio Engineer Reply
                            </span>
                          </div>
                          {t.replied_at && (
                            <span className="text-[9px] text-white/30 font-mono">
                              {new Date(t.replied_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-white leading-relaxed uppercase whitespace-pre-wrap font-mono font-medium">
                          {t.admin_reply}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-sm flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2 text-white/50">
                          <Clock size={14} className="text-studio-yellow animate-spin" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Under Review by Sound Engineers • Expected reply &lt; 4 hours
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Follow-up Quick Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[10px]">
                      <span className="text-white/30 uppercase font-mono">
                        Need to add extra files or screenshots?
                      </span>
                      <a
                        href={`mailto:support@sampleswala.com?subject=Re: Ticket ${t.ticket_number} - ${t.subject}`}
                        className="px-4 py-2 bg-white/10 hover:bg-studio-yellow hover:text-black text-white font-black uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2"
                      >
                        <Mail size={12} />
                        <span>Email Direct Reply</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

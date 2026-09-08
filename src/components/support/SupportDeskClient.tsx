'use client'

import React, { useState } from 'react'
import {
  LifeBuoy,
  Send,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  Download,
  CreditCard,
  Music,
  HelpCircle,
} from 'lucide-react'
import { createSupportTicketAction, getTicketStatusAction } from '@/actions/supportActions'

const CATEGORIES = [
  { id: 'DOWNLOAD_ISSUE', label: 'Download & Vault Issue', icon: Download },
  { id: 'PAYMENT_ORDER', label: 'Payment & Order Verification', icon: CreditCard },
  { id: 'DAW_COMPATIBILITY', label: 'DAW & File Compatibility', icon: Music },
  { id: 'LICENSING', label: 'Royalty-Free & License Query', icon: Tag },
  { id: 'GENERAL', label: 'Sound Request / General', icon: HelpCircle },
]

const PRIORITIES = [
  { id: 'NORMAL', label: 'Normal', desc: 'General queries (24-48h)' },
  { id: 'HIGH', label: 'High Priority', desc: 'Download / payment issues (12h)' },
  { id: 'URGENT', label: 'Urgent', desc: 'Production deadline / live orders (2-4h)' },
]

export function SupportDeskClient() {
  const [activeTab, setActiveTab] = useState<'create' | 'track'>('create')

  // Create form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('DOWNLOAD_ISSUE')
  const [priority, setPriority] = useState('NORMAL')
  const [orderId, setOrderId] = useState('')
  const [daw, setDaw] = useState('')
  const [osPlatform, setOsPlatform] = useState('Windows')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdTicket, setCreatedTicket] = useState<{ ticketNumber: string; message: string } | null>(null)
  const [createError, setCreateError] = useState('')
  const [copied, setCopied] = useState(false)

  // Track form state
  const [lookupNumber, setLookupNumber] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [trackResult, setTrackResult] = useState<any | null>(null)
  const [trackError, setTrackError] = useState('')

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setCreateError('')

    try {
      const res = await createSupportTicketAction({
        name,
        email,
        category,
        priority,
        orderId: orderId.trim() || undefined,
        daw: daw.trim() || undefined,
        osPlatform,
        subject,
        description,
      })

      if (res.success && res.ticketNumber) {
        setCreatedTicket({
          ticketNumber: res.ticketNumber,
          message: res.message || 'Ticket submitted successfully!',
        })
      } else {
        setCreateError(res.error || 'Failed to submit ticket. Please check your inputs.')
      }
    } catch (err: any) {
      setCreateError(err?.message || 'Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTrackError('')
    setTrackResult(null)

    try {
      const res = await getTicketStatusAction(lookupNumber, lookupEmail)
      if (res.success && res.ticket) {
        setTrackResult(res.ticket)
      } else {
        setTrackError(res.error || 'No matching ticket found. Please verify your ticket number and email.')
      }
    } catch (err: any) {
      setTrackError(err?.message || 'Failed to lookup ticket.')
    } finally {
      setIsSearching(false)
    }
  }

  const copyTicketCode = () => {
    if (createdTicket?.ticketNumber) {
      navigator.clipboard.writeText(createdTicket.ticketNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      {/* Tab Switcher */}
      <div className="flex border-b border-white/10 gap-2">
        <button
          onClick={() => {
            setActiveTab('create')
            setCreateError('')
          }}
          className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'create'
              ? 'border-studio-blue text-white bg-white/[0.03]'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <LifeBuoy size={14} className={activeTab === 'create' ? 'text-studio-blue' : ''} />
          <span>New Ticket</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('track')
            setTrackError('')
          }}
          className={`px-6 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'track'
              ? 'border-studio-yellow text-white bg-white/[0.03]'
              : 'border-transparent text-white/40 hover:text-white'
          }`}
        >
          <Search size={14} className={activeTab === 'track' ? 'text-studio-yellow' : ''} />
          <span>Track Ticket Status</span>
        </button>
      </div>

      {/* TAB 1: CREATE TICKET */}
      {activeTab === 'create' && (
        <div>
          {createdTicket ? (
            <div className="studio-panel p-8 md:p-12 text-center space-y-8 border-2 border-studio-blue/40 relative overflow-hidden bg-zinc-950">
              <div className="w-16 h-16 bg-studio-neon text-black flex items-center justify-center mx-auto rounded-sm shadow-[0_0_25px_rgba(0,255,148,0.4)]">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-studio-neon">
                  Ticket Submitted Successfully
                </span>
                <h3 className="text-3xl font-black uppercase tracking-tight text-white">
                  We're on it, Producer!
                </h3>
                <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                  Your ticket has been prioritized and dispatched to our audio support team. Keep your ticket code handy to track updates.
                </p>
              </div>

              {/* Ticket Code Box */}
              <div className="max-w-md mx-auto p-5 bg-black border-2 border-white/10 rounded-sm flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Your Ticket Code</p>
                  <p className="text-xl font-black tracking-widest text-studio-yellow font-mono">
                    {createdTicket.ticketNumber}
                  </p>
                </div>
                <button
                  onClick={copyTicketCode}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  {copied ? <Check size={12} className="text-studio-neon" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    setLookupNumber(createdTicket.ticketNumber)
                    setLookupEmail(email)
                    setActiveTab('track')
                    setCreatedTicket(null)
                  }}
                  className="studio-button"
                >
                  Track Status Now
                </button>
                <button
                  onClick={() => {
                    setCreatedTicket(null)
                    setSubject('')
                    setDescription('')
                    setOrderId('')
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest rounded-sm border border-white/10 transition-colors"
                >
                  Submit Another Ticket
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateSubmit} className="studio-panel p-8 md:p-12 space-y-8 bg-zinc-950/80">
              {/* Category Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Select Issue Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3.5 text-left border rounded-sm transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-studio-blue bg-studio-blue/15 text-white shadow-[0_0_15px_rgba(0,116,228,0.2)]'
                            : 'border-white/10 bg-black/40 text-white/50 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <Icon size={16} className={isSelected ? 'text-studio-blue' : 'text-white/30'} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{cat.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Producer / Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aryan Beats"
                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="producer@example.com"
                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
                  />
                </div>
              </div>

              {/* Order ID & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Order ID / Payment Ref (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. rzp_live_... / order_..."
                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Your Primary DAW
                  </label>
                  <select
                    value={daw}
                    onChange={(e) => setDaw(e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white"
                  >
                    <option value="">Select DAW (Optional)</option>
                    <option value="FL Studio">FL Studio</option>
                    <option value="Ableton Live">Ableton Live</option>
                    <option value="Logic Pro">Logic Pro</option>
                    <option value="Cubase">Cubase</option>
                    <option value="Studio One">Studio One</option>
                    <option value="Pro Tools">Pro Tools</option>
                    <option value="Reaper">Reaper</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label} — {p.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Zip file corrupt or payment succeeded but pack not in library"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your issue with as much detail as possible (sample pack name, error message, payment timestamp, etc.)..."
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-medium uppercase tracking-wider text-white placeholder:text-white/20 resize-none"
                />
              </div>

              {createError && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p>{createError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="studio-button w-full py-5 disabled:opacity-50 text-xs tracking-widest group"
              >
                {isSubmitting ? (
                  'Dispatching Ticket...'
                ) : (
                  <>
                    <span>Submit Support Ticket</span>
                    <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: TRACK TICKET */}
      {activeTab === 'track' && (
        <div className="space-y-8">
          <form onSubmit={handleTrackSubmit} className="studio-panel p-8 md:p-12 space-y-6 bg-zinc-950/80">
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Search size={18} className="text-studio-yellow" />
                <span>Track Support Request</span>
              </h3>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Enter your unique ticket number (e.g. SW-TK-48192) and the email address used during submission.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Ticket Number *
                </label>
                <input
                  type="text"
                  required
                  value={lookupNumber}
                  onChange={(e) => setLookupNumber(e.target.value.toUpperCase())}
                  placeholder="SW-TK-XXXXX"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-xs font-mono font-black uppercase tracking-widest text-studio-yellow placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  placeholder="producer@example.com"
                  className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
                />
              </div>
            </div>

            {trackError && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-sm">
                <ShieldAlert size={18} className="flex-shrink-0" />
                <p>{trackError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="studio-button w-full py-4 disabled:opacity-50 text-xs tracking-widest"
            >
              {isSearching ? 'Searching Ticket Registry...' : 'Lookup Ticket Status'}
            </button>
          </form>

          {/* Ticket Status Result Card */}
          {trackResult && (
            <div className="studio-panel p-8 space-y-6 border-l-4 border-l-studio-yellow bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                    Ticket Summary
                  </span>
                  <h4 className="text-2xl font-black uppercase tracking-tight text-white font-mono">
                    #{trackResult.ticket_number}
                  </h4>
                  <p className="text-xs text-white/70 font-bold uppercase mt-1">{trackResult.subject}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-sm ${
                      trackResult.status === 'RESOLVED'
                        ? 'bg-studio-neon text-black'
                        : trackResult.status === 'IN_PROGRESS'
                        ? 'bg-studio-blue text-white'
                        : 'bg-studio-yellow text-black'
                    }`}
                  >
                    STATUS: {trackResult.status}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest rounded-sm">
                    {trackResult.priority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-black/50 border border-white/5 rounded-sm space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Category</span>
                  <p className="font-bold text-white uppercase">{trackResult.category}</p>
                </div>
                <div className="p-4 bg-black/50 border border-white/5 rounded-sm space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Created Date</span>
                  <p className="font-bold text-white uppercase">
                    {new Date(trackResult.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="p-4 bg-black/50 border border-white/5 rounded-sm space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Contact</span>
                  <p className="font-bold text-white/80 truncate">{trackResult.email}</p>
                </div>
              </div>

              <div className="space-y-2 p-5 bg-black/60 border border-white/5 rounded-sm">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                  Ticket Message
                </span>
                <p className="text-xs text-white/60 leading-relaxed uppercase whitespace-pre-wrap font-mono">
                  {trackResult.description}
                </p>
              </div>

              <div className="p-4 bg-studio-blue/10 border border-studio-blue/20 rounded-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-studio-blue">
                    Need immediate assistance?
                  </p>
                  <p className="text-[10px] text-white/50">
                    Reply directly to your ticket notification email or reach us on Instagram @sampleswala.
                  </p>
                </div>
                <a
                  href="mailto:support@sampleswala.com"
                  className="px-4 py-2 bg-studio-blue hover:bg-studio-blue/80 text-white rounded-sm text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-colors"
                >
                  Email Support
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Download,
  CreditCard,
  Music,
  Tag,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { createSupportTicketAction, SupportTicket } from '@/actions/supportActions'

const CATEGORIES = [
  { id: 'download', label: 'Download & Vault', icon: Download },
  { id: 'payment', label: 'Payment & Orders', icon: CreditCard },
  { id: 'daw', label: 'DAW Compatibility', icon: Music },
  { id: 'licensing', label: 'Royalty & License', icon: Tag },
  { id: 'general', label: 'General / Audio Query', icon: HelpCircle },
]

const PRIORITIES = [
  { id: 'NORMAL', label: 'Normal', desc: 'Standard turnaround (12-24h)' },
  { id: 'HIGH', label: 'High Priority', desc: 'Download / payment verification (4-8h)' },
  { id: 'URGENT', label: 'Urgent', desc: 'Active studio session / deadline (1-3h)' },
]

interface CreateTicketFormProps {
  initialUser?: { id: string; email: string; name?: string } | null
  onTicketCreated: (ticket: SupportTicket) => void
}

export function CreateTicketForm({ initialUser, onTicketCreated }: CreateTicketFormProps) {
  const [name, setName] = useState(initialUser?.name || '')
  const [email, setEmail] = useState(initialUser?.email || '')
  const [category, setCategory] = useState('download')
  const [priority, setPriority] = useState('NORMAL')
  const [orderId, setOrderId] = useState('')
  const [daw, setDaw] = useState('')
  const [osPlatform, setOsPlatform] = useState('Windows')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successNotice, setSuccessNotice] = useState<{ ticketNumber: string } | null>(null)

  useEffect(() => {
    if (initialUser) {
      if (initialUser.name && !name) setName(initialUser.name)
      if (initialUser.email && !email) setEmail(initialUser.email)
    }
  }, [initialUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessNotice(null)

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

      if (res.success && res.ticket) {
        // Persist ticket code to localStorage for guest tracking continuity
        try {
          const stored = JSON.parse(localStorage.getItem('sampleswala_user_tickets') || '[]')
          if (!stored.includes(res.ticket.ticket_number)) {
            stored.unshift(res.ticket.ticket_number)
            localStorage.setItem('sampleswala_user_tickets', JSON.stringify(stored.slice(0, 30)))
          }
        } catch {}

        setSuccessNotice({ ticketNumber: res.ticket.ticket_number })
        onTicketCreated(res.ticket)

        // Reset form fields
        setSubject('')
        setDescription('')
        setOrderId('')
      } else {
        setErrorMessage(res.error || 'Failed to submit ticket. Please check your inputs.')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Server error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
          <span>Open a Support Ticket</span>
        </h3>
        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mt-0.5">
          Directly dispatched to SamplesWala audio mastering engineers & support team
        </p>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-5 bg-studio-neon/10 border-2 border-studio-neon/40 rounded-sm flex items-start gap-4 animate-fadeIn">
          <div className="w-8 h-8 rounded-sm bg-studio-neon text-black flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-studio-neon">
              Ticket #{successNotice.ticketNumber} Dispatched!
            </p>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Your ticket is now live in your active tickets dashboard above. Our team will review your request shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice(null)}
            className="text-white/40 hover:text-white text-xs font-black"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="studio-panel p-6 md:p-8 space-y-6 bg-zinc-950/80 border border-white/10 rounded-sm">
        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Issue Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 text-left border rounded-sm transition-all flex flex-col gap-2 ${
                    isSelected
                      ? 'border-studio-blue bg-studio-blue/15 text-white shadow-[0_0_15px_rgba(0,116,228,0.25)]'
                      : 'border-white/10 bg-black/40 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon size={16} className={isSelected ? 'text-studio-blue' : 'text-white/30'} />
                  <span className="text-[9px] font-black uppercase tracking-wider line-clamp-1">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Producer Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aryan Beats"
              className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Registered Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="producer@example.com"
              className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Priority, DAW & Order ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white"
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} ({p.desc.split('(')[1]?.replace(')', '') || ''})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Primary DAW
            </label>
            <select
              value={daw}
              onChange={(e) => setDaw(e.target.value)}
              className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white"
            >
              <option value="">Select DAW (Optional)</option>
              <option value="FL Studio">FL Studio</option>
              <option value="Ableton Live">Ableton Live</option>
              <option value="Logic Pro">Logic Pro</option>
              <option value="Cubase">Cubase</option>
              <option value="Studio One">Studio One</option>
              <option value="Pro Tools">Pro Tools</option>
              <option value="Reaper">Reaper</option>
              <option value="Other">Other DAW</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Order ID (Optional)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. order_..."
              className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Subject Summary *
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Pack zip corrupt or payment debited but pack not in vault"
            className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-bold uppercase tracking-wider text-white placeholder:text-white/20"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
            Issue Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide specific details (sample pack title, DAW version, error message, exact order date)..."
            className="w-full bg-black border border-white/10 p-3.5 rounded-sm focus:outline-none focus:border-studio-blue text-xs font-medium uppercase tracking-wider text-white placeholder:text-white/20 resize-none font-mono"
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="studio-button w-full py-4 text-xs tracking-widest group flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            'Dispatching Ticket to Engineers...'
          ) : (
            <>
              <span>Submit Support Ticket</span>
              <Send size={14} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

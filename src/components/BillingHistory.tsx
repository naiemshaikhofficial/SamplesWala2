'use client'
import React from 'react'
import { Receipt, Download, Calendar, Hash, CreditCard } from 'lucide-react'

interface BillingItem {
  id: string
  created_at: string
  item_name: string
  amount: number
  razorpay_order_id: string
  razorpay_payment_id: string
}

export function BillingHistory({ items }: { items: BillingItem[] }) {
  if (items.length === 0) return null

  const handleDownloadInvoice = (item: BillingItem) => {
    // Basic printable invoice generation
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) return

    const date = new Date(item.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${item.razorpay_order_id}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; }
            .details { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #999; letter-spacing: 2px; margin-bottom: 8px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { text-align: left; border-bottom: 1px solid #eee; padding: 12px; font-size: 12px; text-transform: uppercase; color: #999; }
            .table td { padding: 12px; border-bottom: 1px solid #f9f9f9; font-size: 14px; }
            .total { margin-top: 40px; text-align: right; font-size: 20px; font-weight: 900; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo italic">SAMPLES WALA</div>
            <div style="text-align: right">
              <div class="section-title">Invoice Number</div>
              <div style="font-weight: bold">${item.razorpay_payment_id || 'INV-' + item.id.slice(0,8)}</div>
            </div>
          </div>

          <div class="details">
            <div>
              <div class="section-title">Billed To</div>
              <div style="font-weight: bold">Customer</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">Verified Digital Purchase</div>
            </div>
            <div style="text-align: right">
              <div class="section-title">Date of Issue</div>
              <div style="font-weight: bold">${date}</div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${item.item_name || 'Sample Pack Bundle'}</td>
                <td style="text-align: right">₹${item.amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <span style="font-size: 12px; font-weight: normal; color: #999; margin-right: 20px;">TOTAL PAID</span>
            ₹${item.amount}
          </div>

          <div style="margin-top: 80px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            This is a computer generated invoice. No signature required.
            <br/>Samples Wala - Premium Sound Artifacts
          </div>

          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #000; color: #fff; border: none; font-weight: bold; cursor: pointer;">Print / Download PDF</button>
          </div>
        </body>
      </html>
    `)
    invoiceWindow.document.close()
  }

  return (
    <div className="space-y-8 pt-16 border-t border-white/5">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-white/5 flex items-center justify-center rounded-sm">
          <Receipt size={20} className="text-white/40" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight italic">Billing History</h2>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Manage your transactions and receipts</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Date</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Item</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20">Order ID</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Amount</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-white/20" />
                    <span className="text-[11px] font-bold text-white/60">
                      {new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[11px] font-black uppercase tracking-tight text-white italic">{item.item_name || 'Digital Pack'}</span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-white/20 group-hover:text-white/40 transition-colors">
                    <Hash size={12} />
                    <span className="text-[9px] font-mono tracking-tighter uppercase">{item.razorpay_order_id || 'N/A'}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <span className="text-[11px] font-black text-studio-neon">₹{item.amount}</span>
                </td>
                <td className="p-6 text-right">
                   <button 
                     onClick={() => handleDownloadInvoice(item)}
                     className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                   >
                     <Download size={12} />
                     Invoice
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

'use client'
import React from 'react'
import { Receipt, Download, Calendar, Hash, CreditCard, ShieldCheck, FileCheck } from 'lucide-react'

interface BillingItem {
  id: string
  created_at: string
  item_name: string
  amount: number
  razorpay_order_id: string
  razorpay_payment_id: string
}

export function BillingHistory({ items, profile, email }: { 
  items: BillingItem[], 
  profile: {
    full_name: string | null,
    phone_number: string | null,
    address_line1: string | null,
    city: string | null,
    state: string | null,
    postal_code: string | null,
    gstin: string | null
  } | null,
  email?: string
}) {
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

    const total = Number(item.amount)

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${item.razorpay_order_id}</title>
          <style>
            body { font-family: 'Inter', -apple-system, sans-serif; padding: 60px; color: #1a1a1a; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 4px solid #000; padding-bottom: 30px; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: 900; letter-spacing: -1.5px; text-transform: uppercase; font-style: italic; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-bottom: 60px; }
            .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; color: #888; letter-spacing: 2px; margin-bottom: 12px; }
            .address-block { font-size: 13px; color: #444; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th { text-align: left; border-bottom: 2px solid #eee; padding: 16px 12px; font-size: 11px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
            .table td { padding: 20px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
            .totals-block { margin-top: 40px; margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
            .grand-total { border-top: 2px solid #000; margin-top: 15px; padding-top: 15px; font-size: 22px; font-weight: 900; }
            .footer { margin-top: 100px; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 30px; }
            .tax-info { font-size: 11px; color: #888; margin-top: 4px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SAMPLES WALA</div>
              <div class="address-block">
                <strong>Samples Wala Production</strong><br/>
                Andheri West, Mumbai<br/>
                Maharashtra, India - 400053
              </div>
            </div>
            <div style="text-align: right">
              <div class="section-title">Invoice</div>
              <div style="font-weight: 900; font-size: 20px;">#${item.razorpay_payment_id?.slice(-8).toUpperCase() || item.id.slice(0,8).toUpperCase()}</div>
              <div class="tax-info">Order ID: ${item.razorpay_order_id || 'N/A'}</div>
            </div>
          </div>

          <div class="details">
            <div>
              <div class="section-title">Billed To</div>
              <div class="address-block">
                <strong style="font-size: 16px; color: #000;">${profile?.full_name || 'Valued Customer'}</strong><br/>
                ${email ? `Email: ${email}<br/>` : ''}
                ${profile?.phone_number ? `Phone: ${profile.phone_number}<br/>` : ''}
                ${profile?.address_line1 || 'Digital Delivery'}<br/>
                ${profile?.city || ''}${profile?.state ? ', ' + profile.state : ''} ${profile?.postal_code || ''}
              </div>
            </div>
            <div style="text-align: right">
              <div class="section-title">Payment Info</div>
              <div class="address-block">
                Date: <strong>${date}</strong><br/>
                Status: <strong>Paid</strong><br/>
                Method: <strong>Razorpay Online</strong>
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center">Qty</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold">${item.item_name || 'Sample Pack Bundle'}</td>
                <td style="text-align: center">1</td>
                <td style="text-align: right; font-weight: bold">₹${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals-block">
            <div class="total-row grand-total">
              <span>TOTAL PAID</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            This is a computer generated invoice for digital services provided by Samples Wala.<br/>
            All digital sales are final. For support : support@sampleswala.com<br/>
            <div style="margin-top: 10px; font-weight: bold; color: #888;">Thank you for supporting Indian Sound Design.</div>
          </div>

          <div class="no-print" style="margin-top: 60px; text-align: center;">
            <button onclick="window.print()" style="padding: 16px 32px; background: #000; color: #fff; border: none; font-weight: 900; text-transform: uppercase; cursor: pointer; letter-spacing: 1px;">Print / Download as PDF</button>
          </div>
        </body>
      </html>
    `)
    invoiceWindow.document.close()
  }
  const handleDownloadLicense = (item: BillingItem) => {
    const licenseWindow = window.open('', '_blank')
    if (!licenseWindow) return

    const date = new Date(item.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    licenseWindow.document.write(`
      <html>
        <head>
          <title>License Certificate - ${item.item_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; line-height: 1.5; background: #fff; }
            .cert-border { border: 10px double #000; padding: 40px; position: relative; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; font-style: italic; }
            .title { font-size: 28px; font-weight: 900; text-transform: uppercase; margin: 10px 0; }
            .subtitle { font-size: 12px; font-weight: 700; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            
            .license-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; background: #f9f9f9; padding: 20px; border: 1px solid #eee; }
            .detail-item { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 700; }
            .detail-value { font-size: 14px; font-weight: 700; color: #000; margin-top: 4px; }

            .terms { font-size: 10px; height: 450px; overflow-y: visible; text-align: justify; columns: 2; column-gap: 40px; }
            .terms h4 { font-size: 11px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #ddd; display: inline-block; }
            .terms p { margin-bottom: 10px; color: #444; }
            
            .footer { margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #eee; pt: 20px; }
            .signature { border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 10px; font-size: 12px; font-weight: 700; }
            .stamp { width: 80px; height: 80px; border: 4px double #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; text-align: center; transform: rotate(-15deg); color: #000; opacity: 0.8; }
            
            @media print { .no-print { display: none; } .cert-border { height: 90vh; } }
          </style>
        </head>
        <body>
          <div class="cert-border">
            <div class="header">
              <div class="logo">SAMPLES WALA</div>
              <div class="title">License Certificate</div>
              <div class="subtitle">End User License Agreement (EULA)</div>
            </div>

            <div class="license-details">
              <div>
                <div class="detail-item">Product Licensed</div>
                <div class="detail-value">${item.item_name || 'Digital Sample Pack'}</div>
              </div>
              <div>
                <div class="detail-item">Licensee Name</div>
                <div class="detail-value">${profile?.full_name || 'Verified User'}</div>
              </div>
              <div>
                <div class="detail-item">Registered Email</div>
                <div class="detail-value">${email || 'N/A'}</div>
              </div>
              <div>
                <div class="detail-item">Order ID / Reference</div>
                <div class="detail-value">${item.razorpay_order_id || item.id.slice(0,12).toUpperCase()}</div>
              </div>
              <div>
                <div class="detail-item">Issue Date</div>
                <div class="detail-value">${date}</div>
              </div>
              <div>
                <div class="detail-item">License Type</div>
                <div class="detail-value">Royalty-Free / Single User</div>
              </div>
            </div>

            <div class="terms">
              <h4>1. LICENSE GRANT</h4>
              <p>SamplesWala grants you a limited, non-exclusive, non-transferable, single-user license to use this Product solely for creating original music compositions for commercial and non-commercial use.</p>

              <h4>2. OWNERSHIP</h4>
              <p>All sounds, samples, and materials remain the exclusive intellectual property of SamplesWala. This Agreement does not transfer ownership, only usage rights.</p>

              <h4>3. PERMITTED USE</h4>
              <p>You are allowed to use, modify, and include the sounds in your music and release/monetize songs globally on Spotify, YouTube, etc. No royalties or credit required.</p>

              <h4>4. STRICT PROHIBITIONS</h4>
              <p>Reselling, sharing, or leaking the Product is strictly prohibited. You cannot create competing products or claim ownership of original sounds.</p>

              <h4>5. WATERMARKING</h4>
              <p>Each copy may include inaudible digital watermarking linked to the purchaser. Leaked content can be traced back to the original buyer.</p>

              <h4>6. ANTI-LEAK POLICY</h4>
              <p>If your licensed copy is found leaked, your license will be immediately terminated, and you may face financial penalties.</p>

              <h4>7. LEGAL ACTION</h4>
              <p>Violation results in immediate DMCA takedown notices and permanent banning. We reserve the right to pursue enforcement globally.</p>

              <h4>8. USAGE LIMITATION</h4>
              <p>You may distribute music created with this Product, but not the sounds in a way that allows extraction or repackaging by others.</p>

              <h4>9. DISCLAIMER</h4>
              <p>Provided "as is". SamplesWala is not liable for any data loss, software conflicts, or damages resulting from use.</p>

              <h4>10. TERMINATION</h4>
              <p>License is revoked if terms are violated. Upon termination, all copies must be deleted immediately.</p>

              <h4>11. GOVERNING LAW</h4>
              <p>Governed under applicable intellectual property laws. Legal disputes will be handled in appropriate courts.</p>

              <h4>12. ENTIRE AGREEMENT</h4>
              <p>This represents the complete agreement and overrides any prior communication.</p>
            </div>

            <div class="footer">
              <div>
                <div class="stamp">OFFICIAL<br/>LICENSE<br/>VERIFIED</div>
              </div>
              <div class="signature">
                Samples Wala Authorized Representative
                <div style="font-size: 8px; font-weight: 400; margin-top: 5px;">Digital Document - No Signature Required</div>
              </div>
            </div>
          </div>

          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 16px 32px; background: #000; color: #fff; border: none; font-weight: 900; text-transform: uppercase; cursor: pointer; letter-spacing: 1px;">Print License Certificate</button>
          </div>
        </body>
      </html>
    `)
    licenseWindow.document.close()
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
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
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
                   <div className="flex items-center justify-end gap-2">
                     <button 
                       onClick={() => handleDownloadInvoice(item)}
                       className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                     >
                       <Receipt size={12} />
                       Invoice
                     </button>
                     <button 
                       onClick={() => handleDownloadLicense(item)}
                       className="inline-flex items-center gap-2 px-4 py-2 bg-studio-neon/10 border border-studio-neon/20 text-[9px] font-black uppercase tracking-widest text-studio-neon hover:bg-studio-neon hover:text-black transition-all"
                     >
                       <FileCheck size={12} />
                       License
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

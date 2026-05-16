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
    const invoiceWindow = window.open('', '_blank')
    if (!invoiceWindow) return

    const LOGO_URL = 'https://imagizer.imageshack.com/img924/3747/53oszD.png'
    const date = new Date(item.created_at).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const total = Number(item.amount)

    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Bill of Supply - ${item.razorpay_order_id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Luckiest+Guy&family=Kalam:wght@700&display=swap');
            @keyframes glow {
              0% { text-shadow: 0 0 5px #00FF94; }
              50% { text-shadow: 0 0 15px #00FF94; }
              100% { text-shadow: 0 0 5px #00FF94; }
            }
            body { font-family: 'Arial Black', 'Inter', sans-serif; padding: 40px; color: #000; line-height: 1.4; background: #fff; }
            .comic-accent { height: 10px; background: linear-gradient(90deg, #ff0080, #00FF94, #FFC800); margin-bottom: 30px; border: 2px solid #000; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
            .logo-container { background: #000; padding: 15px; border: 4px solid #000; box-shadow: 10px 10px 0px #ff0080; }
            .logo-img { width: 160px; display: block; }
            .official-title { text-align: right; }
            .title-text { font-size: 32px; font-weight: 900; text-transform: uppercase; margin: 0; font-style: italic; letter-spacing: -1px; animation: glow 2s infinite; }
            .subtitle-text { font-size: 10px; font-weight: 900; color: #888; text-transform: uppercase; letter-spacing: 2px; }
            
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px; }
            .label { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #555; border-bottom: 2px solid #000; display: inline-block; margin-bottom: 8px; }
            .value { font-size: 14px; font-weight: 900; text-transform: uppercase; }
            
            .table { width: 100%; border-collapse: collapse; border: 4px solid #000; box-shadow: 12px 12px 0px #000; }
            .table th { background: #00FF94; padding: 12px; text-align: left; font-size: 11px; font-weight: 900; text-transform: uppercase; border: 2px solid #000; }
            .table td { padding: 15px; font-size: 13px; font-weight: 900; border: 2px solid #000; background: #fff; }
            
            .totals { margin-top: 50px; margin-left: auto; width: 280px; background: #FFC800; border: 4px solid #000; padding: 20px; box-shadow: 10px 10px 0px #ff0080; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; font-weight: 900; text-transform: uppercase; }
            .grand-total { font-size: 20px; border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; }
            
            .declarations { margin-top: 60px; font-size: 10px; font-weight: 900; color: #444; border-left: 5px solid #00EAFF; padding-left: 20px; }
            .footer { margin-top: 80px; text-align: center; border-top: 4px solid #000; padding-top: 30px; }
            .made-in { font-size: 32px; letter-spacing: -1px; text-shadow: 3px 3px 0px #000; margin-bottom: 5px; }
            .font-kalam { font-family: 'Kalam', cursive; font-weight: 700; }
            .help-box { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px; background: #f0f0f0; padding: 10px 20px; border: 2px solid #000; font-size: 11px; font-weight: 900; text-transform: uppercase; }
            
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="comic-accent"></div>
          <div class="header">
            <div class="logo-container">
              <img src="${LOGO_URL}" class="logo-img" alt="Samples Wala">
            </div>
            <div class="official-title">
              <h1 class="title-text">BILL OF SUPPLY</h1>
              <p class="subtitle-text">(Digital Services - GST Exempt)</p>
              <div style="margin-top: 10px;">
                <div class="label">Invoice Ref</div><br>
                <div class="value">#${item.razorpay_payment_id?.slice(-10).toUpperCase() || item.id.slice(0, 10).toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div class="details-grid">
            <div>
              <div class="label">Supplier</div><br>
              <div class="value">SAMPLES WALA PRODUCTION</div>
              <div style="font-size: 10px; font-weight: 900; margin-top: 5px; color: #666; line-height: 1.5;">
                Husen Nagar, Kolhewadi Road,<br>
                Near Tajgarden, Sangamner,<br>
                Maharashtra, India - 422605<br>
                GSTIN: EXEMPT / PAN: [PENDING]
              </div>
            </div>
            <div style="text-align: right;">
              <div class="label">Recipient</div><br>
              <div class="value">${profile?.full_name?.toUpperCase() || 'VALUED CUSTOMER'}</div>
              <div style="font-size: 10px; font-weight: 900; margin-top: 5px; color: #666; line-height: 1.5;">
                Email: ${email?.toUpperCase() || 'N/A'}<br>
                ${profile?.address_line1?.toUpperCase() || 'DIGITAL DELIVERY'}<br>
                ${profile?.city?.toUpperCase() || ''} ${profile?.state?.toUpperCase() || ''} ${profile?.postal_code || ''}<br>
                <span style="color: #ff0080;">Place of Supply: ${profile?.state?.toUpperCase() || 'INDIA'}</span>
              </div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 140px;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${item.item_name?.toUpperCase() || 'STUDIO ASSET'}</td>
                <td style="text-align: center;">1</td>
                <td style="text-align: right;">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax (0% GST)</span>
              <span>0.00</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Paid</span>
              <span>₹${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="declarations">
            <strong>NOTES:</strong><br>
            1. Digital goods are delivered instantly to the user vault.<br>
            2. This is a computer generated bill, no signature is required.<br>
            3. Tax exempt under supplier threshold limits.
          </div>

          <div class="footer">
            <div class="made-in">MADE IN <span class="font-kalam" style="color: #FF9933;">भा</span><span class="font-kalam" style="color: #FFFFFF;">र</span><span class="font-kalam" style="color: #128807;">त</span></div>
            <div class="help-box">
              <img src="https://img.icons8.com/ios-filled/50/000000/mail.png" width="14" style="vertical-align: middle;">
              NEED HELP? SUPPORT@SAMPLESWALA.COM
            </div>
          </div>

          <div class="no-print" style="margin-top: 60px; text-align: center;">
            <button onclick="window.print()" style="padding: 15px 30px; background: #000; color: #fff; border: 4px solid #ff0080; font-weight: 900; text-transform: uppercase; cursor: pointer; letter-spacing: 2px; box-shadow: 6px 6px 0px #000;">Print / Download</button>
          </div>
        </body>
      </html>
    `)
    invoiceWindow.document.close()
  }

  const handleDownloadLicense = (item: BillingItem) => {
    const licenseWindow = window.open('', '_blank')
    if (!licenseWindow) return

    const LOGO_URL = 'https://imagizer.imageshack.com/img924/3747/53oszD.png'
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
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Luckiest+Guy&family=Kalam:wght@700&display=swap');
            @keyframes glow {
              0% { text-shadow: 0 0 5px #00FF94; }
              50% { text-shadow: 0 0 15px #00FF94; }
              100% { text-shadow: 0 0 5px #00FF94; }
            }
            body { font-family: 'Arial Black', 'Inter', sans-serif; padding: 40px; color: #000; line-height: 1.4; background: #fff; }
            .comic-accent { height: 10px; background: linear-gradient(90deg, #ff0080, #00FF94, #FFC800); margin-bottom: 30px; border: 2px solid #000; }
            .cert-container { border: 8px solid #000; padding: 40px; position: relative; box-shadow: 20px 20px 0px #00FF94; }
            .header { text-align: center; border-bottom: 4px solid #000; padding-bottom: 30px; margin-bottom: 40px; }
            .logo-box { display: inline-block; background: #000; padding: 15px; border: 4px solid #000; margin-bottom: 20px; box-shadow: 8px 8px 0px #ff0080; }
            .logo-img { width: 140px; display: block; }
            .cert-title { font-size: 38px; font-weight: 900; text-transform: uppercase; margin: 0; font-style: italic; letter-spacing: -2px; animation: glow 2s infinite; }
            .cert-subtitle { font-size: 11px; font-weight: 900; color: #ff0080; text-transform: uppercase; letter-spacing: 4px; margin-top: 5px; }
            
            .license-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #000; color: #fff; padding: 25px; border: 4px solid #000; }
            .grid-item { border-bottom: 1px solid #333; padding-bottom: 10px; }
            .grid-label { font-size: 8px; font-weight: 900; color: #00FF94; text-transform: uppercase; margin-bottom: 5px; }
            .grid-value { font-size: 12px; font-weight: 900; text-transform: uppercase; }

            .terms-section { font-size: 10px; font-weight: 900; text-align: justify; columns: 2; column-gap: 50px; color: #222; }
            .terms-section h4 { font-size: 11px; font-weight: 900; text-transform: uppercase; margin: 0 0 10px 0; background: #FFC800; padding: 2px 8px; display: inline-block; border: 2px solid #000; }
            .terms-section p { margin-bottom: 15px; line-height: 1.5; }
            
            .footer-grid { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
            .stamp-box { width: 100px; height: 100px; background: #000; color: #00FF94; border: 4px solid #000; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; text-align: center; transform: rotate(-5deg); box-shadow: 6px 6px 0px #ff0080; }
            .sig-area { text-align: right; }
            .sig-line { border-top: 4px solid #000; width: 220px; margin-left: auto; padding-top: 10px; font-size: 11px; font-weight: 900; text-transform: uppercase; }
            .help-box { margin-top: 20px; display: inline-flex; align-items: center; gap: 8px; background: #f0f0f0; padding: 10px 20px; border: 2px solid #000; font-size: 10px; font-weight: 900; text-transform: uppercase; }

            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="comic-accent"></div>
          <div class="cert-container">
            <div class="header">
              <div class="logo-box">
                <img src="${LOGO_URL}" class="logo-img" alt="Samples Wala">
              </div>
              <h1 class="cert-title">LICENSE CERTIFICATE</h1>
              <div class="cert-subtitle">Official EULA - Royalty Free</div>
            </div>

            <div class="license-grid">
              <div class="grid-item">
                <div class="grid-label">Product</div>
                <div class="grid-value">${item.item_name?.toUpperCase() || 'STUDIO ASSET'}</div>
              </div>
              <div class="grid-item">
                <div class="grid-label">Licensee</div>
                <div class="grid-value">${profile?.full_name?.toUpperCase() || 'VERIFIED USER'}</div>
              </div>
              <div class="grid-item">
                <div class="grid-label">Issue Date</div>
                <div class="grid-value">${date}</div>
              </div>
              <div class="grid-item">
                <div class="grid-label">Order Ref</div>
                <div class="grid-value">#${item.razorpay_order_id || item.id.slice(0, 12).toUpperCase()}</div>
              </div>
              <div class="grid-item">
                <div class="grid-label">Type</div>
                <div class="grid-value">SINGLE USER</div>
              </div>
              <div class="grid-item">
                <div class="grid-label">Status</div>
                <div class="grid-value" style="color: #00FF94;">VERIFIED</div>
              </div>
            </div>

            <div class="terms-section">
              <h4>1. LICENSE GRANT</h4>
              <p>SamplesWala grants you a limited, non-exclusive license to use this Product solely for creating original music compositions.</p>

              <h4>2. OWNERSHIP</h4>
              <p>All materials remain the intellectual property of SamplesWala. This transfers usage rights, not ownership.</p>

              <h4>3. PERMITTED USE</h4>
              <p>You may use and monetize sounds in your music releases globally (Spotify, YT, etc) without royalties.</p>

              <h4>4. PROHIBITIONS</h4>
              <p>Reselling, sharing, or leaking the Product is strictly prohibited. You cannot create competing products.</p>

              <h4>5. WATERMARKING</h4>
              <p>Copies include digital watermarking linked to the purchaser for anti-leak tracking.</p>

              <h4>6. LEGAL ACTION</h4>
              <p>Violation results in immediate DMCA takedowns and permanent banning from the platform.</p>
            </div>

            <div class="footer-grid">
              <div class="stamp-box">
                OFFICIAL<br>VERIFIED<br>LICENSE
              </div>
              <div class="sig-area">
                <div class="sig-line">SAMPLES WALA AUTH</div>
                <div class="help-box">
                  <img src="https://img.icons8.com/ios-filled/50/000000/mail.png" width="12" style="vertical-align: middle;">
                  SUPPORT@SAMPLESWALA.COM
                </div>
              </div>
            </div>
          </div>

          <div class="no-print" style="margin-top: 60px; text-align: center;">
            <button onclick="window.print()" style="padding: 15px 30px; background: #000; color: #fff; border: 4px solid #00FF94; font-weight: 900; text-transform: uppercase; cursor: pointer; letter-spacing: 2px; box-shadow: 6px 6px 0px #000;">Print Certificate</button>
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

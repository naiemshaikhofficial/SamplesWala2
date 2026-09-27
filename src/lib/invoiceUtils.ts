export interface InvoiceProductItem {
  id: string
  name: string
  brand?: string
  brands?: { name: string }
  product_type?: string
  price_usd?: number
  price_inr?: number
  cover_image?: string
  vst_format?: string
}

export interface PrintableInvoiceData {
  id: string
  purchased_at: string
  amount_paid?: number
  price_usd?: number
  price_inr?: number
  currency?: string
  serial_key?: string | null
  order_id?: string
  payment_id?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  customer_name?: string | null
  customer_email?: string | null
  customer_phone?: string | null
  billing_address?: string | null
  billing_city?: string | null
  billing_state?: string | null
  billing_zip?: string | null
  billing_country?: string | null
  discount_amount?: number
  coupon_code?: string | null
  products: InvoiceProductItem
}

/**
 * Generates and opens official printable Tax Invoice PDF / Window for Samples Wala
 */
export function openPrintableInvoice(
  item: PrintableInvoiceData,
  userEmail?: string,
  userName?: string
) {
  if (typeof window === 'undefined') return
  const invoiceWindow = window.open('', '_blank')
  if (!invoiceWindow) return

  const product = item.products
  const dateStr = new Date(item.purchased_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = new Date(item.purchased_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const rawCurrency = (item.currency || 'INR').toUpperCase()
  const isINR = rawCurrency === 'INR' || rawCurrency === '₹'
  const currency = isINR ? '₹' : '$'
  const currencyCode = isINR ? 'INR' : 'USD'
  const price = Number(item.amount_paid ?? product.price_inr ?? product.price_usd ?? 0)
  const discount = Number(item.discount_amount || 0)
  const subtotal = price + discount

  const invoiceRef = (item.razorpay_payment_id || item.payment_id || item.id)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(-10)
    .toUpperCase()
  const orderRef =
    item.razorpay_order_id || item.order_id || `SW-ORD-${item.id.slice(0, 10).toUpperCase()}`
  const paymentTxnId = item.razorpay_payment_id || item.payment_id || item.id
  const brandName = 'Samples Wala'
  const customerFullName = item.customer_name || userName || 'Producer'
  const customerEmailAddress = item.customer_email || userEmail || 'Customer'

  const hasBillingAddress = Boolean(
    item.billing_address || item.billing_city || item.billing_country
  )
  const formattedAddress = hasBillingAddress
    ? [
        item.billing_address,
        item.billing_city,
        item.billing_state,
        item.billing_zip,
        item.billing_country,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Digital Fulfillment (Global License Vault)'

  const formatType = (type?: string) => {
    if (!type) return 'Audio Sample Pack'
    if (type === 'sample_pack' || type === 'pack') return 'Studio Sample Pack (WAV 24-Bit / 44.1kHz)'
    if (type === 'sound' || type === 'one_shot') return 'Drum & Sound Kit (WAV / One-Shots)'
    if (type === 'preset') return 'Synthesizer Preset Bank'
    if (type === 'bundle') return 'Complete Producer Sound & Tool Bundle'
    return type.replace(/_/g, ' ').toUpperCase()
  }

  const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Official Bill of Supply & Tax Invoice #${invoiceRef} | Samples Wala</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      background-color: #0b0b0e;
      color: #1a1a24;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
    }

    .invoice-card {
      background: #ffffff;
      width: 100%;
      max-width: 820px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
      position: relative;
    }

    .top-accent-bar {
      height: 6px;
      background: linear-gradient(90deg, #0074e4 0%, #00FF94 50%, #FFE600 100%);
    }

    .invoice-padding {
      padding: 40px 48px;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #eef0f4;
      padding-bottom: 28px;
      margin-bottom: 30px;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0d0e15;
    }

    .brand-title span {
      color: #0074e4;
    }

    .brand-meta {
      font-size: 11px;
      color: #6c7280;
      margin-top: 4px;
      line-height: 1.4;
    }

    .invoice-title-block {
      text-align: right;
    }

    .invoice-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 10px;
      border-radius: 4px;
      background: #e8f3fc;
      color: #0074e4;
      margin-bottom: 8px;
    }

    .invoice-number {
      font-family: 'JetBrains Mono', monospace;
      font-size: 17px;
      font-weight: 700;
      color: #0d0e15;
    }

    .invoice-date {
      font-size: 12px;
      color: #6c7280;
      margin-top: 4px;
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 34px;
      background: #f8fafc;
      border: 1px solid #eef0f6;
      border-radius: 8px;
      padding: 20px 24px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8f95a3;
      margin-bottom: 8px;
    }

    .client-name {
      font-size: 15px;
      font-weight: 700;
      color: #0d0e15;
      margin-bottom: 3px;
    }

    .client-email {
      font-size: 13px;
      color: #4b5262;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 4px;
    }

    .client-address {
      font-size: 12px;
      color: #6c7280;
      line-height: 1.4;
    }

    .meta-item {
      margin-bottom: 8px;
    }

    .meta-item:last-child {
      margin-bottom: 0;
    }

    .meta-key {
      font-size: 11px;
      color: #6c7280;
    }

    .meta-val {
      font-size: 12.5px;
      font-weight: 600;
      color: #0d0e15;
      font-family: 'JetBrains Mono', monospace;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }

    th {
      background: #f1f5f9;
      color: #475569;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    th:last-child, td:last-child {
      text-align: right;
    }

    td {
      padding: 18px 16px;
      border-bottom: 1px solid #eef0f6;
      font-size: 13.5px;
      vertical-align: top;
    }

    .item-title {
      font-weight: 700;
      color: #0d0e15;
      font-size: 14.5px;
      margin-bottom: 4px;
    }

    .item-desc {
      font-size: 11.5px;
      color: #6c7280;
      line-height: 1.4;
    }

    .badge-clearance {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #e6f9f0;
      color: #00874a;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      margin-top: 6px;
    }

    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 34px;
    }

    .totals-box {
      width: 280px;
      background: #f8fafc;
      border: 1px solid #eef0f6;
      border-radius: 8px;
      padding: 16px 20px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: #64748b;
      margin-bottom: 8px;
    }

    .totals-row.grand-total {
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      margin-top: 8px;
      margin-bottom: 0;
      font-size: 16px;
      font-weight: 800;
      color: #0d0e15;
    }

    .grand-total .total-amount {
      color: #0074e4;
      font-family: 'JetBrains Mono', monospace;
    }

    .license-guarantee {
      background: #f0f7ff;
      border: 1px solid #d0e7fe;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .guarantee-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0074e4;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .guarantee-text h4 {
      font-size: 12.5px;
      font-weight: 700;
      color: #0a4f94;
      margin-bottom: 2px;
    }

    .guarantee-text p {
      font-size: 11px;
      color: #3b82f6;
      line-height: 1.45;
    }

    .footer-bar {
      border-top: 1px solid #eef0f6;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #94a3b8;
    }

    .footer-bar a {
      color: #0074e4;
      text-decoration: none;
    }

    .no-print-actions {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      gap: 10px;
      z-index: 1000;
    }

    .print-btn {
      background: #0074e4;
      color: white;
      border: none;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      padding: 12px 22px;
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 116, 228, 0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .print-btn:hover {
      background: #0060be;
      transform: translateY(-2px);
    }

    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .invoice-card {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
      }
      .no-print-actions {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="invoice-card">
    <div class="top-accent-bar"></div>
    <div class="invoice-padding">
      
      <!-- Header Row -->
      <div class="header-row">
        <div class="logo-container">
          <img src="https://imagizer.imageshack.com/img924/3747/53oszD.png" alt="Samples Wala" style="height: 38px; width: auto; object-fit: contain;">
          <div>
            <div class="brand-title">Samples <span>Wala</span></div>
            <div class="brand-meta">
              Official Tax Invoice & Bill of Supply<br>
              Direct Studio Digital Audio Delivery
            </div>
          </div>
        </div>

        <div class="invoice-title-block">
          <div class="invoice-badge">Tax Invoice Verified</div>
          <div class="invoice-number">#${invoiceRef}</div>
          <div class="invoice-date">${dateStr} &bull; ${timeStr}</div>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="details-grid">
        <div>
          <div class="section-label">Billed To (Customer)</div>
          <div class="client-name">${customerFullName}</div>
          <div class="client-email">${customerEmailAddress}</div>
          <div class="client-address">${formattedAddress}</div>
        </div>

        <div>
          <div class="section-label">Order & Transaction Metadata</div>
          <div class="meta-item">
            <span class="meta-key">Order Reference: </span>
            <span class="meta-val">${orderRef}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key">Payment Gateway: </span>
            <span class="meta-val">${paymentTxnId.startsWith('pay_') ? 'Razorpay Gateway' : 'Verified Secure Gateway'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key">Payment ID: </span>
            <span class="meta-val">${paymentTxnId}</span>
          </div>
          <div class="meta-item">
            <span class="meta-key">License Status: </span>
            <span class="meta-val" style="color: #00874a;">Perpetual Commercial Master Clear</span>
          </div>
        </div>
      </div>

      <!-- Line Items Table -->
      <table>
        <thead>
          <tr>
            <th>Product Description</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Amount (${currencyCode})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-title">${product.name}</div>
              <div class="item-desc">
                High-fidelity 24-bit lossless WAV audio sound collection, master stems, and loops.
              </div>
              <div class="badge-clearance">
                ✓ 100% Royalty-Free Lifetime Commercial Clearance
              </div>
            </td>
            <td style="font-size: 12px; color: #475569; font-weight: 600;">
              ${formatType(product.product_type)}
            </td>
            <td style="font-size: 13px; color: #475569; font-weight: 600;">1</td>
            <td style="font-weight: 700; font-family: 'JetBrains Mono', monospace; font-size: 14px;">
              ${currency}${price.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Totals Area -->
      <div class="totals-area">
        <div class="totals-box">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span style="font-family: 'JetBrains Mono', monospace;">${currency}${subtotal.toFixed(2)}</span>
          </div>
          ${
            discount > 0
              ? `<div class="totals-row" style="color: #00874a;">
                  <span>Discount Applied:</span>
                  <span style="font-family: 'JetBrains Mono', monospace;">-${currency}${discount.toFixed(2)}</span>
                </div>`
              : ''
          }
          <div class="totals-row">
            <span>Digital Goods Tax (GST / VAT):</span>
            <span style="font-family: 'JetBrains Mono', monospace;">${currency}0.00</span>
          </div>
          <div class="totals-row grand-total">
            <span>Total Paid:</span>
            <span class="total-amount">${currency}${price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Legal Guarantee -->
      <div class="license-guarantee">
        <div class="guarantee-icon">✓</div>
        <div class="guarantee-text">
          <h4>Commercial Licensing & Master Clearance Certificate</h4>
          <p>
            The licensee (${customerFullName}, ${customerEmailAddress}) holds full worldwide commercial synchronization, streaming, broadcast, and performance rights for all included sounds. You retain 100% of your royalties on Spotify, Apple Music, YouTube, and commercial beat sales.
          </p>
        </div>
      </div>

      <!-- Footer Bar -->
      <div class="footer-bar">
        <div>
          Samples Wala Help Desk: <a href="https://sampleswala.com/support" target="_blank">sampleswala.com/support</a>
        </div>
        <div>
          Official Document &bull; Generated digitally &bull; Valid without signature
        </div>
      </div>

    </div>
  </div>

  <div class="no-print-actions">
    <button class="print-btn" onclick="window.print()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Print Official Tax Invoice
    </button>
  </div>

</body>
</html>`

  invoiceWindow.document.open()
  invoiceWindow.document.write(invoiceHtml)
  invoiceWindow.document.close()
}

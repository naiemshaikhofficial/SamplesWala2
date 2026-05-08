import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInvoiceEmail({
  email,
  pdfBuffer,
  orderId,
  packNames
}: {
  email: string,
  pdfBuffer: Buffer,
  orderId: string,
  packNames: string[]
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Samples Wala <noreply@sampleswala.com>',
      to: email,
      subject: `Your Invoice - Order #${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 8px;">
          <h1 style="color: #FFC800; text-transform: uppercase; font-weight: 900; letter-spacing: -1px;">Thank You!</h1>
          <p style="font-size: 16px; color: #ccc;">Your purchase of <strong>${packNames.join(', ')}</strong> was successful.</p>
          <p style="font-size: 14px; color: #888;">We have attached your official invoice to this email.</p>
          <div style="margin-top: 30px; padding: 20px; border: 1px border-style: dashed; border-color: #333;">
            <p style="margin: 0; font-size: 12px; color: #555; text-transform: uppercase; font-weight: bold;">Next Steps</p>
            <p style="margin-top: 10px; font-size: 14px;">You can now access your packs in the <a href="https://sampleswala.com/library" style="color: #FFC800; text-decoration: none;">Library</a> section.</p>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #444; text-align: center;">&copy; 2026 Samples Wala. All Rights Reserved.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice-${orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (error) {
      console.error('[RESEND_ERROR]', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    console.error('[SEND_EMAIL_ERROR]', err)
    return { success: false, error: err }
  }
}

import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Samples Wala Contact Form <contact@sampleswala.com>',
      to: 'contact@sampleswala.com',
      replyTo: email,
      subject: `New Message from ${name} via Contact Form`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #333; border-bottom: 2px solid #00BFFF; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
          <div style="margin: 20px 0;">
            <p style="font-size: 14px; margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="font-size: 14px; margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00BFFF; text-decoration: none;">${email}</a></p>
            <p style="font-size: 14px; margin: 20px 0 10px 0;"><strong>Message:</strong></p>
            <div style="font-size: 13px; line-height: 1.6; white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #00BFFF; border-radius: 4px; color: #555;">${message}</div>
          </div>
          <div style="font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
            This email was generated from the contact form on SamplesWala.
          </div>
        </div>
      `
    })

    if (error) {
      console.error('[CONTACT_API_RESEND_ERROR]', error)
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[CONTACT_API_ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

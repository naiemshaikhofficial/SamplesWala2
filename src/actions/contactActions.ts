'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function submitContactAction(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const { name, email, message } = data

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { success: false, error: 'All fields are required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Samples Wala Contact Form <contact@sampleswala.com>',
      to: 'contact@sampleswala.com',
      replyTo: email.trim(),
      subject: `New Message from ${name.trim()} via Contact Form`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #ffffff;">
          <h2 style="color: #333; border-bottom: 2px solid #0074e4; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
          <div style="margin: 20px 0;">
            <p style="font-size: 14px; margin: 10px 0;"><strong>Name:</strong> ${name.trim()}</p>
            <p style="font-size: 14px; margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email.trim()}" style="color: #0074e4; text-decoration: none;">${email.trim()}</a></p>
            <p style="font-size: 14px; margin: 20px 0 10px 0;"><strong>Message:</strong></p>
            <div style="font-size: 13px; line-height: 1.6; white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0074e4; border-radius: 4px; color: #555;">${message.trim()}</div>
          </div>
          <div style="font-size: 11px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px;">
            Generated from SamplesWala Contact Form.
          </div>
        </div>
      `
    })

    if (error) {
      console.error('[CONTACT_ACTION_RESEND_ERROR]', error)
      return { success: false, error: 'Failed to send message via email service. Please try again.' }
    }

    return { success: true }
  } catch (err: any) {
    console.error('[CONTACT_ACTION_ERROR]', err)
    return { success: false, error: err.message || 'An unexpected error occurred.' }
  }
}

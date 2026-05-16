import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const LOGO_URL = 'https://imagizer.imageshack.com/img924/3747/53oszD.png'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sampleswala.com'

export async function sendInvoiceEmail({
  email,
  pdfBuffer,
  orderId,
  packNames,
  userName,
  total,
  items,
  isPreorder = false
}: {
  email: string,
  pdfBuffer: Buffer,
  orderId: string,
  packNames: string[],
  userName?: string,
  total?: number,
  items?: { name: string, price: number }[],
  isPreorder?: boolean
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Samples Wala <info@sampleswala.com>',
      to: email,
      subject: isPreorder ? `Pre-order Confirmed! - Order #${orderId}` : `Your Purchase is Ready! - Order #${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            @media only screen and (max-width: 600px) {
              .content { padding: 20px !important; }
              .header { padding: 30px 20px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Arial Black', Gadget, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <!-- Comic Accent Border Top -->
                <div style="width: 600px; height: 10px; background: linear-gradient(90deg, #ff0080, #00FF94, #FFC800);"></div>
                
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #0a0a0a; border: 4px solid #000; border-radius: 0px; overflow: hidden; box-shadow: 15px 15px 0px rgba(0,0,0,1);">
                  <!-- Header with Logo -->
                  <tr>
                    <td align="center" class="header" style="padding: 50px 40px; background-color: #000; border-bottom: 4px solid #000;">
                      <img src="${LOGO_URL}" alt="Samples Wala" width="220" style="display: block; margin-bottom: 25px;">
                      <h1 style="margin: 0; color: #fff; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; font-style: italic;">
                        ${isPreorder ? 'PRE-ORDER <span style="background-color: #ff0080; padding: 0 10px;">CONFIRMED!</span>' : 'THANK <span style="background-color: #00FF94; color: #000; padding: 0 10px;">YOU!</span>'}
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td class="content" style="padding: 40px; color: #ffffff;">
                      <p style="font-size: 20px; color: #00FF94; margin-bottom: 20px; text-transform: uppercase; font-weight: 900;">
                        HEY ${userName?.toUpperCase() || 'THERE'},
                      </p>
                      <p style="font-size: 14px; line-height: 1.6; color: #ffffff; margin-bottom: 30px; text-transform: uppercase; font-weight: 700;">
                        Your purchase of <span style="color: #FFC800;">${packNames.join(' & ')}</span> was successful. 
                        ${isPreorder 
                          ? "WE'RE IN THE STUDIO COOKING THIS PACK. YOU'LL BE THE FIRST TO RECEIVE IT!" 
                          : "YOUR SAMPLES ARE READY TO BLOW UP YOUR NEXT BEAT."}
                      </p>

                      <!-- Billing Table -->
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111; border: 3px solid #000; margin-bottom: 30px; box-shadow: 8px 8px 0px #000;">
                        <tr style="background-color: #1a1a1a;">
                          <td style="padding: 15px; font-size: 11px; font-weight: 900; color: #888; text-transform: uppercase;">Item</td>
                          <td style="padding: 15px; font-size: 11px; font-weight: 900; color: #888; text-transform: uppercase; text-align: right;">Price</td>
                        </tr>
                        ${items?.map(item => `
                          <tr>
                            <td style="padding: 15px; font-size: 12px; font-weight: 900; color: #fff; text-transform: uppercase; border-top: 1px solid #222;">${item.name}</td>
                            <td style="padding: 15px; font-size: 12px; font-weight: 900; color: #fff; text-transform: uppercase; border-top: 1px solid #222; text-align: right;">INR ${item.price}</td>
                          </tr>
                        `).join('') || `
                          <tr>
                            <td style="padding: 15px; font-size: 12px; font-weight: 900; color: #fff; text-transform: uppercase; border-top: 1px solid #222;">${packNames.join(', ')}</td>
                            <td style="padding: 15px; font-size: 12px; font-weight: 900; color: #fff; text-transform: uppercase; border-top: 1px solid #222; text-align: right;">INR ${total || '---'}</td>
                          </tr>
                        `}
                        <tr style="background-color: #00FF94; color: #000;">
                          <td style="padding: 15px; font-size: 14px; font-weight: 900; text-transform: uppercase;">Total Paid</td>
                          <td style="padding: 15px; font-size: 14px; font-weight: 900; text-transform: uppercase; text-align: right;">INR ${total || '---'}</td>
                        </tr>
                      </table>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 40px 0;">
                        <tr>
                          <td align="center">
                            <!-- Centered Button Wrapper -->
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" style="background-color: #ff0080; border: 4px solid #000; box-shadow: 10px 10px 0px #000;">
                                  <a href="${SITE_URL}/library" 
                                     style="display: inline-block; color: #ffffff; padding: 20px 50px; font-size: 16px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 2px;">
                                     ${isPreorder ? 'VIEW IN VAULT' : 'OPEN MY LIBRARY'}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer Section -->
                  <tr>
                    <td style="padding: 60px 40px; background-color: #000; border-top: 10px solid #00EAFF; text-align: center;">
                      <div style="margin-bottom: 35px;">
                        <a href="https://instagram.com/sampleswala" style="text-decoration: none; margin: 0 15px;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="35" style="filter: invert(1);"></a>
                        <a href="https://youtube.com/@sampleswala" style="text-decoration: none; margin: 0 15px;"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="35" style="filter: invert(1);"></a>
                      </div>
                      
                      <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 900; color: #00EAFF; text-transform: uppercase; letter-spacing: 3px;">
                          NEED HELP?
                        </p>
                        <table border="0" cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td style="vertical-align: middle; padding-right: 10px;">
                              <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" width="20" style="filter: invert(1); display: block;">
                            </td>
                            <td style="vertical-align: middle;">
                              <a href="mailto:Support@sampleswala.com" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase;">Support@sampleswala.com</a>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <p style="margin: 0 0 35px 0; font-size: 10px; color: #555; text-transform: uppercase; font-weight: 900; line-height: 1.8; letter-spacing: 1px;">
                        SAMPLES WALA STUDIO<br>
                        Husen Nagar, Kolhewadi Road,<br>
                        Near Tajgarden, Sangamner 422605
                      </p>
                      
                      <div style="margin: 35px 0;">
                        <p style="font-size: 20px; font-weight: 900; color: #ffffff; margin: 0; text-transform: uppercase; font-style: italic;">
                          MADE IN <span style="color: #ff9933;">BHA</span><span style="color: #ffffff;">R</span><span style="color: #128807;">AT</span>
                        </p>
                      </div>

                      <p style="margin: 0; font-size: 9px; color: #333; text-transform: uppercase; font-weight: 900;">
                        &copy; 2026 SAMPLES WALA. ALL RIGHTS RESERVED.
                      </p>

                      <!-- Unique ID to prevent Gmail quoting/collapsing -->
                      <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px;">
                        Order Ref: ${orderId}-${Date.now()}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
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

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const LOGO_URL = 'https://imagizer.imageshack.com/img924/3747/53oszD.png'
const SITE_URL = 'https://www.sampleswala.com'

export async function sendInvoiceEmail({
  email,
  pdfBuffer,
  orderId,
  packNames,
  userName,
  total,
  items,
  isPreorder = false,
  currency = 'INR'
}: {
  email: string,
  pdfBuffer: Buffer,
  orderId: string,
  packNames: string[],
  userName?: string,
  total?: number,
  items?: { name: string, price: number }[],
  isPreorder?: boolean,
  currency?: string
}) {
  try {
    const curSymbol = currency === 'USD' ? '$' : '₹'
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
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideFromTop {
              from { opacity: 0; transform: translateY(-50px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideFromBottom {
              from { opacity: 0; transform: translateY(50px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideFromLeft {
              from { opacity: 0; transform: translateX(-50px); }
              to { opacity: 1; transform: translateX(0); }
            }
            @keyframes glow {
              0% { text-shadow: 0 0 5px #00FF94, 0 0 10px #00FF94; }
              50% { text-shadow: 0 0 20px #00FF94, 0 0 30px #00FF94; }
              100% { text-shadow: 0 0 5px #00FF94, 0 0 10px #00FF94; }
            }
            @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-15px) rotate(2deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
            @keyframes wiggle {
              0% { transform: rotate(0deg); }
              25% { transform: rotate(-5deg); }
              75% { transform: rotate(5deg); }
              100% { transform: rotate(0deg); }
            }
            @keyframes pulse {
              0% { transform: scale(1); box-shadow: 10px 10px 0px #000; }
              50% { transform: scale(1.05); box-shadow: 15px 15px 0px #000; }
              100% { transform: scale(1); box-shadow: 10px 10px 0px #000; }
            }
            .fade-in { animation: fadeIn 0.8s ease-out forwards; }
            .reveal-top { animation: slideFromTop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            .reveal-bottom { animation: slideFromBottom 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            .reveal-left { animation: slideFromLeft 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            .glow-text { animation: glow 2s infinite; }
            .floating { animation: float 4s ease-in-out infinite; }
            .pulse-btn { animation: pulse 2s infinite ease-in-out; }
            .wiggle { animation: wiggle 2s infinite ease-in-out; }
            .delay-1 { animation-delay: 0.3s; }
            .delay-2 { animation-delay: 0.6s; }
            .delay-3 { animation-delay: 0.9s; }
          </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Arial Black', Gadget, sans-serif;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <!-- Comic Accent Border Top -->
                <div class="reveal-top" style="width: 600px; height: 10px; background: linear-gradient(90deg, #ff0080, #00FF94, #FFC800);"></div>
                
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="fade-in" style="background-color: #0a0a0a; border: 4px solid #000; border-radius: 0px; overflow: hidden; box-shadow: 15px 15px 0px rgba(0,0,0,1);">
                  <!-- Header with Logo -->
                  <tr>
                    <td align="center" class="header reveal-top delay-1" style="padding: 50px 40px; background-color: #000; border-bottom: 4px solid #000;">
                      <a href="${SITE_URL}" class="floating" style="text-decoration: none; border: none; display: block;">
                        <img src="${LOGO_URL}" alt="Samples Wala" width="220" draggable="false" style="display: block; margin: 0 auto 25px auto; border: none; outline: none; -webkit-user-drag: none;">
                      </a>
                      <h1 class="glow-text" style="margin: 0; color: #fff; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -2px; font-style: italic;">
                        ${isPreorder ? 'PRE-ORDER <span style="background-color: #ff0080; padding: 0 10px;">CONFIRMED!</span>' : 'THANK <span style="background-color: #00FF94; color: #000; padding: 0 10px;">YOU!</span>'}
                      </h1>
                    </td>
                  </tr>

                  <!-- Main Content Section -->
                  <tr>
                    <td class="content reveal-left delay-2" style="padding: 60px 40px; background-color: #0a0a0a;">
                      <h2 style="margin: 0 0 20px 0; color: #00FF94; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px;">
                        HEY ${userName?.toUpperCase() || 'THERE'},
                      </h2>
                      
                      <p style="margin: 0 0 40px 0; font-size: 16px; font-weight: 900; color: #ffffff; line-height: 1.6; text-transform: uppercase; letter-spacing: 1px;">
                        YOUR PURCHASE OF <span style="color: #FFC800;">${packNames.join(' & ')}</span> WAS SUCCESSFUL. 
                        ${isPreorder ? "WE'RE IN THE STUDIO COOKING THIS PACK. YOU'LL BE THE FIRST TO RECEIVE IT!" : "YOUR SAMPLES ARE READY FOR ACTION!"}
                      </p>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" class="reveal-bottom delay-3" style="border: 4px solid #000; box-shadow: 10px 10px 0px #000; background-color: #111;">
                        <tr style="background-color: #000;">
                          <td style="padding: 15px; font-size: 12px; font-weight: 900; color: #555; text-transform: uppercase;">ITEM</td>
                          <td align="right" style="padding: 15px; font-size: 12px; font-weight: 900; color: #555; text-transform: uppercase;">PRICE</td>
                        </tr>
                        ${items?.map(item => `
                        <tr>
                          <td style="padding: 20px 15px; font-size: 14px; font-weight: 900; color: #fff; border-bottom: 2px solid #000;">${item.name.toUpperCase()}</td>
                          <td align="right" style="padding: 20px 15px; font-size: 14px; font-weight: 900; color: #00FF94; border-bottom: 2px solid #000;">${curSymbol}${item.price}</td>
                        </tr>
                        `).join('') || `
                          <tr>
                            <td style="padding: 20px 15px; font-size: 14px; font-weight: 900; color: #fff; border-bottom: 2px solid #000;">${packNames.join(', ')}</td>
                            <td align="right" style="padding: 20px 15px; font-size: 14px; font-weight: 900; color: #00FF94; border-bottom: 2px solid #000;">${curSymbol}${total || '---'}</td>
                          </tr>
                        `}
                        <tr>
                          <td style="padding: 20px 15px; font-size: 18px; font-weight: 900; color: #fff; text-transform: uppercase;">TOTAL PAID</td>
                          <td align="right" style="padding: 20px 15px; font-size: 18px; font-weight: 900; color: #ff0080;">${curSymbol}${total || '---'}</td>
                        </tr>
                      </table>

                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 40px 0;">
                        <tr>
                          <td align="center">
                            <!-- Centered Button Wrapper -->
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" class="pulse-btn" style="background-color: #ff0080; border: 4px solid #000;">
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
                    <td class="reveal-bottom delay-3" style="padding: 60px 40px; background-color: #000; border-top: 10px solid #00EAFF; text-align: center;">
                      <div style="margin-bottom: 35px;">
                        <a href="https://instagram.com/sampleswala" class="wiggle" style="text-decoration: none; margin: 0 15px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="35" draggable="false" style="filter: invert(1); -webkit-user-drag: none;"></a>
                        <a href="https://youtube.com/@sampleswala" class="wiggle" style="text-decoration: none; margin: 0 15px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="35" draggable="false" style="filter: invert(1); -webkit-user-drag: none;"></a>
                      </div>
                      
                      <div style="margin-bottom: 25px;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 900; color: #00EAFF; text-transform: uppercase; letter-spacing: 3px;">
                          NEED HELP?
                        </p>
                        <table border="0" cellpadding="0" cellspacing="0" align="center">
                          <tr>
                            <td style="vertical-align: middle; padding-right: 8px;">
                              <img src="https://img.icons8.com/ios-filled/50/ffffff/mail.png" width="18" draggable="false" style="display: block; -webkit-user-drag: none; border: none;">
                            </td>
                            <td style="vertical-align: middle;">
                              <a href="mailto:Support@sampleswala.com" style="color: #888888; text-decoration: none; font-size: 13px; font-weight: 900; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">Support@sampleswala.com</a>
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

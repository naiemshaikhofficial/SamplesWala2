import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const LOGO_URL = 'https://imagizer.imageshack.com/img924/3747/53oszD.png'

export async function generateInvoicePDF(orderData: {
  orderId: string,
  paymentId: string,
  userName: string,
  userEmail: string,
  userAddress?: string,
  items: { name: string, price: number }[],
  total: number,
  date: string
}) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Comic Accents (Background elements)
  page.drawRectangle({ x: 0, y: height - 100, width: 10, height: 100, color: rgb(1, 0, 0.5) }) // Pink
  page.drawRectangle({ x: width - 10, y: height - 100, width: 10, height: 100, color: rgb(0, 1, 0.58) }) // Neon Green

  // Fetch and embed Logo with Black Background Container (Visibility Fix)
  try {
    const logoResp = await fetch(LOGO_URL)
    const logoBytes = await logoResp.arrayBuffer()
    const logoImage = await pdfDoc.embedPng(logoBytes)
    
    // Calculate balanced scaling
    const logoDims = logoImage.scale(0.18)
    const boxWidth = 160
    const boxHeight = 55
    const boxX = 50
    const boxY = height - 90

    // Draw Brutalist Black Box
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(0, 0, 0),
    })
    
    // Center Logo inside the box
    page.drawImage(logoImage, {
      x: boxX + (boxWidth - logoDims.width) / 2,
      y: boxY + (boxHeight - logoDims.height) / 2,
      width: logoDims.width,
      height: logoDims.height,
    })
  } catch (e) {
    page.drawText('SAMPLES WALA', { x: 50, y: height - 60, size: 24, font: boldFont })
  }

  // Official Title for GST Exemption
  page.drawText('BILL OF SUPPLY', {
    x: width - 200,
    y: height - 60,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  })
  page.drawText('(For Digital Goods/Services)', { x: width - 200, y: height - 72, size: 8, font })

  page.drawText(`INV-REF: ${orderData.orderId.slice(-10).toUpperCase()}`, { x: width - 200, y: height - 90, size: 9, font: boldFont })
  page.drawText(`DATE: ${orderData.date}`, { x: width - 200, y: height - 105, size: 9, font })

  // Company Details (Supplier)
  page.drawText('SUPPLIER:', { x: 50, y: height - 130, size: 10, font: boldFont })
  page.drawText('SAMPLES WALA', { x: 50, y: height - 145, size: 11, font: boldFont })
  page.drawText('Husen Nagar, Kolhewadi Road,', { x: 50, y: height - 160, size: 9, font })
  page.drawText('Near Tajgarden, Sangamner,', { x: 50, y: height - 175, size: 9, font })
  page.drawText('Maharashtra, India - 422605', { x: 50, y: height - 190, size: 9, font })
  page.drawText('PAN: [PENDING/NOT APPLICABLE]', { x: 50, y: height - 205, size: 8, font: boldFont })
  page.drawText('GSTIN: Not Registered (Exempt)', { x: 50, y: height - 218, size: 8, font })

  // Customer Details (Recipient)
  page.drawText('BILL TO (RECIPIENT):', { x: width - 240, y: height - 130, size: 10, font: boldFont })
  page.drawText(orderData.userName.toUpperCase() || 'VALUED CUSTOMER', { x: width - 240, y: height - 145, size: 9, font: boldFont })
  page.drawText(orderData.userEmail.toLowerCase(), { x: width - 240, y: height - 160, size: 9, font })
  
  if (orderData.userAddress) {
    const addressLines = orderData.userAddress.match(/.{1,40}/g) || [orderData.userAddress]
    let addrY = height - 175
    addressLines.slice(0, 3).forEach(line => {
      page.drawText(line.toUpperCase(), { x: width - 240, y: addrY, size: 8, font })
      addrY -= 12
    })
    page.drawText(`PLACE OF SUPPLY: ${orderData.userAddress.split(',').pop()?.trim().toUpperCase() || 'INDIA'}`, { x: width - 240, y: addrY - 5, size: 8, font: boldFont, color: rgb(1, 0, 0.5) })
  }

  // Main Transaction Table
  page.drawRectangle({
    x: 50,
    y: 220,
    width: 500,
    height: 350,
    borderWidth: 2,
    borderColor: rgb(0, 0, 0),
  })

  // Table Header (Comic Neon Green)
  page.drawRectangle({ x: 51, y: 545, width: 498, height: 25, color: rgb(0, 1, 0.58) })
  page.drawText('DESCRIPTION OF DIGITAL GOODS', { x: 70, y: 552, size: 9, font: boldFont })
  page.drawText('AMOUNT (INR)', { x: 450, y: 552, size: 9, font: boldFont })

  // Items
  let currentY = 520
  orderData.items.forEach((item) => {
    page.drawText(item.name.toUpperCase(), { x: 70, y: currentY, size: 9, font: boldFont })
    page.drawText(`${item.price.toFixed(2)}`, { x: 450, y: currentY, size: 9, font: boldFont })
    
    page.drawLine({
      start: { x: 70, y: currentY - 8 },
      end: { x: 530, y: currentY - 8 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
    currentY -= 30
  })

  // Calculation Block (Comic Yellow)
  const calcTop = 350
  page.drawRectangle({ x: 350, y: calcTop - 60, width: 200, height: 80, color: rgb(1, 0.8, 0) })
  page.drawRectangle({ x: 350, y: calcTop - 60, width: 200, height: 80, borderWidth: 2, borderColor: rgb(0,0,0) })

  page.drawText('SUBTOTAL:', { x: 365, y: calcTop - 5, size: 9, font: boldFont })
  page.drawText(`${orderData.total.toFixed(2)}`, { x: 470, y: calcTop - 5, size: 9, font: boldFont })

  page.drawText('GST (0% EXEMPT):', { x: 365, y: calcTop - 25, size: 9, font: boldFont })
  page.drawText('0.00', { x: 470, y: calcTop - 25, size: 9, font: boldFont })

  page.drawLine({ start: { x: 365, y: calcTop - 35 }, end: { x: 535, y: calcTop - 35 }, thickness: 1 })

  page.drawText('NET PAYABLE:', { x: 365, y: calcTop - 52, size: 11, font: boldFont })
  page.drawText(`INR ${orderData.total.toFixed(2)}`, { x: 470, y: calcTop - 52, size: 11, font: boldFont })

  // Transaction Stamp
  page.drawRectangle({ x: 50, y: 230, width: 140, height: 35, color: rgb(0, 0, 0) })
  page.drawText('PAYMENT SUCCESSFUL', { x: 60, y: 243, size: 8, font: boldFont, color: rgb(0, 1, 0.58) })

  // Legal declarations (Mandatory for Bill of Supply)
  const legalY = 180
  page.drawText('DECLARATIONS:', { x: 50, y: legalY, size: 8, font: boldFont })
  page.drawText('1. We declare that this invoice shows the actual price of the goods described.', { x: 50, y: legalY - 15, size: 7, font })
  page.drawText('2. This is a computer generated Bill of Supply and does not require a signature.', { x: 50, y: legalY - 25, size: 7, font })
  page.drawText('3. Digital product access is delivered via email and the user vault.', { x: 50, y: legalY - 35, size: 7, font })
  page.drawText('4. GST is not applicable as the supplier is currently under the exemption limit.', { x: 50, y: legalY - 45, size: 7, font: boldFont, color: rgb(1, 0, 0.5) })

  // Footer / Branding
  page.drawText('MADE IN BHARAT', {
    x: width / 2 - 40,
    y: 60,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2),
  })

  page.drawText('SUPPORT: Support@sampleswala.com', {
    x: width / 2 - 70,
    y: 40,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

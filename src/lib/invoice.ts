import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function generateInvoicePDF(orderData: {
  orderId: string,
  paymentId: string,
  userName: string,
  userEmail: string,
  items: { name: string, price: number }[],
  total: number,
  date: string
}) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([600, 800])
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Header
  page.drawText('SAMPLES WALA', {
    x: 50,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  page.drawText('Mumbai, India', {
    x: 50,
    y: height - 70,
    size: 10,
    font: font,
    color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText('Official Bill of Supply', {
    x: 50,
    y: height - 95,
    size: 12,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Order Details
  page.drawText(`Date: ${orderData.date}`, { x: 400, y: height - 50, size: 10, font })
  page.drawText(`Order ID: ${orderData.orderId}`, { x: 400, y: height - 65, size: 10, font })
  page.drawText(`Payment ID: ${orderData.paymentId}`, { x: 400, y: height - 80, size: 10, font })

  // Customer Details
  page.drawText('Bill To:', { x: 50, y: height - 130, size: 12, font: boldFont })
  page.drawText(orderData.userName || 'Valued Customer', { x: 50, y: height - 150, size: 10, font })
  page.drawText(orderData.userEmail, { x: 50, y: height - 165, size: 10, font })

  // Table Header
  const tableTop = height - 220
  page.drawRectangle({
    x: 50,
    y: tableTop - 5,
    width: 500,
    height: 25,
    color: rgb(0.95, 0.95, 0.95),
  })
  page.drawText('Item Description', { x: 60, y: tableTop, size: 10, font: boldFont })
  page.drawText('Price (INR)', { x: 450, y: tableTop, size: 10, font: boldFont })

  // Items
  let currentY = tableTop - 30
  orderData.items.forEach((item) => {
    page.drawText(item.name, { x: 60, y: currentY, size: 10, font })
    page.drawText(`Rs. ${item.price.toFixed(2)}`, { x: 450, y: currentY, size: 10, font })
    currentY -= 20
  })

  // Total
  page.drawLine({
    start: { x: 50, y: currentY },
    end: { x: 550, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  })

  page.drawText('Total Amount:', { x: 350, y: currentY - 30, size: 12, font: boldFont })
  page.drawText(`Rs. ${orderData.total.toFixed(2)}`, { x: 450, y: currentY - 30, size: 12, font: boldFont })

  // Legal Declarations (Indian Law)
  const declarationY = currentY - 100
  page.drawText('DECLARATION:', { x: 50, y: declarationY, size: 10, font: boldFont })
  page.drawText('1. This is a digital product, hence no physical shipping is involved.', { x: 50, y: declarationY - 20, size: 8, font })
  page.drawText('2. All sales are final. No refunds or cancellations are applicable for digital goods.', { x: 50, y: declarationY - 35, size: 8, font })
  page.drawText('3. No GST has been charged as the seller is currently under the GST threshold.', { x: 50, y: declarationY - 50, size: 8, font })
  page.drawText('4. This is a computer-generated invoice and does not require a physical signature.', { x: 50, y: declarationY - 65, size: 8, font })

  // Footer
  page.drawText('Thank you for choosing Samples Wala!', {
    x: width / 2 - 100,
    y: 50,
    size: 10,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}

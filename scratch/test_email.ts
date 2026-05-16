import { generateInvoicePDF } from '../src/lib/invoice'
import { sendInvoiceEmail } from '../src/lib/emails'
// Testing environment variables directly from process.env


async function testEmail() {
  console.log('--- Starting Email Test ---')

  const testData = {
    orderId: 'TEST_PREORDER_123',
    paymentId: 'pay_test_456',
    userName: 'Naiem Shaikh',
    userEmail: 'sampleswala@gmail.com',
    userAddress: '123 Music Lane, Sangamner, Maharashtra - 422605',
    items: [
      { name: 'Sambhalpur Rhythm (PRE-ORDER)', price: 999 },
      { name: 'Vocal Presets Vol 1', price: 499 }
    ],
    total: 1498,
    date: new Date().toLocaleDateString()
  }

  try {
    console.log('Generating Test PDF...')
    const pdfBuffer = await generateInvoicePDF(testData)

    console.log('Sending Test Email to:', testData.userEmail)
    const result = await sendInvoiceEmail({
      email: testData.userEmail,
      pdfBuffer,
      orderId: testData.orderId,
      packNames: testData.items.map(i => i.name),
      userName: testData.userName,
      total: testData.total,
      items: testData.items,
      isPreorder: true // Testing the pre-order template
    })

    if (result.success) {
      console.log('SUCCESS: Test email sent!')
    } else {
      console.error('FAILED:', result.error)
    }
  } catch (err) {
    console.error('CRITICAL ERROR:', err)
  }
}

testEmail()

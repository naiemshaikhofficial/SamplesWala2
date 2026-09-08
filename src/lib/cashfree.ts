/**
 * Cashfree Payment Gateway Integration Helper (v2023-08-01)
 * Official Docs: https://www.cashfree.com/docs/api-reference/payments/previous/v2023-08-01/overview
 */

export interface CashfreeCustomerDetails {
  customer_id: string
  customer_email: string
  customer_phone: string
  customer_name: string
}

export interface CashfreeOrderParams {
  order_id: string
  order_amount: number
  order_currency?: string
  customer_details: CashfreeCustomerDetails
  order_meta?: {
    return_url?: string
    notify_url?: string
    payment_methods?: string
  }
  order_note?: string
  order_tags?: Record<string, string>
}

export interface CashfreeOrderResponse {
  cf_order_id: string | number
  order_id: string
  entity: string
  order_currency: string
  order_amount: number
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | 'FAILED'
  payment_session_id: string
  order_expiry_time?: string
  customer_details?: CashfreeCustomerDetails
  order_meta?: any
  order_note?: string
  error?: string
  message?: string
}

export interface CashfreePaymentItem {
  cf_payment_id: string | number
  payment_status: 'SUCCESS' | 'NOT_ATTEMPTED' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'USER_DROPPED'
  payment_amount: number
  payment_currency: string
  payment_message?: string
  payment_time?: string
  payment_method?: any
  payment_group?: string
}

const getBaseUrl = () => {
  const env = process.env.CASHFREE_ENV || 'production'
  return env === 'sandbox'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg'
}

const getHeaders = () => {
  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY
  const apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01'

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials are not configured in environment variables.')
  }

  return {
    'Content-Type': 'application/json',
    'x-client-id': appId,
    'x-client-secret': secretKey,
    'x-api-version': apiVersion,
  }
}

/**
 * Creates an order in Cashfree using the 2023-08-01 API
 */
export async function createCashfreeOrder(params: CashfreeOrderParams): Promise<CashfreeOrderResponse> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  const payload = {
    order_id: params.order_id,
    order_amount: Number(params.order_amount.toFixed(2)),
    order_currency: params.order_currency || 'INR',
    customer_details: {
      customer_id: params.customer_details.customer_id.substring(0, 100),
      customer_email: params.customer_details.customer_email,
      customer_phone: params.customer_details.customer_phone.replace(/\D/g, '').slice(-10) || '9999999999',
      customer_name: params.customer_details.customer_name || 'Customer'
    },
    order_meta: params.order_meta || {},
    order_note: params.order_note || 'SamplesWala Checkout',
    ...(params.order_tags ? { order_tags: params.order_tags } : {})
  }

  const res = await fetch(`${baseUrl}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    cache: 'no-store'
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[CASHFREE_CREATE_ORDER_FAILED]', { status: res.status, data })
    throw new Error(data.message || data.error || 'Failed to initialize Cashfree order')
  }

  return data
}

/**
 * Fetches the current order details from Cashfree
 */
export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers,
    cache: 'no-store'
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[CASHFREE_GET_ORDER_FAILED]', { status: res.status, data })
    throw new Error(data.message || data.error || 'Failed to fetch Cashfree order')
  }

  return data
}

/**
 * Fetches all payment attempts and their statuses for an order
 */
export async function getCashfreeOrderPayments(orderId: string): Promise<CashfreePaymentItem[]> {
  const baseUrl = getBaseUrl()
  const headers = getHeaders()

  const res = await fetch(`${baseUrl}/orders/${encodeURIComponent(orderId)}/payments`, {
    method: 'GET',
    headers,
    cache: 'no-store'
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('[CASHFREE_GET_PAYMENTS_FAILED]', { status: res.status, data })
    return []
  }

  return Array.isArray(data) ? data : []
}

import crypto from 'crypto'

function getSecretKey(): string {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.RAZORPAY_KEY_SECRET
  if (!secret) {
    throw new Error('FATAL SECURITY ERROR: Server secret key configuration missing.')
  }
  return secret
}

/**
 * Signs a payload into a secure HMAC SHA-256 JWT-style token
 */
export function signDownloadToken(payload: any, expiresInSeconds: number = 300) {
  const secret = getSecretKey()
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const fullPayload = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url')
  
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(`${header}.${fullPayload}`)
  const signature = hmac.digest('base64url')
  
  return `${header}.${fullPayload}.${signature}`
}

/**
 * Verifies a token with timing-safe comparison and returns the decoded payload
 */
export function verifyDownloadToken(token: string) {
  try {
    if (!token || typeof token !== 'string') return null
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts
    if (!header || !payload || !signature) return null

    const secret = getSecretKey()
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(`${header}.${payload}`)
    const expectedSignature = hmac.digest('base64url')

    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expectedSignature)

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))

    // Strict expiration check
    if (!decodedPayload.exp || typeof decodedPayload.exp !== 'number' || decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      console.warn('[SECURITY_TOKEN_EXPIRED]')
      return null
    }

    // Required claims check
    if (!decodedPayload.uid || !decodedPayload.pid) {
      console.warn('[SECURITY_TOKEN_MALFORMED]')
      return null
    }

    return decodedPayload
  } catch (err) {
    console.error('[TOKEN_VERIFY_ERROR]', err)
    return null
  }
}

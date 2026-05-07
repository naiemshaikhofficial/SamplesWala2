import crypto from 'crypto'

const SECRET = process.env.JWT_SECRET || 'samples-wala-default-secret-key-2026'

/**
 * Signs a payload into a JWT-style token
 */
export function signDownloadToken(payload: any, expiresInSeconds: number = 900) { // Default 15 mins
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
    const fullPayload = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url')
    
    const hmac = crypto.createHmac('sha256', SECRET)
    hmac.update(`${header}.${fullPayload}`)
    const signature = hmac.digest('base64url')
    
    return `${header}.${fullPayload}.${signature}`
}

/**
 * Verifies a token and returns the payload
 */
export function verifyDownloadToken(token: string) {
    try {
        const [header, payload, signature] = token.split('.')
        if (!header || !payload || !signature) return null
        
        const hmac = crypto.createHmac('sha256', SECRET)
        hmac.update(`${header}.${payload}`)
        const expectedSignature = hmac.digest('base64url')
        
        if (signature !== expectedSignature) return null
        
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString())
        
        // Check expiration
        if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
            console.error("[TOKEN_EXPIRED]")
            return null
        }
        
        return decodedPayload
    } catch (err) {
        console.error("[TOKEN_VERIFY_ERROR]", err)
        return null
    }
}

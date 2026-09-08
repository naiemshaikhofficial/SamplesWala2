export interface BillingDetailsInput {
  fullName?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
  country?: string | null
  [key: string]: any
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  sanitized: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
}

// Common placeholder/dummy values that indicate spoofed/invalid input
const DUMMY_STRINGS = new Set([
  'test', 'none', 'null', 'undefined', 'nil', 'na', 'n/a', 'asdf', 'xyz', 'demo', 'fake'
])

function isPlaceholder(val: string): boolean {
  const clean = val.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  return DUMMY_STRINGS.has(clean)
}

function isRepeatedDigits(digits: string): boolean {
  return /^(\d)\1+$/.test(digits)
}

/**
 * Validates and sanitizes customer billing details.
 * Ensures orders cannot be initiated, claimed, or paid with invalid or dummy information.
 * Mandatory for all orders (both paid and free orders).
 *
 * @param details User-provided billing details
 */
export function validateBillingDetails(
  details: BillingDetailsInput | null | undefined
): ValidationResult {
  const errors: Record<string, string> = {}

  const rawName = (details?.fullName || '').trim()
  const rawPhone = (details?.phone || '').trim()
  const rawAddress = (details?.address || '').trim()
  const rawCity = (details?.city || '').trim()
  const rawState = (details?.state || '').trim()
  const rawZip = (details?.zip || '').trim()
  const rawCountry = (details?.country || 'India').trim()

  const countryNormalized = rawCountry.toLowerCase()
  const isIndia = countryNormalized === 'india' || countryNormalized.startsWith('ind') || countryNormalized === 'in'

  // --- 1. FULL NAME ---
  if (!rawName) {
    errors.fullName = 'Full name is required'
  } else if (rawName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters'
  } else if (rawName.length > 80) {
    errors.fullName = 'Full name must be under 80 characters'
  } else if (!/[a-zA-Z]/.test(rawName)) {
    errors.fullName = 'Please enter a valid name containing letters'
  } else if (isPlaceholder(rawName)) {
    errors.fullName = 'Please enter your actual full name'
  }

  // --- 2. PHONE NUMBER ---
  const phoneDigits = rawPhone.replace(/\D/g, '')

  if (!rawPhone || !phoneDigits) {
    errors.phone = 'Phone number is required'
  } else if (isIndia) {
    if (phoneDigits.length < 10) {
      errors.phone = 'Enter a valid 10-digit mobile number'
    } else {
      const last10 = phoneDigits.slice(-10)
      if (!/^[6-9]\d{9}$/.test(last10)) {
        errors.phone = 'Indian mobile number must start with 6, 7, 8, or 9'
      } else if (isRepeatedDigits(last10)) {
        errors.phone = 'Please enter a valid, non-dummy mobile number'
      } else if (last10 === '1234567890' || last10 === '9876543210') {
        errors.phone = 'Please enter your actual mobile number'
      }
    }
  } else {
    // International standard: E.164 recommendation (7 to 15 digits)
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = 'Enter a valid phone number (7-15 digits)'
    } else if (isRepeatedDigits(phoneDigits)) {
      errors.phone = 'Please enter a valid, non-dummy phone number'
    }
  }

  // --- 3. STREET ADDRESS ---
  if (!rawAddress) {
    errors.address = 'Street address is required'
  } else if (rawAddress.length < 4) {
    errors.address = 'Address must be at least 4 characters'
  } else if (rawAddress.length > 200) {
    errors.address = 'Address cannot exceed 200 characters'
  } else if (!/[a-zA-Z0-9]/.test(rawAddress)) {
    errors.address = 'Please enter a valid street address'
  } else if (isPlaceholder(rawAddress)) {
    errors.address = 'Please enter your actual street address'
  }

  // --- 4. CITY ---
  if (!rawCity) {
    errors.city = 'City is required'
  } else if (rawCity.length < 2) {
    errors.city = 'City must be at least 2 characters'
  } else if (rawCity.length > 80) {
    errors.city = 'City cannot exceed 80 characters'
  } else if (!/[a-zA-Z]/.test(rawCity)) {
    errors.city = 'Please enter a valid city name'
  } else if (isPlaceholder(rawCity)) {
    errors.city = 'Please enter your actual city'
  }

  // --- 5. STATE ---
  if (!rawState) {
    errors.state = 'State is required'
  } else if (rawState.length < 2) {
    errors.state = 'State must be at least 2 characters'
  } else if (rawState.length > 80) {
    errors.state = 'State cannot exceed 80 characters'
  } else if (!/[a-zA-Z]/.test(rawState)) {
    errors.state = 'Please enter a valid state name'
  } else if (isPlaceholder(rawState)) {
    errors.state = 'Please enter your actual state'
  }

  // --- 6. PINCODE / POSTAL CODE ---
  if (!rawZip) {
    errors.zip = 'Pincode / Postal code is required'
  } else if (isIndia) {
    if (!/^[1-9]\d{5}$/.test(rawZip)) {
      errors.zip = 'Enter a valid 6-digit Indian pincode'
    } else if (isRepeatedDigits(rawZip)) {
      errors.zip = 'Please enter a valid pincode'
    }
  } else {
    // International postal code format (3 to 10 alphanumeric chars)
    if (!/^[a-zA-Z0-9\s-]{3,10}$/.test(rawZip)) {
      errors.zip = 'Enter a valid postal / zip code'
    }
  }

  // --- 7. COUNTRY ---
  if (!rawCountry || rawCountry.length < 2) {
    errors.country = 'Country is required'
  }

  // Clean, sanitized data formatted for payment gateways
  const sanitizedPhone = isIndia
    ? phoneDigits.slice(-10)
    : rawPhone.startsWith('+') ? `+${phoneDigits}` : phoneDigits

  const sanitized = {
    fullName: rawName.replace(/[^a-zA-Z0-9\s.'-]/g, '').trim(),
    phone: sanitizedPhone,
    address: rawAddress.trim(),
    city: rawCity.trim(),
    state: rawState.trim(),
    zip: rawZip.trim(),
    country: rawCountry.trim()
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized
  }
}

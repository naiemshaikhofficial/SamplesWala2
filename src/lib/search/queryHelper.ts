/**
 * Search query normalization utility for SamplesWala.
 * Removes generic noise words like "sample", "samples", "smple", "sample wala", "music sample", etc.
 * to enable highly flexible search matching.
 */

// Phrase replacements (multi-word terms to match and strip first)
const GENERIC_PHRASES = [
  'music samples',
  'music sample',
  'samples wala',
  'sample wala',
  'sampleswala',
  'samplewala',
  'sound packs',
  'sound pack',
  'soundpacks',
  'soundpack',
  'vocal sample',
  'vocal samples'
]

// Word-level replacements (single-word terms to strip)
const GENERIC_WORDS = [
  'samples',
  'sample',
  'smples',
  'smple',
  'music',
  'sounds',
  'sound',
  'packs',
  'pack',
  'loops',
  'loop',
  'kit',
  'kits'
]

/**
 * Cleans and normalizes a search query by removing generic noise terms.
 * If the query only consists of generic/synonym words, it returns an empty string,
 * which signals that all packs should be shown/matched.
 */
export function cleanSearchQuery(query: string): string {
  if (!query) return ''
  
  // Lowercase and trim extra spacing
  let q = query.toLowerCase().trim()
  
  // 1. Remove multi-word generic phrases
  for (const phrase of GENERIC_PHRASES) {
    q = q.replace(phrase, '')
  }
  
  // 2. Split by whitespace and remove single-word generic terms
  const words = q.split(/\s+/)
  const filteredWords = words.filter(word => {
    // Only keep words that aren't generic/noise terms and are non-empty
    return word && !GENERIC_WORDS.includes(word)
  })
  
  return filteredWords.join(' ').trim()
}

/**
 * Checks if a search query is entirely made of generic terms.
 */
export function isGenericQuery(query: string): boolean {
  if (!query) return true
  return cleanSearchQuery(query) === ''
}

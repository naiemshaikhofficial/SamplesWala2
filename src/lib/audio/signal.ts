import { unstable_cache } from 'next/cache'

/**
 * Extracts the Google Drive File ID from various URL formats.
 */
export function getDriveFileId(url: string | null): string | null {
  if (!url) return null
  // Match standard Google Drive ID format (usually 33 characters, alphanumeric plus underscores and hyphens)
  const match = url.match(/[-\w]{25,}/)
  return match ? match[0] : null
}

/**
 * Generates a consistent "audio signal" (waveform representation) for a given file.
 * This is wrapped in unstable_cache to offload processing and serve from the Edge.
 */
export async function generateAudioSignal(driveId: string, name: string) {
  return unstable_cache(
    async () => {
      console.log(`[SIGNAL_GEN] Generating signal for: ${name} (${driveId})`)
      
      // Generate 50 points of "waveform" data (0-100 range)
      const points = 50
      const signal: number[] = []
      
      // Seeded random-ish generation based on driveId
      let seed = 0
      for (let i = 0; i < driveId.length; i++) {
        seed += driveId.charCodeAt(i)
      }

      for (let i = 0; i < points; i++) {
        // Use sine waves + seed to create a "natural" looking waveform
        const val = Math.abs(
          Math.sin(i * 0.5 + seed) * 40 + 
          Math.sin(i * 0.2) * 30 + 
          Math.random() * 20 + 
          10
        )
        signal.push(Math.floor(val))
      }

      return signal
    },
    ['audio-signals', driveId],
    { 
      revalidate: 86400, // Cache for 24 hours
      tags: ['audio-signals'] 
    }
  )()
}

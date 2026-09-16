import { NextRequest, NextResponse } from 'next/server'
import { getPacks } from '@/app/browse/actions'

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'it', 'free', 'sample', 'samples', 'pack', 'packs', '25', '100', 'indian',
  'sounds', 'sound', 'wala', 'royalty', 'one', 'shots', 'shot', 'all', 'new', 'best',
  'includes', 'collection', 'kit', 'kits'
])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawIntent = (searchParams.get('q') || searchParams.get('intent') || '').toLowerCase().trim()
    const targetCategory = (searchParams.get('category') || '').toLowerCase().trim()
    const excludeParam = searchParams.get('exclude') || ''
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '4', 10), 1), 12)

    const excludeIds = new Set(
      excludeParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    )

    // Tokenize search intent words and remove non-meaningful stop words
    const intentTokens = rawIntent
      .split(/[\s,_\-—|/()+]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length >= 3 && !STOP_WORDS.has(t))

    // Load cached packs (zero DB penalty via Next.js unstable_cache)
    const allPacks = await getPacks()

    // Filter out excluded packs (already in cart or currently being viewed)
    const eligiblePacks = allPacks.filter((p: any) => {
      const id = (p.id || '').toLowerCase()
      const slug = (p.slug || '').toLowerCase()
      return !excludeIds.has(id) && !excludeIds.has(slug)
    })

    // Score eligible packs based on sound similarity & user intent
    const scoredPacks = eligiblePacks.map((pack: any) => {
      let score = 0
      const packName = (pack.name || '').toLowerCase()
      const packDesc = (pack.description || '').toLowerCase()
      const catName = (pack.categories?.name || '').toLowerCase()

      // Exact category matching
      if (targetCategory && (catName.includes(targetCategory) || targetCategory.includes(catName))) {
        score += 20
      }

      // Keyword / Intent token matches in title, category, or description
      for (const token of intentTokens) {
        // High boost if token appears in title
        if (packName.includes(token)) {
          score += 15
        }
        // Boost if token appears in category
        if (catName.includes(token)) {
          score += 10
        }
        // Mild boost if token appears in description
        if (packDesc.includes(token)) {
          score += 3
        }
      }

      // Semantic sound synergy bonuses:
      // Rhythm / Percussion synergy
      const isRhythmIntent = intentTokens.some((t) => ['rhythm', 'percussion', 'drum', 'drums', 'loops', 'beat', 'beats', 'dhol', 'dholak', 'tabla'].includes(t))
      const isPackRhythm = packName.includes('rhythm') || packName.includes('percussion') || packName.includes('drum') || packName.includes('loop')
      if (isRhythmIntent && isPackRhythm) {
        score += 12
      }

      // South / Tapori synergy
      const isSouthIntent = intentTokens.some((t) => ['south', 'tapori', 'kuthu'].includes(t))
      const isPackSouth = packName.includes('south') || packName.includes('tapori') || packName.includes('kuthu')
      if (isSouthIntent && isPackSouth) {
        score += 15
      }

      // Melody / Vocal synergy
      const isMelodyIntent = intentTokens.some((t) => ['vocal', 'vocals', 'melody', 'melodies', 'bollywood', 'singing'].includes(t))
      const isPackMelody = packName.includes('vocal') || packName.includes('melody') || packName.includes('bollywood')
      if (isMelodyIntent && isPackMelody) {
        score += 15
      }

      return { pack, score }
    })

    // Sort by highest relevance score first, with a deterministic tie-breaker
    scoredPacks.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.pack.created_at).getTime() - new Date(a.pack.created_at).getTime()
    })

    const recommendations = scoredPacks.slice(0, limit).map((sp) => sp.pack)

    return NextResponse.json(recommendations, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=59',
      },
    })
  } catch (error) {
    console.error('[RECOMMENDATIONS_ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 })
  }
}

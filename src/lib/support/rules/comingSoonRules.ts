/**
 * Rules for Coming Soon & Unreleased Products on SamplesWala
 */
export interface ComingSoonRuleContext {
  candidateProduct?: {
    name: string
    is_coming_soon?: boolean
    price_inr?: number
  } | null
}

export function getComingSoonRules(ctx: ComingSoonRuleContext): string {
  return `CRITICAL RULES FOR COMING SOON / UNRELEASED PRODUCTS:
1. STORE STATUS FOR UNRELEASED PACKS:
   - Products marked as COMING SOON are currently in final studio mastering.
   - They CANNOT be purchased yet; checkout and buy buttons have NEVER been opened for them.
   
2. HANDLING PURCHASE CLAIMS FOR COMING SOON PACKS:
   - If a user claims they purchased an unreleased pack:
     * State clearly, politely, and respectfully that "${ctx.candidateProduct?.name || 'this pack'}" has NOT officially launched yet!
     * It is currently in final audio mastering and was never available for checkout.
     * Therefore, no purchase exists in the system for this pack.
     * NEVER hallucinate or claim "I have verified your purchase of ${ctx.candidateProduct?.name || 'this pack'}"!
     * Inform them that a "Drop Alert / Notify Me" card has been provided so they can get notified upon release.`
}

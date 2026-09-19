# auth.md

## Agent Audience
This document provides agent registration and authentication instructions for autonomous AI agents, crawlers, and LLM systems accessing Samples Wala (https://sampleswala.com).

## OAuth Protected Resource Metadata
- Resource: `https://sampleswala.com`
- PRM Document: `https://sampleswala.com/.well-known/oauth-protected-resource`
- Authorization Server: `https://sampleswala.com/.well-known/oauth-authorization-server`
- Bearer Methods: `header`
- Scopes: `openid`, `profile`, `email`, `samples:read`, `packs:download`

## Agent Auth & Registration Methods
- **Anonymous Access:**
  - `identity_types_supported`: `["anonymous"]`
  - `anonymous.credential_types_supported`: `["none"]`
  - `claim_uri`: `https://sampleswala.com/browse`
  - Zero credentials required for public catalog search, audio preview playback, and metadata queries.

- **Verified Email:**
  - `identity_types_supported`: `["identity_assertion"]`
  - `identity_assertion.assertion_types_supported`: `["verified_email"]`
  - `claim_uri`: `https://sampleswala.com/auth`

- **Identity Assertion (ID-JAG):**
  - `identity_types_supported`: `["identity_assertion"]`
  - `identity_assertion.assertion_types_supported`: `["urn:ietf:params:oauth:token-type:id-jag"]`
  - `credential_types_supported`: `["token"]`
  - `claim_uri`: `https://sampleswala.com/api/auth/token`

## Agent Auth Block
```json
{
  "agent_auth": {
    "skill": "https://sampleswala.com/.well-known/agent-skills/sample-search/SKILL.md",
    "register_uri": "https://sampleswala.com/auth",
    "supported_methods": [
      "anonymous",
      "verified_email",
      "identity_assertion"
    ]
  }
}
```

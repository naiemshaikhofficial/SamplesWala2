# auth.md — SamplesWala Agent Registration & Discovery

## Agent Audience
This document is for autonomous AI agents, crawlers, and LLM systems interacting with Samples Wala (https://sampleswala.com).

## OAuth Protected Resource
- Resource: `https://sampleswala.com`
- Protected Resource Metadata: `https://sampleswala.com/.well-known/oauth-protected-resource`
- Authorization Server: `https://sampleswala.com/.well-known/oauth-authorization-server`

## Supported Identity & Authentication Methods
- **Anonymous Access:**
  - `identity_types_supported`: `["anonymous"]`
  - `anonymous.credential_types_supported`: `["none"]`
  - `claim_uri`: `https://sampleswala.com/browse`
  - Note: Public sample discovery, audio preview playback, and pack metadata require zero credentials.

- **Verified Email Access:**
  - `identity_assertion.assertion_types_supported`: `["verified_email"]`
  - `claim_uri`: `https://sampleswala.com/auth`

- **Agent Identity Assertion (ID-JAG):**
  - `identity_types_supported`: `["identity_assertion"]`
  - `assertion_types_supported`: `["urn:ietf:params:oauth:token-type:id-jag"]`

## Agent Auth Registration
```json
{
  "agent_auth": {
    "skill": "samples-wala-discovery",
    "register_uri": "https://sampleswala.com/auth",
    "supported_methods": ["anonymous", "verified_email"]
  }
}
```

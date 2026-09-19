# Samples Wala — Authentication Guide for AI Agents & Bots

## Overview
Samples Wala (https://sampleswala.com) is a royalty-free music sample library. Most content, including audio previews, pack details, waveform data, and licensing information, is publicly accessible without authentication.

## Authentication Rules
1. **Public Access (No Authentication Required):**
   - Sample browsing, pack discovery, audio previews, genre tags, and license terms at `/browse` and `/browse/packs` are open to the public.
   - Automated AI agents and search bots do not require authentication to read or index product data.

2. **Customer Authentication (Web UI):**
   - Human customers authenticate via Email OTP / Magic Link at `https://sampleswala.com/auth`.
   - Sessions are secured with HTTP-only cookies managed through Supabase.

3. **Inquiries & Partner Access:**
   - For high-volume automated data access or commercial partnerships, contact support@sampleswala.com.

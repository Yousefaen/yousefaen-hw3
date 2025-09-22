# Planneri — Single Source of Truth (SSOT) Implementation Plan

Version: 0.1 • Owner: Youssef • Target: MVP deployable on Netlify

---

## 1) Problem Statement (from PRD)
Cold-calling has been heavily restricted in the UAE, reducing a key lead source for real estate brokers. Agencies must differentiate via digital content and social channels, but smaller teams lack time and expertise to maintain a quality posting cadence. Larger teams have one marketer who is overextended and wants to offload repetitive work like creating posts, captions, hashtags, and reels.

Key goal: Provide an AI-assisted content creation workflow to generate on-brand social content (Instagram posts/reels, LinkedIn posts) quickly, helping agencies stand out and drive leads.

---

## 2) Personas (from PRD)
- **Gerard (CEO/Founder, DreamHomes)**
  - Values: brand, prestige, lead generation, the "Dubai dream".
  - Needs: tool that differentiates the agency and generates more/better leads for agents.

- **Natalia (Marketing Manager, DreamHomes)**
  - Solo marketer, time-constrained, not a real estate expert.
  - Pain: repetitive, manual tasks (3D renders, compliance, QR codes, hashtags) and boring IG feed.
  - Needs: offload heavy lifting of copy, hashtags, CTA, basic media assembly; preview and post.

- **Users**
  - Real estate agents who want to improve personal brand and inbound leads.
  - RE marketers at agencies managing social content strategy/execution.

- **Regulator**
  - Dubai RERA: compliance around claims, licensing, project ads, false advertising.

---

## 3) Primary User Journeys (PRD)
- **Journey A: Create an Instagram Reel (Natalia)**
  1. Goal selection (Lead Gen, Brand Awareness, Community, Website Traffic)
  2. Target audience selection (segments like First-time buyers, International investors, etc.)
  3. Content type selection (IG Post, IG Reel, LinkedIn Post)
  4. Copywriting style selection (direct, persuasive, personal, warm, authoritative/expert)
  5. Asset upload (photos/video snippets)
  6. For Reel: choose AI voice + music tone (optional for MVP)
  7. Preview generated content; approve and post (or export) to platform

- **Journey B: Create an Instagram/LinkedIn Static Post (Natalia/Agents)**
  1. Goal selection
  2. Target audience
  3. Content type: IG Post or LinkedIn Post
  4. Style selection
  5. Asset upload (1-5 images)
  6. Generate caption + hashtags + CTA; preview on platform mock
  7. Approve and post/export

---

## 4) MVP Scope (What we will ship first)
- Web app hosted on Netlify (static front-end + Netlify Functions backend)
- Auth-less prototype (single-tenant demo) with local state; optional site password via Netlify
- Step-by-step creation wizard covering:
  - Goal, Audience, Content Type, Style, Assets, Preview
- AI caption/hashtags generation via provider API (toggle to mock if API key missing)
- Simple preview frames for IG Post, IG Reel, LinkedIn Post
- Export options: copy caption text, download image with overlaid branding, download JSON
- Compliance helper: inline checklist and language guardrails (heuristics)

Out of scope for MVP:
- Direct social publishing and OAuth integrations
- Full video generation/voiceover
- Multi-user accounts, billing
- Asset library and advanced brand kit

---

## 5) Success Criteria (MVP)
- **Functional**
  - User can complete the wizard and generate: IG Post caption+hashtags and preview image.
  - User can generate an IG Reel concept (script + shot list) and preview frame (no video rendering).
  - Export actions work (copy caption, download preview image as PNG).
- **Quality**
  - 95% of flows complete without errors in manual tests.
  - AI copy adheres to basic compliance heuristics (no prohibited claims; flagged if detected).
- **Adoption**
  - 3+ demo users complete Journey B end-to-end and report time saved vs. manual.
- **Performance**
  - Copy generation completes < 5s p95 with real API; < 1s with mock.

---

## 6) System Architecture (Netlify-first)
- **Frontend**: Static SPA (Vanilla JS or lightweight framework-free to keep infra simple for now)
  - Pages: `index.html` (home + CTA), `/create/` wizard views rendered client-side
  - State kept in `localStorage` during session and ephemeral in-memory store
- **Backend**: Netlify Functions
  - `generateCopy`: POST {goal, audience, type, style, bullets, brand} -> {caption, hashtags, cta, flags}
  - `imageCompose` (optional later): compose image with logo/brand overlay (can be client-side canvas for MVP)
  - `moderateCompliance`: optional function wrapping heuristic rules
- **Integration**
  - AI API (e.g., OpenAI/Claude/HuggingFace Inference) behind serverless function
  - Feature flag: if no API key, fall back to deterministic templates

---

## 7) Data Model (client-side)
```ts
// creation record (in-memory + localStorage)
{
  id: string,
  createdAt: number,
  goal: 'lead_gen'|'brand_awareness'|'community'|'traffic',
  audience: 'first_time'|'intl_investor'|'luxury'|'upgrader'|'family',
  type: 'ig_post'|'ig_reel'|'linkedin_post',
  style: 'direct'|'persuasive'|'personal'|'warm'|'authoritative',
  assets: Array<{ id: string, kind: 'image'|'video', dataUrl: string }>,
  copy: { caption: string, hashtags: string[], cta: string },
  flags: { compliance: string[] },
  preview: { imageDataUrl?: string }
}
```

---

## 8) Feature Breakdown and Work Packages

### WP-0: Project Setup
- Netlify site, `netlify/functions/` folder, `netlify.toml` ready
- Add `/create/` route with wizard shell

### WP-1: Wizard Flow + State
- Steps: Goal -> Audience -> Type -> Style -> Assets -> Preview
- Progress indicator; back/next; save-in-progress (localStorage)
- Validation (required selections, max asset count)

### WP-2: AI Copy Generation
- Function: `generateCopy`
  - Input: goal, audience, type, style, bullets (optional)
  - Output: caption, hashtags (10-20), CTA, flags (compliance)
- Provider integration behind env var `AI_API_KEY`; mock mode if absent

### WP-3: Preview Components
- IG Post frame: square canvas with sample device chrome
- LinkedIn Post frame: text-first mock
- IG Reel frame: poster image + script output (no video rendering)
- Export: copy caption; download PNG of canvas

### WP-4: Compliance Guardrails (Heuristic)
- Disallow phrases: guaranteed ROI, risk-free, insider, unlicensed
- Detect rates/returns claims (regex for % + ROI/Return)
- Flag list shown to user; allow edit and re-generate

### WP-5: Branding Basics
- Upload logo (PNG), choose brand color and font preset
- Overlay logo on preview (bottom-right), apply color to accents

### WP-6: Polish & Docs
- Empty states, error handling, loading spinners
- README updates, sample data, quick demo script

---

## 9) Implementation Timeline (2 weeks MVP)
- Day 1-2: WP-0, WP-1
- Day 3-4: WP-2 (mock first), basic preview
- Day 5-6: WP-3 export + IG/LinkedIn frames
- Day 7: WP-4 heuristics
- Day 8: WP-5 branding basics
- Day 9-10: WP-6 polish, QA, demo prep

---

## 10) Deliverables by User Journey
- **Journey A (IG Reel)**
  - Reel concept generator: script + shot list, poster frame preview
  - Caption + hashtags + CTA
  - Export poster PNG + copy caption

- **Journey B (IG/LinkedIn Post)**
  - Caption + hashtags + CTA
  - Branded preview image (square for IG, 1200x627 option for LinkedIn)
  - Export PNG + copy caption

---

## 11) Success Metrics & Acceptance Tests
- **Wizard completion rate**: >80% of started sessions reach Preview
- **Time-to-first-output**: < 2 minutes from landing to copy generated
- **Latency**: `generateCopy` p95 < 5s with AI provider
- **QA checklist**
  - Can run end-to-end on Netlify without secrets (mock mode)
  - With valid `AI_API_KEY`, outputs improve and flags still work
  - PNG export works in Chromium + Firefox

---

## 12) Risks and Mitigations
- **Platform risk**: Instagram adds native AI that reduces value
  - Mitigation: focus on workflow speed, brand consistency, compliance; multi-platform output
- **Compliance risk**: AI generates prohibited language
  - Mitigation: heuristic layer + editable copy + re-generate
- **API dependency**: Model cost/latency
  - Mitigation: mock mode; provider-agnostic wrapper; caching simple prompts
- **Scope creep**: Video rendering
  - Mitigation: confine MVP to script + poster; defer full video

---

## 13) Open Questions
- Which AI provider preferred/cost ceiling?
- Do we need Arabic copy generation in MVP?
- What specific RERA compliance rules to encode beyond generic claims?
- Is direct posting via Meta/LinkedIn APIs required in next phase?

---

## 14) Technical Notes (Netlify)
- Functions to add:
  - `netlify/functions/generateCopy.js`
- Env vars in Netlify UI:
  - `AI_API_KEY` (optional for mock)
- Local dev:
  - `netlify dev` serves functions at `/.netlify/functions/*`

---

## 15) Next Steps
- Implement WP-1 and WP-2 with mock generation
- Add preview export for IG Post
- Run usability test with 2-3 target users; iterate prompts and guardrails

---

## 16) Dummy Data and Simulated AI Policy (MVP)
- All user inputs, assets, and outputs in demos are sample/dummy content. No PII or real listings.
- `netlify/functions/generateCopy.js` is MOCK-ONLY and performs no external API calls.
- Any references to an AI provider are placeholders for a future phase. `AI_API_KEY` is not required for MVP.
- Generated captions, hashtags, CTA, compliance flags, posters, and previews are deterministic templates.
- Success criteria and QA for the MVP are evaluated against this simulated setup.
- When/if real providers are added, a separate section will define data handling, logging, and retention policies before activation.

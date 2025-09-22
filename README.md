<<<<<<< HEAD
Name: Youssef Abouelnour
Github user: Yousefaen
PRD Link: https://docs.google.com/document/d/1wucrZBUPdcKpbYVTcNRrSFNtEB69UyEuAIP5aRfrlz0/edit?usp=sharing
Netlify link: https://yousefaen-hw3.netlify.app/
Github repo: https://github.com/Yousefaen/yousefaen-hw3

# yousefaen-hw3
=======

# Planneri — MVP (Mock-Only)


Planneri is an AI-assisted content helper for Dubai real estate teams. This MVP generates dummy, platform-tailored captions (and a voiceover script for Instagram Reels) to speed up social posting. No real AI calls are made in this version.

## What’s Included
- Static site: `index.html` (landing) and `create.html` (wizard)
- Functions (mock-only): `netlify/functions/`
  - `generateCopy.js` — returns deterministic captions/hashtags and reel scripts
- Styling/logic: `assets/`

## How to Use (on your deployed site)
1. Open your site’s URL and click “Open the Creation Wizard,” or go to `/create.html`.
2. Follow the wizard steps:
   - Step 1: Choose your business goal (Lead Gen, Brand Awareness, Community, Traffic).
   - Step 2: Select the target audience (First-time buyers, International investors, Luxury, Upgraders, Family).
   - Step 3: Pick a content type:
     - Instagram Post (square)
     - Instagram Reel (concept) — generates a voiceover script + shot list
     - LinkedIn Post (1200×627)
   - Step 4: Select a writing style (Direct, Persuasive, Personal, Warm, Authoritative).
   - Step 5: Upload 1–5 images (kept in your browser only).
   - Step 6: Preview and finalize.
3. Click “Generate (Mock)” to produce dummy outputs tailored to your selections.
4. Adjust branding:
   - Pick a brand color.
   - Optionally upload a logo image for overlay (Remove Logo to clear).
5. Export and download:
   - Check all three compliance checkboxes.
   - Click “Export JSON” to download a creation record (selections, copy, flags, brand, assets).
   - Click “Download PNG” to save the preview image (Instagram = 512×512, LinkedIn = 1200×627).

## Notes & Limitations
- All outputs are mock/simulated. This MVP does not call external AI providers.
- Uploaded assets remain in the browser and are not stored remotely.
- Compliance flags are heuristic and for demonstration only.

## File Structure (reference)
- `index.html` — Landing page with value proposition and CTA to the wizard
- `create.html` — Multi-step content creation wizard
- `assets/styles.css` — Shared styles
- `assets/app.js` — Wizard logic, state, previews, export
- `netlify/functions/generateCopy.js` — Mocked caption/script generator
- `netlify/functions/hello.js` — Simple function used for early diagnostics (not used on landing)
- `netlify.toml` — Netlify configuration

<<<<<<< HEAD
### Option A: Drag-and-drop (static only)
If you only need the static page (no functions), you can drag-and-drop this folder to Netlify. But to include functions, use Option B.

### Option B: Connect a Git repo (recommended)
1. Push this folder to a new GitHub (or GitLab/Bitbucket) repository.
2. Go to https://app.netlify.com and click "Add new site" -> "Import an existing project".
3. Choose your repo.
4. For build settings:
   - Build command: leave empty (we don’t build)
   - Publish directory: `.`
   - Functions directory: `netlify/functions`
5. Click Deploy Site.
6. Once deployed, visit your site URL. The button will call `/.netlify/functions/hello`.

## Notes
- If you add dependencies to functions, create a `package.json` at the repo root or inside `netlify/functions/` and run `npm install <pkg>` there. Netlify will install them automatically during deploy.
- You can also call the function with `/api/hello` thanks to the redirect in `netlify.toml`.

>>>>>>> 1ceb0e0 (First commit using PRD as a reference)
=======
## Next Steps (beyond MVP)
- Real provider integration behind a serverless function (with feature flag)
- Arabic language support and additional brand style packs
- Direct platform publishing and richer compliance rules

>>>>>>> ec05663 (Readme edits)


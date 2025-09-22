Name: Youssef Abouelnour
Github user: Yousefaen
PRD Link: https://docs.google.com/document/d/1wucrZBUPdcKpbYVTcNRrSFNtEB69UyEuAIP5aRfrlz0/edit?usp=sharing
Netlify link: https://yousefaen-hw3.netlify.app/
# yousefaen-hw3
=======
# Hello World on Netlify

This is a minimal static site with a Netlify Function.

- Static page: `index.html`
- Function: `netlify/functions/hello.js`
- Config: `netlify.toml`

## Prerequisites
- Node.js 18+ installed
- Netlify CLI (optional for local testing):
  ```powershell
  npm install -g netlify-cli
  ```

## Run locally (with Netlify CLI)
1. Open PowerShell in this folder.
2. Start the Netlify local dev server:
   ```powershell
   netlify dev
   ```
3. Open the printed local URL (usually http://localhost:8888).
4. Use the creation wizard:
   - Go to http://localhost:8888/create.html
   - Walk through the steps (Goal → Audience → Type → Style → Assets → Preview)
   - Click "Generate (Mock)" to call `/.netlify/functions/generateCopy` (dummy, deterministic output)
   - Adjust brand color, optionally upload a logo (PNG), and download the PNG preview
   - For LinkedIn posts, the preview renders at 1200×627; Instagram/reel renders square

If you don’t want to use the CLI, you can open `index.html` directly in a browser for the static page. The function call will only work via the Netlify dev server or when deployed.

## Deploy to Netlify
You have two easy options:

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

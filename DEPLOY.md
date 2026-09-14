# Deploying The Alchemist

This is a static Vite build — `npm run build` produces a fully static `dist/`
folder (HTML/JS/CSS, no server required). Both options below serve that folder
from a global CDN.

Build settings, either way:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20 (or later) |

---

## Cloudflare Pages

### Option A — connect the GitHub repo (recommended)

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. Go to the Cloudflare dashboard → **Workers & Pages** → **Create application** →
   **Pages** → **Connect to Git**.
3. Select the `Ai-B` repository and the branch to deploy.
4. Framework preset: choose **Vite** (or **None**, then fill in manually).
5. Set:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click **Save and Deploy**. Cloudflare builds and deploys automatically; every
   push to the branch redeploys.

### Option B — deploy from your machine with Wrangler

```bash
npm install -g wrangler        # once
npm run build
npx wrangler pages deploy dist --project-name the-alchemist
```

The first run prompts you to log in (`wrangler login`) and creates the Pages
project if it doesn't exist yet. Subsequent runs redeploy the same project.

### Custom domain

Pages project → **Custom domains** → **Set up a custom domain**, then follow the
DNS instructions (automatic if the domain's already on Cloudflare).

---

## Vercel (alternative)

### Option A — Vercel dashboard

1. Go to [vercel.com/new](https://vercel.com/new) and import the `Ai-B` GitHub
   repository.
2. Framework preset: **Vite** (auto-detected).
3. Leave build settings as detected:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
4. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm install -g vercel           # once
vercel login
vercel                          # first run: link/create the project
vercel --prod                   # deploy to production
```

Vercel reads `package.json` and applies the same build/output settings
automatically; no `vercel.json` is required for this static Vite app.

---

## Notes

- The Google Fonts (`Cormorant Garamond`, `Manrope`) are loaded from
  `fonts.googleapis.com` at runtime — no extra CSP or build config is needed on
  either platform, but if you later add a strict CSP, allow that origin (and
  `fonts.gstatic.com` for the font files).
- All audio is synthesized client-side (no audio asset files to host).
- There's no server/API — this ships as pure static files, so it works
  identically on any static host (Netlify, GitHub Pages, S3+CloudFront, etc.) if
  you'd rather use something else later.

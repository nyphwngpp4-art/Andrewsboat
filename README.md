# Andrew's Marine Maintenance & Repair - Demo Site

Single-page static demo built by Agavi AI for Andrew's Marine Maintenance and Repair, LLC (Brownwood, TX / Lake Brownwood). Plain HTML + precompiled Tailwind CSS + vanilla JS. The built CSS is committed, so there is no deploy build step. Everything unverified is withheld or clearly marked; nothing on the page is invented.

## Files

- `index.html` - the whole page (plus the inline icon sprite and LocalBusiness schema)
- `assets/site.css` - **generated** stylesheet the page loads. Do not edit by hand.
- `assets/site.js` - hero video control, header state, live open/closed hours, and the text-message intake form
- `src/site.css` - Tailwind source: brand colors, font, and a few custom rules
- `scripts/build-icons.mjs` - builds the icon sprite in `index.html` from Phosphor Icons
- `fonts/` - self-hosted Archivo variable font (SIL OFL, license alongside)
- `images/` - hero video + poster, Google Business photos, and `images/facebook/` gallery photos
- `og-image.jpg`, `favicon.svg`, `apple-touch-icon.png` - link preview card and icons
- `_headers` - Cloudflare Pages response headers (keeps the demo out of search engines)

## Editing the site

The page uses Tailwind utility classes, compiled ahead of time. **After adding or changing classes in `index.html` or `assets/site.js`, rebuild the CSS**, or the new classes will not show up:

```
npm install        # first time only
npm run build:css  # or: npm run watch:css while editing
```

- Brand colors and the font live in the `@theme` block of `src/site.css` (e.g. `bg-pine`, `text-clay`, `border-line`).
- Icons: add a Phosphor icon name to `scripts/build-icons.mjs`, run `npm run build:icons`, then use `<svg class="icon size-5" aria-hidden="true"><use href="#i-NAME"/></svg>`.
- Preview locally with any static server, e.g. `python3 -m http.server` in the repo root.

## Deploy to Cloudflare Pages

Option A - direct upload (fastest for a demo):

1. Log in to the Cloudflare dashboard and go to **Workers & Pages > Create > Pages > Upload assets**.
2. Name the project (e.g. `andrews-marine-demo`).
3. Upload `index.html`, `_headers`, `assets/`, `fonts/`, `images/`, `og-image.jpg`, `favicon.svg`, and `apple-touch-icon.png`. Leave out `node_modules/` if you have run `npm install`.
4. Deploy. The site is live at `https://<project>.pages.dev` in under a minute.

Option B - Git integration (auto-deploys on push):

1. **Workers & Pages > Create > Pages > Connect to Git** and pick this repository.
2. Build settings: framework preset **None**, build command **(leave empty)**, output directory **/** (repo root). The committed `assets/site.css` is what ships. (Optionally set the build command to `npm run build:css` so Cloudflare rebuilds it on every push.)
3. Save and deploy. Every push to the connected branch redeploys.

**Demo:** served at `https://andrewsmarine.agaviai.com`. The social-preview tags (`og:url`, `og:image`, `twitter:image`) already use that absolute URL, which is what makes the link preview card appear when the link is texted.

The demo is kept out of search engines on purpose, since it carries Andrew's name and photos he has not approved yet: a `noindex` robots meta tag in `index.html` and an `X-Robots-Tag: noindex` header in `_headers`.

**At launch on the production domain:**

1. Remove the `noindex` meta tag from `index.html` and delete `_headers` (or its `X-Robots-Tag` line).
2. Change the three absolute `andrewsmarine.agaviai.com` URLs in the social-preview tags to the production domain, and add a `<link rel="canonical">`.
3. Point the Google Business Profile website link at the production domain, not the demo.

Production notes:

- The Request Service form has no server: it builds a structured text message in the visitor's messaging app (with a copy-paste fallback on desktops). If Andrew would rather get submissions by email, add a Cloudflare Pages Function (e.g. `functions/api/request.js`) that emails `Info@andrewsmarine.net` (MailChannels or an SMTP API) and point the form at it.
- **Domain:** `andrewsmarine.net` is already owned - the shop's email runs on it. The production site can map to that domain in Pages > Custom domains instead of buying a new one.

## Pending owner approvals (before launch)

Nothing below is rendered as fact until Andrew confirms it. Internal notes are kept outside this repo.

- **Gallery photos:** the six `images/facebook/` shots come from the shop's public Facebook page and need Andrew's OK.
- **Logo:** the header uses a text wordmark. Swap in his real logo file when he provides one; never recreate it from the sign photo.
- **Platinum:** price, term, coverage, and eligibility (see the HTML comment above the Platinum section).
- **Winterization:** price, booking cutoff, and capacity (see the HTML comment above the winterization panel).
- **Reviews and certifications:** verbatim quotes only, with permission; list only credentials he actually holds.
- **Contact details:** confirm (325) 320-2018 and Info@andrewsmarine.net are current.
- **Launch domain:** andrewsmarine.net, with or without www.
- **Imagery rule:** never publish the Google Street View image of the shop (Google copyright).
